import asyncio
import json
import logging
import os
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from aio_pika import connect_robust
from selenium import webdriver
from selenium.common.exceptions import TimeoutException, WebDriverException
from selenium.webdriver.support.ui import WebDriverWait

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("worker")

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/")
QUEUE_NAME = os.getenv("RABBITMQ_QUEUE", "browse_tasks")
SELENIUM_REMOTE_URL = os.getenv("SELENIUM_REMOTE_URL", "http://localhost:4444/wd/hub")
OUTPUT_DIR_ENV = os.getenv("OUTPUT_DIR")
OUTPUT_DIR = Path(OUTPUT_DIR_ENV) if OUTPUT_DIR_ENV else None


def fetch_html(url: str) -> str:
    options = webdriver.ChromeOptions()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    options.set_capability("pageLoadStrategy", "eager")

    driver: webdriver.Remote | None = None
    try:
        driver = webdriver.Remote(command_executor=SELENIUM_REMOTE_URL, options=options)
        driver.set_page_load_timeout(45)
        driver.set_script_timeout(30)

        try:
            driver.get(url)
        except TimeoutException:
            log.warning("Page load timeout: url=%s", url)

        try:
            WebDriverWait(driver, 10).until(
                lambda d: d.execute_script("return document.readyState") in ("interactive", "complete")
            )
        except WebDriverException:
            pass

        time.sleep(1)
        return driver.page_source
    finally:
        if driver is not None:
            driver.quit()


def save_result(task_id: str, url: str, html: str, output_dir: Path) -> tuple[Path, Path]:
    output_dir.mkdir(parents=True, exist_ok=True)

    html_path = output_dir / f"{task_id}.html"
    meta_path = output_dir / f"{task_id}.json"

    html_path.write_text(html, encoding="utf-8", errors="replace")
    meta_path.write_text(
        json.dumps(
            {
                "task_id": task_id,
                "url": url,
                "saved_at": datetime.now(timezone.utc).isoformat(),
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )

    return html_path, meta_path


async def handle_message(payload: dict[str, Any]) -> None:
    url = payload["url"]
    task_id = str(payload.get("task_id") or uuid.uuid4())

    log.info("Start task_id=%s url=%s", task_id, url)
    html = await asyncio.to_thread(fetch_html, url)

    if OUTPUT_DIR is not None:
        html_path, meta_path = await asyncio.to_thread(save_result, task_id, url, html, OUTPUT_DIR)
        log.info("Saved task_id=%s html=%s meta=%s", task_id, html_path, meta_path)

    log.info("HTML task_id=%s url=%s\n%s", task_id, url, html)
    log.info("Done task_id=%s", task_id)


async def main() -> None:
    connection = await connect_robust(RABBITMQ_URL)
    channel = await connection.channel()
    await channel.set_qos(prefetch_count=1)

    queue = await channel.declare_queue(QUEUE_NAME, durable=True)
    log.info("Waiting messages... queue=%s", QUEUE_NAME)

    async with queue.iterator() as iterator:
        async for message in iterator:
            async with message.process(requeue=False):
                payload = json.loads(message.body.decode("utf-8"))
                await handle_message(payload)


if __name__ == "__main__":
    asyncio.run(main())

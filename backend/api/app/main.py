import json
import os
import uuid
from contextlib import asynccontextmanager

from aio_pika import DeliveryMode, Message, connect_robust
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/")
QUEUE_NAME = os.getenv("RABBITMQ_QUEUE", "browse_tasks")


class BrowseRequest(BaseModel):
    url: HttpUrl


@asynccontextmanager
async def lifespan(app: FastAPI):
    rabbit = await connect_robust(RABBITMQ_URL)
    channel = await rabbit.channel()
    await channel.declare_queue(QUEUE_NAME, durable=True)

    app.state.rabbit = rabbit
    app.state.channel = channel
    try:
        yield
    finally:
        await rabbit.close()


app = FastAPI(title="Avito Browser Service", lifespan=lifespan)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/browse", status_code=202)
async def browse(req: BrowseRequest):
    channel = getattr(app.state, "channel", None)
    if channel is None or channel.is_closed:
        raise HTTPException(status_code=503, detail="RabbitMQ channel not available")

    task_id = str(uuid.uuid4())
    payload = {"task_id": task_id, "url": str(req.url)}

    msg = Message(
        body=json.dumps(payload).encode("utf-8"),
        delivery_mode=DeliveryMode.PERSISTENT,
        content_type="application/json",
        correlation_id=task_id,
    )

    await channel.default_exchange.publish(msg, routing_key=QUEUE_NAME)
    return {"status": "queued", "task_id": task_id}


import * as Yup from "yup";

Yup.addMethod(Yup.number, "moreThanSumOfFields", function (fields: string[], message?: string) {
  return this.test("moreThanSumOfFields", message ?? "", function (value) {
    const { parent, createError, path } = this;

    if (value === undefined || value === null) return true;

    const record = parent as Record<string, unknown>;
    let sum = 0;
    for (const key of fields) {
      const v = record[key];
      if (v === undefined || v === null || v === "") return true;
      const n = typeof v === "number" ? v : Number(v);
      if (!Number.isFinite(n)) return true;
      sum += n;
    }

    if (value > sum) return true;

    return createError({
      path,
      message: message ?? "Общая площадь должна быть больше суммы жилой площади и площади кухни",
    });
  });
});

import React from "react";
import { Input } from "@chakra-ui/react";
import { useField } from "formik";
import { FieldWrapper } from "./FieldWrapper";

type NumberFieldProps = {
  name: string;
  label: string;
  min?: number;
  max?: number;
};

export function NumberField({ name, label, min, max }: NumberFieldProps) {
  const [field, meta, helpers] = useField<number | "">(name);
  const error = meta.touched ? meta.error : undefined;

  return (
    <FieldWrapper label={label} error={error}>
      <Input
        type="number"
        inputMode="numeric"
        step={1}
        min={min}
        max={max}
        value={field.value}
        onBlur={() => helpers.setTouched(true)}
        onChange={(e) => {
          const raw = e.target.value;
          helpers.setValue(raw === "" ? "" : Number(raw));
        }}
      />
    </FieldWrapper>
  );
}


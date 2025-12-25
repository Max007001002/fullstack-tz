import React from "react";
import { useField } from "formik";
import { FieldWrapper } from "./FieldWrapper";
import { UiRadioGroup, UiRadioOption } from "../ui/UiRadioGroup";

type RadioGroupFieldProps = {
  name: string;
  label: string;
  options: UiRadioOption[];
};

export function RadioGroupField({ name, label, options }: RadioGroupFieldProps) {
  const [field, meta, helpers] = useField<string>(name);
  const error = meta.touched ? meta.error : undefined;

  return (
    <FieldWrapper label={label} error={error}>
      <UiRadioGroup
        name={name}
        value={field.value}
        options={options}
        onValueChange={(next) => {
          helpers.setValue(next);
          helpers.setTouched(true);
        }}
      />
    </FieldWrapper>
  );
}


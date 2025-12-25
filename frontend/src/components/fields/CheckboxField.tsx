import React from "react";
import { useField } from "formik";
import { FieldWrapper } from "./FieldWrapper";
import { UiCheckbox } from "../ui/UiCheckbox";

type CheckboxFieldProps = {
  name: string;
  label: string;
};

export function CheckboxField({ name, label }: CheckboxFieldProps) {
  const [field, meta, helpers] = useField<boolean>(name);
  const error = meta.touched ? meta.error : undefined;

  return (
    <FieldWrapper error={error}>
      <UiCheckbox
        checked={Boolean(field.value)}
        onCheckedChange={(checked) => {
          helpers.setValue(checked);
          helpers.setTouched(true);
        }}
        label={label}
      />
    </FieldWrapper>
  );
}

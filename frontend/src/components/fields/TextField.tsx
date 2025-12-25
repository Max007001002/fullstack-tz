import React from "react";
import { Input } from "@chakra-ui/react";
import { useField } from "formik";
import { FieldWrapper } from "./FieldWrapper";

type TextFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
};

export function TextField({ name, label, placeholder }: TextFieldProps) {
  const [field, meta] = useField<string>(name);
  const error = meta.touched ? meta.error : undefined;

  return (
    <FieldWrapper label={label} error={error}>
      <Input {...field} placeholder={placeholder} />
    </FieldWrapper>
  );
}


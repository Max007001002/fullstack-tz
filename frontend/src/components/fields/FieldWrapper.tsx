import React from "react";
import { Stack, Text } from "@chakra-ui/react";

type FieldWrapperProps = {
  label?: string;
  error?: string;
  children: React.ReactNode;
};

export function FieldWrapper({ label, error, children }: FieldWrapperProps) {
  return (
    <Stack gap="1">
      {label ? <Text fontWeight="600">{label}</Text> : null}
      {children}
      {error ? (
        <Text fontSize="sm" color="red.500">
          {error}
        </Text>
      ) : null}
    </Stack>
  );
}

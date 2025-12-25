import React from "react";
import { HStack, Text } from "@chakra-ui/react";

type UiCheckboxProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
};

export function UiCheckbox({ checked, onCheckedChange, label }: UiCheckboxProps) {
  return (
    <HStack gap="2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
      />
      <Text>{label}</Text>
    </HStack>
  );
}


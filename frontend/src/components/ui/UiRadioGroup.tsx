import React from "react";
import { HStack, Stack, Text } from "@chakra-ui/react";

export type UiRadioOption = { value: string; label: string };

type UiRadioGroupProps = {
  name: string;
  value: string;
  options: UiRadioOption[];
  onValueChange: (value: string) => void;
};

export function UiRadioGroup({ name, value, options, onValueChange }: UiRadioGroupProps) {
  return (
    <Stack gap="2">
      {options.map((opt) => (
        <HStack key={opt.value} gap="2">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onValueChange(opt.value)}
          />
          <Text>{opt.label}</Text>
        </HStack>
      ))}
    </Stack>
  );
}


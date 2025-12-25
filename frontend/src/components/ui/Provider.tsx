import React from "react";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

type ProviderProps = { children: React.ReactNode };

export function Provider({ children }: ProviderProps) {
  return <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>;
}

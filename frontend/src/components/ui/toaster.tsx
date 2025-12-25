import React from "react";
import { createToaster, Toaster, Toast } from "@chakra-ui/react";

export const toaster = createToaster({
  placement: "top-end",
  duration: 2500,
});

export function AppToaster() {
  return (
    <Toaster toaster={toaster}>
      {(t) => (
        <Toast.Root>
          <Toast.Indicator />
          <Toast.Title>{t.title}</Toast.Title>
          {t.description ? <Toast.Description>{t.description}</Toast.Description> : null}
          <Toast.CloseTrigger />
        </Toast.Root>
      )}
    </Toaster>
  );
}

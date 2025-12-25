import React from "react";
import { Box, Button, Heading, Separator, Stack, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";

import { AppToaster, toaster } from "../components/ui/toaster";
import { CheckboxField } from "../components/fields/CheckboxField";
import { NumberField } from "../components/fields/NumberField";
import { RadioGroupField } from "../components/fields/RadioGroupField";
import { TextField } from "../components/fields/TextField";
import { RealEstateFormValues, realEstateSchema } from "../validation/schema";

const initialValues: RealEstateFormValues = {
  name: "",
  address: "",
  floor: "",
  totalFloors: "",
  square: "",
  livingSquare: "",
  kitchenSquare: "",
  dealType: "sale",
  hasParking: false,
};

export default function App() {
  return (
    <Box maxW="720px" mx="auto" p="6">
      <AppToaster />
      <Heading size="lg" mb="6">
        Создание объявления
      </Heading>

      <Formik<RealEstateFormValues>
        initialValues={initialValues}
        validationSchema={realEstateSchema}
        onSubmit={(values, actions) => {
          try {
            const { dealType, hasParking, ...payload } = values;
            console.log("payload:", payload);
            console.log("demo:", { dealType, hasParking });
            toaster.success({
              title: "Отправлено",
              description: "Форма валидна, данные выведены в консоль.",
            });
          } finally {
            actions.setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Stack gap="4">
              <TextField name="name" label="Название объекта (name)" />
              <TextField name="address" label="Адрес (address)" />

              <NumberField
                name="totalFloors"
                label="Количество этажей в доме (totalFloors)"
                min={-3}
                max={200}
              />
              <NumberField name="floor" label="Этаж (floor)" min={-1} />

              <NumberField
                name="livingSquare"
                label="Жилая площадь (livingSquare)"
                min={0}
              />
              <NumberField
                name="kitchenSquare"
                label="Площадь кухни (kitchenSquare)"
                min={0}
              />
              <NumberField name="square" label="Площадь (square)" min={0} max={400} />

              <Separator />
              <Text fontWeight="600">Дополнительно (демо для Radio/Checkbox)</Text>

              <RadioGroupField
                name="dealType"
                label="Тип сделки (demo Radio)"
                options={[
                  { value: "sale", label: "Продажа" },
                  { value: "rent", label: "Аренда" },
                ]}
              />
              <CheckboxField name="hasParking" label="Есть парковка (demo Checkbox)" />

              <Button type="submit" disabled={isSubmitting}>
                Отправить
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </Box>
  );
}

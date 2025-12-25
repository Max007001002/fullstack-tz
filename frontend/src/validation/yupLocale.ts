import { setLocale } from "yup";

setLocale({
  mixed: {
    required: "Поле обязательно для заполнения",
  },
  number: {
    min: ({ min }) => `Значение не может быть меньше ${min}`,
    max: ({ max }) => `Значение не может быть больше ${max}`,
    integer: "Значение должно быть целым числом",
  },
});


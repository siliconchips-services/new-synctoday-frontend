import { validations } from './validations';

export const formRules = {
  first_name: (min?: number, max?: number, field?: string) => [
    validations.required.text(field),
    validations.min.text(min, field),
    validations.max.text(max, field),
    validations.pattern.firstName,
  ],
  last_name: (min?: number, max?: number, field?: string) => [
    validations.required.text(field),
    validations.min.text(min, field),
    validations.max.text(max, field),
    validations.pattern.lastName,
  ],
  name: (min?: number, max?: number, field?: string) => [
    validations.required.text(field),
    validations.min.text(min, field),
    validations.max.text(max, field),
  ],
  phone: (field?: string) => [
    validations.required.text(field),
    validations.pattern.phone,
  ],
};

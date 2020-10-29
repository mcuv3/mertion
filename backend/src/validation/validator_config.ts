import v from "validator";
import { ErrorField } from "../error/ErrorType";
enum ValidationFields {
  required = "required",
  positive = "positive",
  Length = "length",
}

interface Conf {
  validationField: ValidationFields;
  config?: LengthType;
}

interface ValidatorConfig {
  [className: string]: {
    [prop: string]: Conf[];
  };
}

interface LengthType {
  min: number;
  max: number;
}

export const registeredValidators: ValidatorConfig = {};

export function Required(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: [{ validationField: ValidationFields.required }],
  };
}

export function PositiveNumber(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: [{ validationField: ValidationFields.positive }],
  };
}

export function Length(conf: LengthType) {
  return function (target: any, propName: string) {
    registeredValidators[target.constructor.name] = {
      ...registeredValidators[target.constructor.name],
      [propName]: [{ validationField: ValidationFields.Length, config: conf }],
    };
  };
}

/*
    {
        className: 'User',
        obj:{
            name:"Mao",
            age:21,
            username:"mcuve",
        }
    }
*/

export function validate(
  className: keyof ValidatorConfig,
  obj: any
): ErrorField[] {
  const errors: ErrorField[] = [];
  const objValidatorConfig = registeredValidators[className];
  if (!objValidatorConfig) {
    return errors;
  }
  let isValid;
  for (const prop in objValidatorConfig) {
    for (const validator of objValidatorConfig[prop]) {
      switch (validator.validationField) {
        case ValidationFields.required:
          isValid = !v.isEmpty(obj[prop]);
          if (!isValid) errors.push({ error: "Field required", field: prop });
          break;
        case ValidationFields.positive:
          isValid = v.isInt(obj[prop], { min: 1 });
          if (!isValid) errors.push({ error: "Must be positive", field: prop });
          break;
        case ValidationFields.Length:
          if (typeof obj[prop] === "number") {
            isValid = v.isFloat(obj[prop].toString(), {
              min: validator.config?.min || -Number.MAX_VALUE,
              max: validator.config?.max || Number.MAX_VALUE,
            });
          } else if (typeof obj[prop] === "string") {
            isValid = v.isLength(obj[prop], {
              min: validator.config?.min || -Number.MAX_VALUE,
              max: validator.config?.max || Number.MAX_VALUE,
            });
          }
          if (!isValid)
            errors.push({
              field: prop,
              error: "The value is to short or greater than the required",
            });

          break;
      }
    }
  }
  return errors;
}

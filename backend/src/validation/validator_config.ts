import v from "validator";
import { ErrorField } from "../error/StandardResponse";
export enum ValidationFields {
  required = "required",
  positive = "positive",
  Length = "length",
  Image = "image",
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

export function ImageFile(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: [{ validationField: ValidationFields.Image }],
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

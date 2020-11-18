import { ErrorField } from "../error/StandardResponse";
import { registeredValidators, ValidationFields } from "./validator_config";
import v from "validator";
import { extension } from "../utils/fileExtension";
import { Upload } from "../types";

export abstract class Validator {
  protected abstract fields: { [prop: string]: string };
  protected abstract className: string;

  validate(): ErrorField[] {
    const errors: ErrorField[] = [];
    const objValidatorConfig = registeredValidators[this.className];
    const obj = this.fields;
    if (!objValidatorConfig) {
      return errors;
    }
    let isValid;
    for (const prop in objValidatorConfig) {
      console.log(prop);
      for (const validator of objValidatorConfig[prop]) {
        switch (validator.validationField) {
          case ValidationFields.required:
            isValid = !v.isEmpty(obj[prop]);
            if (!isValid) errors.push({ error: "Field required", field: prop });
            break;
          case ValidationFields.positive:
            isValid = v.isInt(obj[prop], { min: 1 });
            if (!isValid)
              errors.push({ error: "Must be positive", field: prop });
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
          case ValidationFields.Image:
            if (typeof obj[prop] !== "string") {
              // console.log((obj[prop] as any).filename);
              // const ext = extension((obj[prop] as any).filename);
              // if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg")
              //   errors.push({
              //     field: prop,
              //     error: "The file must be an image",
              //   });
            }
            break;
        }
      }
    }
    return errors;
  }
}

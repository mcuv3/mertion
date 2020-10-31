import { ErrorFieldClass } from "../generated/graphql";

export const convertErrorsResponse = (errors: ErrorFieldClass[]) =>
  errors.map((err) => {
    return {
      errors: [err.error],
      name: err.field,
    };
  });

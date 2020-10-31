import { message } from "antd";
import { FormInstance } from "antd/lib/form";
import { useForm } from "antd/lib/form/Form";
import { useEffect } from "react";
import { convertErrorsResponse } from "../util/formatErrorResponse";

export const useFormErrors = ({
  success,
  response,
}: {
  response: any;
  success?: Function;
}) => {
  const [form] = useForm();
  useEffect(() => {
    if (response && response.message) {
      response.success
        ? message.success(response?.message)
        : message.error(response?.message);
    }
    if (response?.errors) {
      form.setFields(convertErrorsResponse(response.errors));
    }
    if (response?.success && success) success();
  }, [response]);

  return { form };
};

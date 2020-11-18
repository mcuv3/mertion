import React, { useEffect, useState } from "react";
import {
  UpdateProfileMutationVariables,
  useMeQuery,
  useUpdateProfileMutation,
} from "../generated/graphql";
import { Button, Form, Input, Upload } from "antd";
import { WithRouterProps } from "next/dist/client/with-router";
import { useFormErrors } from "../hooks/useFormErrors";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { beforeUpload, getBase64 } from "../validation/validation";
import { UploadChangeParam } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";

interface Props {
  image?: { url: string; file?: Blob };
  setImage: ({}: { url: string; file?: Blob }) => void;
  label: string;
}

export const SelectUpload = ({ image, setImage, label }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (imageUrl: any) => {
        setLoading(false);
        setImage({
          file: info.file.originFileObj,
          url: imageUrl,
        });
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>{label}</div>
    </div>
  );

  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      multiple={false}
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {image?.url ? (
        <img
          src={image.url}
          alt="avatar"
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};

export default SelectUpload;

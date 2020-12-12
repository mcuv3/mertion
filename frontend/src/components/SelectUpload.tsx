import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import { UploadChangeParam } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import React, { useState } from "react";
import { beforeUpload, getBase64 } from "../validation/validation";

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

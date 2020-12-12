import { PictureOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import { UploadChangeParam } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import React, { useState } from "react";
import { beforeUpload, getBase64 } from "../validation/validation";

type imagePic = {
  url: string;
  file?: Blob | undefined;
};
interface Props {
  setImage: (image?: imagePic) => void;
  image?: imagePic | null;
}

export const ImagePreview: React.FC<Props> = ({ setImage, image }) => {
  const [loading, setLoading] = useState(false);

  const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === "uploading") setLoading(true);
    if (info.file.status === "done") {
      console.log("DONE");
      setLoading(false);
      getBase64(info.file.originFileObj, (imageUrl: any) => {
        setImage({
          file: info.file.originFileObj,
          url: imageUrl,
        });
      });
    }
  };

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
        loading ? (
          <h1>Loading</h1>
        ) : (
          <img src={image?.url} alt="avatar" style={{ height: "100%" }} />
        )
      ) : (
        <PictureOutlined style={{ fontSize: "1.5rem" }} />
      )}
    </Upload>
  );
};

import React, { useEffect, useState } from "react";
import { withApollo } from "../../lib/withApollo";
import { useMeQuery } from "../../generated/graphql";
import { Button, Form, Input, Upload } from "antd";
import { withRouter } from "next/router";
import { WithRouterProps } from "next/dist/client/with-router";
import { useFormErrors } from "../../hooks/useFormErrors";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { beforeUpload, getBase64 } from "../../validation/validation";
import { UploadChangeParam } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
//import ImgCrop from 'antd-img-crop';
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 24 },
};
function getFile(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
export const ConfigUser = ({ router }: WithRouterProps) => {
  const { data: me, loading: meLoading } = useMeQuery();
  const [loading, setLoading] = useState(false);
  const { form } = useFormErrors({ success: () => {}, response: {} });
  const [image, setImage] = useState<{ url: string; file?: Blob }>();

  useEffect(() => {
    if (router.query.user !== me?.me?.username && !meLoading) {
      router.push("/");
    } else if (me?.me) {
      form.setFields([
        { name: "username", value: me?.me?.username },
        { name: "name", value: me?.me?.name },
        { name: "about", value: me?.me?.about },
      ]);
      setImage({ url: me!.me!.picture as string });
    }
  }, [me?.me]);

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
      <div style={{ marginTop: 8 }}>Profile photo</div>
    </div>
  );

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <div style={{ alignSelf: "start", justifySelf: "start" }}>
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
        </div>
        <Form {...layout} size="middle" form={form} style={{ width: "100%" }}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true }]}
          >
            <Input placeholder="username" />
          </Form.Item>
          <Form.Item name="about" label="About me">
            <Input.TextArea
              placeholder="About you"
              maxLength={255}
              autoSize={{ minRows: 6, maxRows: 6 }}
            />
          </Form.Item>
        </Form>
      </div>
      <Button type="primary">Update Profile</Button>
    </div>
  );
};

export default withApollo({ ssr: true })(withRouter(ConfigUser));

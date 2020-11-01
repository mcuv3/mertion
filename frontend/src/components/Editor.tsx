import { Button, Tooltip } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React from "react";
import { PictureOutlined, SmileOutlined } from "@ant-design/icons";

interface Props {
  onSubmit: (val: string) => void;
  loading: boolean;
}

const featureIconStyle = {};

export const Editor = ({ loading, onSubmit }: Props) => {
  const ref = React.useRef() as React.RefObject<TextArea>;
  return (
    <div>
      <>
        <TextArea rows={3} ref={ref} placeholder="Share your gains" />
      </>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "0.3rem",
        }}
      >
        <div className="">
          <Tooltip key="comment-basic-like-1" title="icons">
            <SmileOutlined
              style={{ fontSize: "1rem", marginRight: "0.5rem" }}
            />
          </Tooltip>

          <Tooltip key="comment-basic-like-2" title="picture">
            <PictureOutlined style={{ fontSize: "1rem" }} />
          </Tooltip>
        </div>
        <Button
          htmlType="submit"
          loading={loading}
          onClick={() => onSubmit(ref?.current?.state.value || "")}
          type="primary"
        >
          mcweet
        </Button>
      </div>
    </div>
  );
};

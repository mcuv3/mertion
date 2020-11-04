import { Button, Tooltip } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useEffect, useState } from "react";
import { PictureOutlined, SmileOutlined } from "@ant-design/icons";
import { changeConfirmLocale } from "antd/lib/modal/locale";

interface Props {
  onSubmit?: (val: string) => void;
  loading: boolean;
  isReply?: boolean;
  change?: (val: string) => void;
  valueReply?: string;
}

export const Editor = ({
  loading,
  onSubmit,
  isReply = false,
  change,
  valueReply,
}: Props) => {
  const [value, setValue] = useState("");
  const submit = () => onSubmit && onSubmit(value);

  return (
    <div>
      <>
        <TextArea
          value={isReply ? valueReply : value}
          onChange={(e) => {
            if (isReply && change) change(e.target.value);
            else setValue(e.target.value);
          }}
          rows={3}
          placeholder="Share your gains"
        />
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
              style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}
            />
          </Tooltip>

          <Tooltip key="comment-basic-like-2" title="picture">
            <PictureOutlined style={{ fontSize: "1.5rem" }} />
          </Tooltip>
        </div>
        {!isReply && (
          <Button
            size="middle"
            htmlType="submit"
            loading={loading}
            onClick={submit}
            type="primary"
          >
            mcweet
          </Button>
        )}
      </div>
    </div>
  );
};

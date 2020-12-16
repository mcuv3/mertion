import { Button, Tooltip } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useEffect, useState } from "react";
import { PictureOutlined, SmileOutlined } from "@ant-design/icons";
import { __server__ } from "../util/constants";
import {} from "next";
import { IEmojiData, IEmojiPickerProps } from "emoji-picker-react";
import { ImagePreview } from "./ImagePreview";
let Picker: any;

interface Props {
  onSubmit: (val: string) => void;
  cancelReply?: () => void;
  loading: boolean;
  isReply?: boolean;
  setWithImage: () => void;
  success?: boolean;
}

export const Editor = ({
  loading,
  onSubmit,
  isReply = false,
  cancelReply,
  setWithImage,
  success,
}: Props) => {
  const [value, setValue] = useState("");
  const [Emoji, setEmoji] = useState<any>();
  const [showEmoji, setShowEmoji] = useState(false);

  useEffect(() => {
    if (success && !loading) {
      setShowEmoji(false);
      setValue("");
    }
  }, [success, loading]);

  const addEmojiHandler = (_: MouseEvent, data: IEmojiData) =>
    setValue((text) => text + data.emoji);

  useEffect(() => {
    if (process.browser) {
      (async () => {
        const pic = await import("emoji-picker-react");
        setEmoji(
          <pic.default
            disableSearchBar
            onEmojiClick={addEmojiHandler}
            disableAutoFocus={true}
            skinTone={pic.SKIN_TONE_MEDIUM_DARK}
            groupNames={{ smileys_people: "PEOPLE" }}
          />
        );
      })();
    }
  }, []);

  return (
    <div>
      <>
        <TextArea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={3}
          placeholder="Share your gains"
        />
        {showEmoji && Emoji}
      </>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "0.3rem",
        }}
      >
        <div>
          <Tooltip key="comment-basic-like-1" title="icons">
            <SmileOutlined
              onClick={() => setShowEmoji((sh) => !sh)}
              style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}
            />
          </Tooltip>

          {!isReply && (
            <Tooltip key="comment-basic-like-2" title="picture">
              <PictureOutlined
                style={{ fontSize: "1.5rem" }}
                onClick={() => setWithImage()}
              />
            </Tooltip>
          )}
        </div>
        <div>
          {isReply && (
            <Button
              size="middle"
              htmlType="submit"
              loading={loading}
              onClick={cancelReply}
              type="primary"
              danger
              style={{ marginRight: "0.5rem" }}
            >
              Cancel
            </Button>
          )}
          <Button
            size="middle"
            htmlType="submit"
            loading={loading}
            onClick={() => onSubmit(value)}
            type="primary"
          >
            {isReply ? "Reply" : "Mert"}
          </Button>
        </div>
      </div>
    </div>
  );
};

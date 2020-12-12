import { Button, Tooltip } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useEffect, useState } from "react";
import { PictureOutlined, SmileOutlined } from "@ant-design/icons";
import { __server__ } from "../util/isServer";
import {} from "next";
import { IEmojiData, IEmojiPickerProps } from "emoji-picker-react";
// import Picker, { SKIN_TONE_MEDIUM_DARK } from "emoji-picker-react";
let Picker: any;

interface Props {
  onSubmit?: (val: string) => void;
  loading: boolean;
  isReply?: boolean;
  change?: (val: string) => void;
  valueReply?: string;
  setWithImage: () => void;
  success?: boolean;
}

export const Editor = ({
  loading,
  onSubmit,
  isReply = false,
  change,
  valueReply,
  setWithImage,
  success,
}: Props) => {
  const [value, setValue] = useState("");

  const submit = () => onSubmit && onSubmit(value);
  const [Emoji, setEmoji] = useState<any>();
  const [showEmoji, setShowEmoji] = useState(false);

  useEffect(() => {
    if (success && !loading) setValue("");
  }, [success, loading]);

  const addrEmojiHandler = (event: MouseEvent, data: IEmojiData) => {
    setValue((text) => text + data.emoji);
  };

  useEffect(() => {
    if (process.browser) {
      (async () => {
        const pic = await import("emoji-picker-react");
        setEmoji(
          <pic.default
            disableSearchBar
            onEmojiClick={addrEmojiHandler}
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
          value={isReply ? valueReply : value}
          onChange={(e) => {
            if (isReply && change) change(e.target.value);
            else setValue(e.target.value);
          }}
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

          <Tooltip key="comment-basic-like-2" title="picture">
            <PictureOutlined
              style={{ fontSize: "1.5rem" }}
              onClick={() => setWithImage()}
            />
          </Tooltip>
          {/* {withImage && <ImagePreview />} */}
        </div>
        {!isReply && (
          <Button
            size="middle"
            htmlType="submit"
            loading={loading}
            onClick={submit}
            type="primary"
          >
            mert
          </Button>
        )}
      </div>
    </div>
  );
};

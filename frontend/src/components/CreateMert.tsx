import { Comment, message } from "antd";
import React, { useState } from "react";
import { updateCreateMert } from "../common/updateMert";
import { MeResponse, useCreateMertMutation } from "../generated/graphql";
import { Editor } from "./Editor";
import { ImagePreview } from "./ImagePreview";
import { UserAvatar } from "./user/UserAvatar";

interface Props {
  me: MeResponse;
  fatherId?: string;
}

export const CreateMert: React.FC<Props> = ({
  me: { username, picture },
  fatherId,
}) => {
  const [createMert, { loading, data }] = useCreateMertMutation({
    update: updateCreateMert(fatherId),
    notifyOnNetworkStatusChange: true,
  });

  const [withImage, setWithImage] = useState(false);
  const [image, setImage] = useState<{ url: string; file?: Blob } | null>();

  const create = async (mert: string) => {
    if (!image && mert == "") {
      return message.error("Please enter a mert :)");
    }
    const res = await createMert({
      variables: {
        mert,
        fatherId,
        picture: image?.file,
      },
    });
    if (res.data?.createMert.success) {
      setImage(null);
      setWithImage(false);
    } else {
      message.error(res?.data?.createMert.message);
    }
  };

  return (
    <Comment
      avatar={<UserAvatar picture={picture || ""} username={username || ""} />}
      content={
        <>
          <Editor
            loading={loading}
            onSubmit={create}
            setWithImage={() => setWithImage((i) => !i)}
            success={data?.createMert.success}
          />
          {withImage && (
            <ImagePreview image={image} setImage={(e) => setImage(e)} />
          )}
        </>
      }
    />
  );
};

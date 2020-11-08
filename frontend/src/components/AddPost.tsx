import { Comment, Avatar, Tooltip } from "antd";
import {
  BaseMertFragment,
  MeResponse,
  Mert,
  MertsDocument,
  MertsQuery,
  useCreateMertMutation,
} from "../generated/graphql";
const {} = Comment;
import React, { useState } from "react";
import { Editor } from "./Editor";
import { useRouter } from "next/router";
import { changeConfirmLocale } from "antd/lib/modal/locale";
import { updateCreateMert } from "../common/updateMert";
import { ImagePreview } from "./ImagePreview";

interface Props {
  me: MeResponse;
  fatherId?: string;
}

export const AddPost: React.FC<Props> = ({
  me: { username, picture },
  fatherId,
}) => {
  const router = useRouter();
  const [createMert, { loading, data }] = useCreateMertMutation({
    update: updateCreateMert(fatherId),
    notifyOnNetworkStatusChange: true,
  });
  const [withImage, setWithImage] = useState(false);
  const [image, setImage] = useState<{ url: string; file?: Blob } | null>();

  const create = async (mert: string) => {
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
    }
  };

  return (
    <Comment
      avatar={
        <div
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/${username}`);
          }}
        >
          <Avatar size="large" src={picture || ""} alt={username || ""} />
        </div>
      }
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

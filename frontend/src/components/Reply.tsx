import Avatar from "antd/lib/avatar/avatar";
import Modal from "antd/lib/modal/Modal";
import { Typography, Comment, message } from "antd";
import React, { useState } from "react";
import {
  MeResponse,
  Mert,
  useCreateMertMutation,
  useMeQuery,
} from "../generated/graphql";
import { withApollo } from "../lib/withApollo";
import { AddPost } from "./AddPost";
import { Editor } from "./Editor";
import { useRouter } from "next/router";
import { updateCreateMert } from "../common/updateMert";
const { Text } = Typography;
interface Props {
  fatherMert: Mert;
  close: (success: boolean) => void;
}

const Reply = ({ fatherMert, close }: Props) => {
  const { data: me } = useMeQuery();

  const [mert, setMert] = useState("");
  const [createMert, { loading }] = useCreateMertMutation({
    update: updateCreateMert(fatherMert?.id),
  });
  const create = async () => {
    const res = await createMert({
      variables: {
        mert,
        fatherId: fatherMert.id,
      },
    });
    if (!res.data?.createMert.success) {
      message.error(res.data?.createMert.message);
    } else close(true);
  };

  return (
    <Modal
      style={{ position: "relative" }}
      title={`Reply to ${fatherMert.user.username}`}
      visible
      onOk={create}
      onCancel={close.bind(this, false)}
    >
      <div
        style={{
          position: "absolute",
          borderLeft: "2px solid #ccc",
          height: "1.2rem",
          top: "6.8rem",
          left: "2.5rem",
        }}
      ></div>
      <div style={{ display: "flex", justifyContent: "start" }}>
        <Avatar
          src={fatherMert?.user?.picture || ""}
          alt={fatherMert?.user?.username || ""}
          style={{ marginRight: "1.2rem" }}
        />
        <Text>{fatherMert.mert}</Text>
      </div>
      <Comment
        avatar={
          <Avatar
            size="large"
            src={me?.me?.picture || ""}
            alt={me?.me?.username || ""}
          />
        }
        content={
          <Editor
            valueReply={mert}
            loading={loading}
            onSubmit={create}
            change={(val) => setMert(val)}
            isReply
            setWithImage={() => {}}
          />
        }
      />
      {/* <AddPost
        success={close}
        forceSubmit={submit}
        me={me?.me as MeResponse}
        fatherId={fatherMert.id}
      /> */}
    </Modal>
  );
};

export default Reply;

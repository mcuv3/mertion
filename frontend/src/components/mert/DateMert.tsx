import Tooltip from "antd/lib/tooltip";
import React from "react";
import dayjs from "../../util/dayjs";

interface Props {
  createdAt: number;
}

export const DateMert = ({ createdAt }: Props) => {
  return (
    <Tooltip title={dayjs().from(dayjs(new Date(createdAt)))}>
      <span>{dayjs().from(dayjs(new Date(createdAt)))}</span>
    </Tooltip>
  );
};

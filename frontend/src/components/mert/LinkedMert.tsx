import React from "react";

interface Props {
  isFather?: boolean;
  numComments: number;
}

export const LinkedMert = ({ isFather, numComments }: Props) => {
  return isFather && numComments > 0 ? (
    <div className="vertical_dotted_line"></div>
  ) : null;
};

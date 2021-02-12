import React, { PropsWithChildren } from "react";

export const SafeClick: React.FC<PropsWithChildren<{ onClick(): void }>> = ({
  children,
  onClick,
}) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {children}
    </div>
  );
};

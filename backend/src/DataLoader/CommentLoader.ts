import DataLoader from "dataloader";
import { Mert } from "../entities";

export const commentLoader = () =>
  new DataLoader<string, number>(async (commentsIds) => {
    const comments = await Mert.findByIds(commentsIds as string[], {
      relations: ["user"],
    });
    const formattedComments: Record<string, number> = {};
    comments.map((m) => {
      formattedComments[m.id] = 1;
    });
    return commentsIds.map((i) => formattedComments[i]);
  });

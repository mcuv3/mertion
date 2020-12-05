import { Reactions } from "../../types/Common";

export const toggleLikes = ({
  dislikes,
  likes,
  userId,
  reaction,
}: {
  likes: string[];
  dislikes: string[];
  userId: string;
  reaction: Reactions;
}) => {
  let likesSet = new Set(likes);
  let dislikesSet = new Set(dislikes);

  if (reaction === Reactions.Like) {
    if (likesSet.has(userId)) {
      likesSet.delete(userId);
    } else {
      dislikesSet.delete(userId);
      likesSet.add(userId);
    }
  } else {
    if (dislikesSet.has(userId)) dislikesSet.delete(userId);
    else {
      dislikesSet.add(userId);
      likesSet.delete(userId);
    }
  }
  likes = Array.from(likesSet);
  dislikes = Array.from(dislikesSet);
  return [likes, dislikes];
};

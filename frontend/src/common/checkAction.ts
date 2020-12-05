import { MeQuery, Reactions } from "../generated/graphql";

export const checkAction = (
  me: MeQuery,
  dislikes?: string[],
  likes?: string[]
): string | null => {
  if (new Set(likes).has(me?.me?.id || "")) return Reactions.Like;
  if (new Set(dislikes).has(me?.me?.id || "")) return Reactions.DisLike;
  return null;
};

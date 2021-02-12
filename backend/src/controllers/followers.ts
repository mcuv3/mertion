import { User } from "../entities";






export const followUser = async  (user:User,followUserId:string) => {
    const toFollowUser = await User.findOne(followUserId);
    if(!toFollowUser) throw new Error('User not found');
    const following = new Set(user.following);
    const followers = new Set(toFollowUser.followers);
    following.add(followUserId);
    followers.add(user.id);
    await  toFollowUser.save()
    await  user.save()
}
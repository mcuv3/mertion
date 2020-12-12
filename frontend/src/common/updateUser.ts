import { ApolloCache, gql, MutationUpdaterFn } from "@apollo/client";
import { FormInstance } from "antd/lib/form";
import { MeQuery, UpdateProfileMutation } from "../generated/graphql";

export const updateUser = ({
  me,
  form,
  cache,
  data,
}: {
  me?: MeQuery;
  form: FormInstance<any>;
  cache: ApolloCache<UpdateProfileMutation>;
  data: UpdateProfileMutation | null | undefined;
}) => {
  if (data?.changeProfile.success && me?.me) {
    const fragments = {
      fragment: gql`
        fragment _user on User {
          about
          name
          picture
          username
          backgroundPicture
        }
      `,
      data: {
        about: form.getFieldValue("about"),
        name: form.getFieldValue("name"),
        picture: data.changeProfile.picture || me.me.picture,
        username: form.getFieldValue("username"),
        backgroundPicture:
          data.changeProfile.backgroundImageUrl || me.me.backgroundPicture,
        age: form.getFieldValue("age"),
      },
    };
    cache.writeFragment({
      id: "User:" + me.me.id,
      ...fragments,
    });

    cache.writeFragment({
      id: "MeResponse:" + me.me.id,
      ...fragments,
      fragment: gql`
        fragment _me on MeResponse {
          about
          name
          age
          picture
          username
          backgroundPicture
        }
      `,
    });
  }
};

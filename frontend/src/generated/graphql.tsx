import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Query = {
  __typename?: "Query";
  me?: Maybe<MeResponse>;
  user?: Maybe<User>;
  mert?: Maybe<Mert>;
  merts?: Maybe<Array<Mert>>;
  usersReactions: UserReactionsResponse;
};

export type QueryUserArgs = {
  username?: Maybe<Scalars["String"]>;
};

export type QueryMertArgs = {
  mertId?: Maybe<Scalars["String"]>;
};

export type QueryMertsArgs = {
  cursor?: Maybe<Scalars["String"]>;
  mertId?: Maybe<Scalars["String"]>;
};

export type QueryUsersReactionsArgs = {
  reaction: Reactions;
  mertId: Scalars["String"];
};

export type MeResponse = {
  __typename?: "MeResponse";
  success: Scalars["Boolean"];
  message?: Maybe<Scalars["String"]>;
  errors?: Maybe<Array<ErrorFieldClass>>;
  email: Scalars["String"];
  id: Scalars["String"];
  username: Scalars["String"];
  picture: Scalars["String"];
  about: Scalars["String"];
  name: Scalars["String"];
  backgroundPicture: Scalars["String"];
  age: Scalars["Float"];
};

export type ErrorFieldClass = {
  __typename?: "ErrorFieldClass";
  field: Scalars["String"];
  error: Scalars["String"];
};

export type User = {
  __typename?: "User";
  id: Scalars["String"];
  name: Scalars["String"];
  username: Scalars["String"];
  age: Scalars["Int"];
  email: Scalars["String"];
  password: Scalars["String"];
  about: Scalars["String"];
  picture?: Maybe<Scalars["String"]>;
  backgroundPicture?: Maybe<Scalars["String"]>;
};

export type Mert = {
  __typename?: "Mert";
  id: Scalars["String"];
  mert: Scalars["String"];
  createdAt: Scalars["String"];
  picture?: Maybe<Scalars["String"]>;
  likes: Array<Scalars["String"]>;
  dislikes: Array<Scalars["String"]>;
  fatherId: Scalars["String"];
  userId: Scalars["String"];
  user: User;
  father?: Maybe<Mert>;
  comments: Scalars["Float"];
};

export type UserReactionsResponse = {
  __typename?: "UserReactionsResponse";
  success: Scalars["Boolean"];
  message?: Maybe<Scalars["String"]>;
  errors?: Maybe<Array<ErrorFieldClass>>;
  users: Array<User>;
};

/** like dislike */
export enum Reactions {
  Like = "Like",
  DisLike = "DisLike",
}

export type Mutation = {
  __typename?: "Mutation";
  signUp: SignUpResponse;
  logIn: MeResponse;
  logout: Scalars["Boolean"];
  createMert: MertCreationResponse;
  reactMert?: Maybe<ReactionsMertResponse>;
  changeProfile: UserUpdated;
};

export type MutationSignUpArgs = {
  profile_picture?: Maybe<Scalars["Upload"]>;
  fields: SingUpInput;
};

export type MutationLogInArgs = {
  fields: SingInInput;
};

export type MutationCreateMertArgs = {
  fields: MertInput;
};

export type MutationReactMertArgs = {
  mertId: Scalars["String"];
  reaction: Reactions;
};

export type MutationChangeProfileArgs = {
  bg_picture?: Maybe<Scalars["Upload"]>;
  profile_picture?: Maybe<Scalars["Upload"]>;
  fields: ChangeProfileInput;
};

export type SignUpResponse = {
  __typename?: "SignUpResponse";
  success: Scalars["Boolean"];
  message?: Maybe<Scalars["String"]>;
  errors?: Maybe<Array<ErrorFieldClass>>;
};

export type SingUpInput = {
  name: Scalars["String"];
  username: Scalars["String"];
  age: Scalars["Int"];
  email: Scalars["String"];
  password: Scalars["String"];
  about?: Maybe<Scalars["String"]>;
};

export type SingInInput = {
  email: Scalars["String"];
  password: Scalars["String"];
};

export type MertCreationResponse = {
  __typename?: "MertCreationResponse";
  success: Scalars["Boolean"];
  message?: Maybe<Scalars["String"]>;
  errors?: Maybe<Array<ErrorFieldClass>>;
  mert?: Maybe<Mert>;
};

export type MertInput = {
  mert: Scalars["String"];
  picture?: Maybe<Scalars["Upload"]>;
  fatherId?: Maybe<Scalars["String"]>;
};

export type ReactionsMertResponse = {
  __typename?: "ReactionsMertResponse";
  likes: Array<Scalars["String"]>;
  dislikes: Array<Scalars["String"]>;
};

export type UserUpdated = {
  __typename?: "UserUpdated";
  success: Scalars["Boolean"];
  message?: Maybe<Scalars["String"]>;
  errors?: Maybe<Array<ErrorFieldClass>>;
  picture?: Maybe<Scalars["String"]>;
  backgroundImageUrl?: Maybe<Scalars["String"]>;
};

export type ChangeProfileInput = {
  username: Scalars["String"];
  name: Scalars["String"];
  age: Scalars["Int"];
  about?: Maybe<Scalars["String"]>;
};

export type Subscription = {
  __typename?: "Subscription";
  newMert: Mert;
};

export type BaseMertFragment = { __typename?: "Mert" } & Pick<
  Mert,
  "id" | "mert" | "likes" | "dislikes" | "picture" | "createdAt" | "comments"
> & {
    user: { __typename?: "User" } & Pick<User, "id" | "username" | "picture">;
  };

export type CreateMertMutationVariables = Exact<{
  mert: Scalars["String"];
  picture?: Maybe<Scalars["Upload"]>;
  fatherId?: Maybe<Scalars["String"]>;
}>;

export type CreateMertMutation = { __typename?: "Mutation" } & {
  createMert: { __typename?: "MertCreationResponse" } & Pick<
    MertCreationResponse,
    "success" | "message"
  > & {
      mert?: Maybe<{ __typename?: "Mert" } & BaseMertFragment>;
      errors?: Maybe<
        Array<
          { __typename?: "ErrorFieldClass" } & Pick<
            ErrorFieldClass,
            "field" | "error"
          >
        >
      >;
    };
};

export type LoginMutationVariables = Exact<{
  email: Scalars["String"];
  password: Scalars["String"];
}>;

export type LoginMutation = { __typename?: "Mutation" } & {
  logIn: { __typename?: "MeResponse" } & Pick<
    MeResponse,
    | "success"
    | "message"
    | "email"
    | "username"
    | "picture"
    | "age"
    | "about"
    | "name"
    | "id"
    | "backgroundPicture"
  > & {
      errors?: Maybe<
        Array<
          { __typename?: "ErrorFieldClass" } & Pick<
            ErrorFieldClass,
            "field" | "error"
          >
        >
      >;
    };
};

export type LogOutMutationVariables = Exact<{ [key: string]: never }>;

export type LogOutMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "logout"
>;

export type ReactMertMutationVariables = Exact<{
  reaction: Reactions;
  mertId: Scalars["String"];
}>;

export type ReactMertMutation = { __typename?: "Mutation" } & {
  reactMert?: Maybe<
    { __typename?: "ReactionsMertResponse" } & Pick<
      ReactionsMertResponse,
      "likes" | "dislikes"
    >
  >;
};

export type SignUpMutationVariables = Exact<{
  picture?: Maybe<Scalars["Upload"]>;
  name: Scalars["String"];
  username: Scalars["String"];
  age: Scalars["Int"];
  email: Scalars["String"];
  password: Scalars["String"];
  about?: Maybe<Scalars["String"]>;
}>;

export type SignUpMutation = { __typename?: "Mutation" } & {
  signUp: { __typename?: "SignUpResponse" } & Pick<
    SignUpResponse,
    "message" | "success"
  > & {
      errors?: Maybe<
        Array<
          { __typename?: "ErrorFieldClass" } & Pick<
            ErrorFieldClass,
            "field" | "error"
          >
        >
      >;
    };
};

export type UpdateProfileMutationVariables = Exact<{
  picture?: Maybe<Scalars["Upload"]>;
  bg_picture?: Maybe<Scalars["Upload"]>;
  name: Scalars["String"];
  username: Scalars["String"];
  age: Scalars["Int"];
  about?: Maybe<Scalars["String"]>;
}>;

export type UpdateProfileMutation = { __typename?: "Mutation" } & {
  changeProfile: { __typename?: "UserUpdated" } & Pick<
    UserUpdated,
    "success" | "message" | "picture" | "backgroundImageUrl"
  > & {
      errors?: Maybe<
        Array<
          { __typename?: "ErrorFieldClass" } & Pick<
            ErrorFieldClass,
            "field" | "error"
          >
        >
      >;
    };
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = { __typename?: "Query" } & {
  me?: Maybe<
    { __typename?: "MeResponse" } & Pick<
      MeResponse,
      | "id"
      | "name"
      | "email"
      | "username"
      | "picture"
      | "age"
      | "about"
      | "backgroundPicture"
    >
  >;
};

export type MertQueryVariables = Exact<{
  mertId?: Maybe<Scalars["String"]>;
}>;

export type MertQuery = { __typename?: "Query" } & {
  mert?: Maybe<
    { __typename?: "Mert" } & {
      father?: Maybe<
        { __typename?: "Mert" } & Pick<
          Mert,
          "id" | "createdAt" | "likes" | "dislikes"
        > & {
            user: { __typename?: "User" } & Pick<
              User,
              "id" | "username" | "picture"
            >;
          }
      >;
    } & BaseMertFragment
  >;
};

export type MertsQueryVariables = Exact<{
  mertId?: Maybe<Scalars["String"]>;
  cursor?: Maybe<Scalars["String"]>;
}>;

export type MertsQuery = { __typename?: "Query" } & {
  merts?: Maybe<Array<{ __typename?: "Mert" } & BaseMertFragment>>;
};

export type UserQueryVariables = Exact<{
  username?: Maybe<Scalars["String"]>;
}>;

export type UserQuery = { __typename?: "Query" } & {
  user?: Maybe<
    { __typename?: "User" } & Pick<
      User,
      | "id"
      | "name"
      | "about"
      | "username"
      | "email"
      | "picture"
      | "age"
      | "backgroundPicture"
    >
  >;
};

export type UserReactionsQueryVariables = Exact<{
  reaction: Reactions;
  mertId: Scalars["String"];
}>;

export type UserReactionsQuery = { __typename?: "Query" } & {
  usersReactions: { __typename?: "UserReactionsResponse" } & Pick<
    UserReactionsResponse,
    "success" | "message"
  > & {
      users: Array<
        { __typename?: "User" } & Pick<User, "id" | "username" | "picture">
      >;
    };
};

export type NewMertSubscriptionVariables = Exact<{ [key: string]: never }>;

export type NewMertSubscription = { __typename?: "Subscription" } & {
  newMert: { __typename?: "Mert" } & BaseMertFragment;
};

export const BaseMertFragmentDoc = gql`
  fragment BaseMert on Mert {
    id
    mert
    likes
    dislikes
    picture
    createdAt
    user {
      id
      username
      picture
    }
    comments
  }
`;
export const CreateMertDocument = gql`
  mutation CreateMert($mert: String!, $picture: Upload, $fatherId: String) {
    createMert(
      fields: { mert: $mert, picture: $picture, fatherId: $fatherId }
    ) {
      mert {
        ...BaseMert
      }
      success
      errors {
        field
        error
      }
      message
    }
  }
  ${BaseMertFragmentDoc}
`;
export type CreateMertMutationFn = Apollo.MutationFunction<
  CreateMertMutation,
  CreateMertMutationVariables
>;

/**
 * __useCreateMertMutation__
 *
 * To run a mutation, you first call `useCreateMertMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMertMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMertMutation, { data, loading, error }] = useCreateMertMutation({
 *   variables: {
 *      mert: // value for 'mert'
 *      picture: // value for 'picture'
 *      fatherId: // value for 'fatherId'
 *   },
 * });
 */
export function useCreateMertMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateMertMutation,
    CreateMertMutationVariables
  >
) {
  return Apollo.useMutation<CreateMertMutation, CreateMertMutationVariables>(
    CreateMertDocument,
    baseOptions
  );
}
export type CreateMertMutationHookResult = ReturnType<
  typeof useCreateMertMutation
>;
export type CreateMertMutationResult = Apollo.MutationResult<CreateMertMutation>;
export type CreateMertMutationOptions = Apollo.BaseMutationOptions<
  CreateMertMutation,
  CreateMertMutationVariables
>;
export const LoginDocument = gql`
  mutation Login($email: String!, $password: String!) {
    logIn(fields: { email: $email, password: $password }) {
      success
      errors {
        field
        error
      }
      message
      email
      username
      picture
      age
      about
      name
      id
      backgroundPicture
    }
  }
`;
export type LoginMutationFn = Apollo.MutationFunction<
  LoginMutation,
  LoginMutationVariables
>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LoginMutation,
    LoginMutationVariables
  >
) {
  return Apollo.useMutation<LoginMutation, LoginMutationVariables>(
    LoginDocument,
    baseOptions
  );
}
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<
  LoginMutation,
  LoginMutationVariables
>;
export const LogOutDocument = gql`
  mutation LogOut {
    logout
  }
`;
export type LogOutMutationFn = Apollo.MutationFunction<
  LogOutMutation,
  LogOutMutationVariables
>;

/**
 * __useLogOutMutation__
 *
 * To run a mutation, you first call `useLogOutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogOutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logOutMutation, { data, loading, error }] = useLogOutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogOutMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LogOutMutation,
    LogOutMutationVariables
  >
) {
  return Apollo.useMutation<LogOutMutation, LogOutMutationVariables>(
    LogOutDocument,
    baseOptions
  );
}
export type LogOutMutationHookResult = ReturnType<typeof useLogOutMutation>;
export type LogOutMutationResult = Apollo.MutationResult<LogOutMutation>;
export type LogOutMutationOptions = Apollo.BaseMutationOptions<
  LogOutMutation,
  LogOutMutationVariables
>;
export const ReactMertDocument = gql`
  mutation ReactMert($reaction: Reactions!, $mertId: String!) {
    reactMert(reaction: $reaction, mertId: $mertId) {
      likes
      dislikes
    }
  }
`;
export type ReactMertMutationFn = Apollo.MutationFunction<
  ReactMertMutation,
  ReactMertMutationVariables
>;

/**
 * __useReactMertMutation__
 *
 * To run a mutation, you first call `useReactMertMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReactMertMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reactMertMutation, { data, loading, error }] = useReactMertMutation({
 *   variables: {
 *      reaction: // value for 'reaction'
 *      mertId: // value for 'mertId'
 *   },
 * });
 */
export function useReactMertMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ReactMertMutation,
    ReactMertMutationVariables
  >
) {
  return Apollo.useMutation<ReactMertMutation, ReactMertMutationVariables>(
    ReactMertDocument,
    baseOptions
  );
}
export type ReactMertMutationHookResult = ReturnType<
  typeof useReactMertMutation
>;
export type ReactMertMutationResult = Apollo.MutationResult<ReactMertMutation>;
export type ReactMertMutationOptions = Apollo.BaseMutationOptions<
  ReactMertMutation,
  ReactMertMutationVariables
>;
export const SignUpDocument = gql`
  mutation signUp(
    $picture: Upload
    $name: String!
    $username: String!
    $age: Int!
    $email: String!
    $password: String!
    $about: String
  ) {
    signUp(
      profile_picture: $picture
      fields: {
        username: $username
        name: $name
        age: $age
        email: $email
        password: $password
        about: $about
      }
    ) {
      message
      errors {
        field
        error
      }
      success
    }
  }
`;
export type SignUpMutationFn = Apollo.MutationFunction<
  SignUpMutation,
  SignUpMutationVariables
>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      picture: // value for 'picture'
 *      name: // value for 'name'
 *      username: // value for 'username'
 *      age: // value for 'age'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *      about: // value for 'about'
 *   },
 * });
 */
export function useSignUpMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SignUpMutation,
    SignUpMutationVariables
  >
) {
  return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(
    SignUpDocument,
    baseOptions
  );
}
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = Apollo.BaseMutationOptions<
  SignUpMutation,
  SignUpMutationVariables
>;
export const UpdateProfileDocument = gql`
  mutation updateProfile(
    $picture: Upload
    $bg_picture: Upload
    $name: String!
    $username: String!
    $age: Int!
    $about: String
  ) {
    changeProfile(
      profile_picture: $picture
      bg_picture: $bg_picture
      fields: { username: $username, name: $name, about: $about, age: $age }
    ) {
      success
      message
      errors {
        field
        error
      }
      picture
      backgroundImageUrl
    }
  }
`;
export type UpdateProfileMutationFn = Apollo.MutationFunction<
  UpdateProfileMutation,
  UpdateProfileMutationVariables
>;

/**
 * __useUpdateProfileMutation__
 *
 * To run a mutation, you first call `useUpdateProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProfileMutation, { data, loading, error }] = useUpdateProfileMutation({
 *   variables: {
 *      picture: // value for 'picture'
 *      bg_picture: // value for 'bg_picture'
 *      name: // value for 'name'
 *      username: // value for 'username'
 *      age: // value for 'age'
 *      about: // value for 'about'
 *   },
 * });
 */
export function useUpdateProfileMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateProfileMutation,
    UpdateProfileMutationVariables
  >
) {
  return Apollo.useMutation<
    UpdateProfileMutation,
    UpdateProfileMutationVariables
  >(UpdateProfileDocument, baseOptions);
}
export type UpdateProfileMutationHookResult = ReturnType<
  typeof useUpdateProfileMutation
>;
export type UpdateProfileMutationResult = Apollo.MutationResult<UpdateProfileMutation>;
export type UpdateProfileMutationOptions = Apollo.BaseMutationOptions<
  UpdateProfileMutation,
  UpdateProfileMutationVariables
>;
export const MeDocument = gql`
  query Me {
    me {
      id
      name
      email
      username
      picture
      age
      name
      about
      backgroundPicture
    }
  }
`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(
  baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>
) {
  return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
}
export function useMeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>
) {
  return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(
    MeDocument,
    baseOptions
  );
}
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const MertDocument = gql`
  query Mert($mertId: String) {
    mert(mertId: $mertId) {
      ...BaseMert
      father {
        id
        createdAt
        likes
        dislikes
        user {
          id
          username
          picture
        }
      }
    }
  }
  ${BaseMertFragmentDoc}
`;

/**
 * __useMertQuery__
 *
 * To run a query within a React component, call `useMertQuery` and pass it any options that fit your needs.
 * When your component renders, `useMertQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMertQuery({
 *   variables: {
 *      mertId: // value for 'mertId'
 *   },
 * });
 */
export function useMertQuery(
  baseOptions?: Apollo.QueryHookOptions<MertQuery, MertQueryVariables>
) {
  return Apollo.useQuery<MertQuery, MertQueryVariables>(
    MertDocument,
    baseOptions
  );
}
export function useMertLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MertQuery, MertQueryVariables>
) {
  return Apollo.useLazyQuery<MertQuery, MertQueryVariables>(
    MertDocument,
    baseOptions
  );
}
export type MertQueryHookResult = ReturnType<typeof useMertQuery>;
export type MertLazyQueryHookResult = ReturnType<typeof useMertLazyQuery>;
export type MertQueryResult = Apollo.QueryResult<MertQuery, MertQueryVariables>;
export const MertsDocument = gql`
  query Merts($mertId: String, $cursor: String) {
    merts(mertId: $mertId, cursor: $cursor) {
      ...BaseMert
    }
  }
  ${BaseMertFragmentDoc}
`;

/**
 * __useMertsQuery__
 *
 * To run a query within a React component, call `useMertsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMertsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMertsQuery({
 *   variables: {
 *      mertId: // value for 'mertId'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useMertsQuery(
  baseOptions?: Apollo.QueryHookOptions<MertsQuery, MertsQueryVariables>
) {
  return Apollo.useQuery<MertsQuery, MertsQueryVariables>(
    MertsDocument,
    baseOptions
  );
}
export function useMertsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MertsQuery, MertsQueryVariables>
) {
  return Apollo.useLazyQuery<MertsQuery, MertsQueryVariables>(
    MertsDocument,
    baseOptions
  );
}
export type MertsQueryHookResult = ReturnType<typeof useMertsQuery>;
export type MertsLazyQueryHookResult = ReturnType<typeof useMertsLazyQuery>;
export type MertsQueryResult = Apollo.QueryResult<
  MertsQuery,
  MertsQueryVariables
>;
export const UserDocument = gql`
  query User($username: String) {
    user(username: $username) {
      id
      name
      about
      username
      email
      picture
      age
      backgroundPicture
    }
  }
`;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useUserQuery(
  baseOptions?: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>
) {
  return Apollo.useQuery<UserQuery, UserQueryVariables>(
    UserDocument,
    baseOptions
  );
}
export function useUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>
) {
  return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(
    UserDocument,
    baseOptions
  );
}
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const UserReactionsDocument = gql`
  query UserReactions($reaction: Reactions!, $mertId: String!) {
    usersReactions(reaction: $reaction, mertId: $mertId) {
      success
      message
      users {
        id
        username
        picture
      }
    }
  }
`;

/**
 * __useUserReactionsQuery__
 *
 * To run a query within a React component, call `useUserReactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserReactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserReactionsQuery({
 *   variables: {
 *      reaction: // value for 'reaction'
 *      mertId: // value for 'mertId'
 *   },
 * });
 */
export function useUserReactionsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    UserReactionsQuery,
    UserReactionsQueryVariables
  >
) {
  return Apollo.useQuery<UserReactionsQuery, UserReactionsQueryVariables>(
    UserReactionsDocument,
    baseOptions
  );
}
export function useUserReactionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    UserReactionsQuery,
    UserReactionsQueryVariables
  >
) {
  return Apollo.useLazyQuery<UserReactionsQuery, UserReactionsQueryVariables>(
    UserReactionsDocument,
    baseOptions
  );
}
export type UserReactionsQueryHookResult = ReturnType<
  typeof useUserReactionsQuery
>;
export type UserReactionsLazyQueryHookResult = ReturnType<
  typeof useUserReactionsLazyQuery
>;
export type UserReactionsQueryResult = Apollo.QueryResult<
  UserReactionsQuery,
  UserReactionsQueryVariables
>;
export const NewMertDocument = gql`
  subscription newMert {
    newMert {
      ...BaseMert
    }
  }
  ${BaseMertFragmentDoc}
`;

/**
 * __useNewMertSubscription__
 *
 * To run a query within a React component, call `useNewMertSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewMertSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewMertSubscription({
 *   variables: {
 *   },
 * });
 */
export function useNewMertSubscription(
  baseOptions?: Apollo.SubscriptionHookOptions<
    NewMertSubscription,
    NewMertSubscriptionVariables
  >
) {
  return Apollo.useSubscription<
    NewMertSubscription,
    NewMertSubscriptionVariables
  >(NewMertDocument, baseOptions);
}
export type NewMertSubscriptionHookResult = ReturnType<
  typeof useNewMertSubscription
>;
export type NewMertSubscriptionResult = Apollo.SubscriptionResult<NewMertSubscription>;

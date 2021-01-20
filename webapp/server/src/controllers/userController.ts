import {gql} from "apollo-server";
import {Context} from "../context";
import isEmail from 'isemail';

export const userTypedefs = gql`
    
  type User implements Node {
    email: String!
    id: ID!
    name: String
  }
  
  type UserEdge {
    node: User
    cursor: String!
  }

  type UserConnection {
    pageInfo: PageInfo!
    edges: [UserEdge]!
  }

  extend type Query {
    users(after: String, before: String, pageSize: Int): UserConnection
  }

  extend type Mutation {
    signupUser(input: UserCreateInput!): SignUpPayload
  }

  input UserCreateInput {
    email: String!
    name: String
    password: String!
    clientMutationId: String
  }
  
  type SignUpPayload {
    user: User
    success: Boolean!
    message: String
    clientMutationId: String
  }
`

export const userResolvers = {
  Query: {
    users: (parent, args, ctx: Context) => {
      return ctx.prisma.user.findMany({cursor: {email: "asdf"}})
    }
  },
  Mutation: {
    signupUser: async (parent, args, ctx: Context) => {
      console.log("singing up user with stuff");
      console.log(args);
      console.log(ctx.user);
      const result: any = {clientMutationId: args.input.clientMutationId};

      if (isEmail.validate(args.input.email)) {
        const user = await ctx.prisma.user.create({data: {email: args.input.email, password: args.input.password, name: args.input.name}});
        result.success = true;
        result.user = user;
      } else {
        result.success = false;
        result.message = 'Email not valid';
      }

      return result;
    }
  }
}
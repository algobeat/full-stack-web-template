import {Context} from './context';
import {gql} from 'apollo-server';
import {PrismaClient} from '@prisma/client';
import {userResolvers, userTypedefs} from "./controllers/userController";
import * as _ from 'lodash';

export const rootTypeDefs = gql`

  interface Node {
    id: ID!
  }
  
  interface Payload {
    success: Boolean!
    message: String
  }


  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }
  
  type Query {
    me: User
  }
  
  type Mutation {
    login(input: LoginInput): LoginPayload
    logout: LogoutPayload
  }
  
  input LoginInput {
    email: String!
    password: String!
  }
  
  type LoginPayload implements Payload {
    success: Boolean!
    message: String
    user: User
    token: String
  }
  
  type LogoutPayload implements Payload {
    success: Boolean!
    message: String
  }
`


export const rootResolvers = {
  Query: {
    me: (parent, args, ctx: Context) => {
      if (ctx.user) {
        return ctx.user;
      } else {
        return null;
      }
    }
  },
  Mutation: {
    login: async (parent, args, ctx: Context) => {
      // use plaintext for now, and use email as token.
      // TODO: use passport for secure login, and pass a secure token.
      const user = await ctx.prisma.user.findUnique({where: {email: args.input.email}});
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }
      if (user.password === args.input.password) {
        return {
          success: true,
          user: user,
          token: user.email
        }
      } else {
        return {
          success: false,
          message: 'Password incorrect',
        }
      }
    },

    logout: async (parent, args, ctx: Context) => {
      return {
        success: true,
      }
    }
  }
}

export const typeDefs = [rootTypeDefs, userTypedefs];

export const resolvers = _.merge({}, rootResolvers, userResolvers);
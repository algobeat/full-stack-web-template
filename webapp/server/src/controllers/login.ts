import { Context } from '../context'
import jwt from 'jsonwebtoken'
import { gql } from 'apollo-server'
import { clearJWT, createJWT, decodeJWT, renewJWT } from '../utils'
import bcrypt from 'bcrypt'

export const loginTypeDefs = gql`
  extend type Query {
    me: User
  }

  extend type Mutation {
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

export const loginResolvers = {
  Query: {
    me: (parent, args, ctx: Context) => {
      if (ctx.user) {
        return ctx.user
      } else {
        return null
      }
    },
  },
  Mutation: {
    login: async (parent, args, ctx: Context) => {
      // use plaintext for now, and use email as token.
      // TODO: use passport for secure login, and pass a secure token.
      const user = await ctx.prisma.user.findUnique({
        where: { email: args.input.email },
      })
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        }
      }

      const result = await bcrypt.compare(args.input.password, user.password)
      if (result) {
        const token = renewJWT(user.email, ctx.res)
        return {
          success: true,
          user: user,
          token,
        }
      } else {
        return {
          success: false,
          message: 'Password incorrect',
        }
      }
    },

    logout: async (parent, args, ctx: Context) => {
      if (!ctx.user) {
        return {
          success: false,
          message: 'Not logged in in the first place',
        }
      }
      clearJWT(ctx.res)
      return {
        success: true,
      }
    },
  },
}

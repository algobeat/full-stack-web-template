import { Context } from '../context'
import jwt from 'jsonwebtoken'
import { gql } from 'apollo-server'
import { clearJWT, createJWT, decodeJWT, renewJWT } from '../utils'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { promisify } from 'util'

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
    rememberMe: Boolean
  }

  type LoginPayload implements Payload {
    success: Boolean!
    message: String
    user: User
    token: String
    refresh: String
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
        const token = renewJWT(user.id, ctx.res)

        const payload = {
          success: true,
          user: user,
          token,
        } as any

        // persist a refresh session token too
        const expiryIn = args.input.rememberMe
          ? 31 * 24 * 60 * 60 * 1000 // 1 month
          : 1 * 24 * 60 * 60 * 1000 // 1 day
        const refreshTokenBytes = crypto.randomBytes(48)
        const refreshToken = refreshTokenBytes.toString('hex')
        const refreshExpiry = new Date(Date.now() + expiryIn)
        await ctx.prisma.session.create({
          data: {
            user: { connect: { id: user.id } },
            token: refreshToken,
            expires: refreshExpiry,
          },
        })
        payload.refreshToken = refreshToken
        ctx.res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          expires: refreshExpiry,
        })

        return payload
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

      // clear his refresh token
      if (ctx.req.cookies && ctx.req.cookies.refreshToken) {
        const token = ctx.req.cookies.refreshToken
        const session = await ctx.prisma.session.findUnique({
          where: { token },
        })
        if (session && session.userId === ctx.user.id) {
          await ctx.prisma.session.delete({ where: { token } })
        }
        ctx.res.clearCookie('refreshToken')
      }

      return {
        success: true,
      }
    },
  },
}

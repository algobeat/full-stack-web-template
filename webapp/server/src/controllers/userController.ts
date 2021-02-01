import { gql } from 'apollo-server'
import { Context } from '../context'
import { FindManyUserArgs, User } from '@prisma/client'
import { decodeGlobalId, encodeGlobalId } from '../utils'
import bcrypt from 'bcrypt'
import {
  validateEmail,
  validatePassword,
} from '../../../src/api/validation/user.validation'
import { isAccepted } from '../../../src/api/validation'
import crypto from 'crypto'
import { PrismaClient } from '@prisma/client'

export const userTypeDefs = gql`
  enum UserRole {
    USER
    ADMIN
  }

  type User implements Node {
    email: String
    id: ID!
    name: String
    role: UserRole!

    emailConfirmed: Boolean
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
    users(after: ID, before: ID, first: Int): UserConnection
    user(id: ID): User
  }

  extend type Mutation {
    signupUser(input: UserCreateInput!): SignUpPayload
    changePassword(input: ChangePasswordInput!): ChangePasswordPayload
    editProfile(input: EditProfileInput!): EditProfilePayload
  }

  input ChangePasswordInput {
    id: ID
    currentPassword: String!
    newPassword: String!
  }

  type ChangePasswordPayload {
    success: Boolean!
    message: String
  }

  input UserCreateInput {
    email: String!
    name: String
    password: String!
  }

  type SignUpPayload {
    user: User
    success: Boolean!
    message: String
  }

  input EditProfileInput {
    id: ID
    email: String
    name: String
    role: UserRole
  }

  type EditProfilePayload {
    user: User
    success: Boolean!
    message: String
  }
`

// Assumes auth checks have been done.
async function invalidateAndSendEmailConfirmation(
  user: User,
  prisma: PrismaClient,
) {
  const newToken = crypto.randomBytes(48).toString()

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailConfirmationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day expiry
      emailConfirmationToken: newToken,
      emailConfirmed: false,
    },
  })

  // TODO: Use your email API to send the user their confirmation email.
}

export const userResolvers = {
  Query: {
    users: async (parent, args, ctx: Context) => {
      const findManyArgs: FindManyUserArgs = { orderBy: { id: 'asc' } }
      let reversed = false
      if (args.after) {
        const { type, id } = decodeGlobalId(args.after)
        if (type === 'User') {
          findManyArgs.cursor = { id: Number(id) }
          findManyArgs.skip = 1
        }
      } else if (args.before) {
        const { type, id } = decodeGlobalId(args.before)
        if (type === 'User') {
          findManyArgs.cursor = { id: Number(id) }
          findManyArgs.orderBy = { id: 'desc' }
          findManyArgs.skip = 1
          reversed = true
        }
      }

      if (args.first) {
        findManyArgs.take = args.first
      } else {
        findManyArgs.take = 20
      }

      const users = await ctx.prisma.user.findMany(findManyArgs)
      if (reversed) {
        users.reverse()
      }
      const result: any = {
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: true,
          startCursor: users.length
            ? encodeGlobalId('User', '' + users[0].id)
            : null,
          endCursor: users.length
            ? encodeGlobalId('User', '' + users[users.length - 1].id)
            : null,
        },
        edges: users.map((user) => {
          return {
            node: user,
            cursor: encodeGlobalId('User', '' + user.id),
          }
        }),
      }

      if (users.length !== findManyArgs.take) {
        if (reversed) {
          result.pageInfo.hasPreviousPage = false
        } else {
          result.pageInfo.hasNextPage = false
        }
      }

      return result
    },

    user: async (parent, args, ctx: Context) => {
      let userId = ctx.user?.id
      if (args.id) {
        const providedId = decodeGlobalId(args.id)
        if (providedId.type !== 'User') {
          return null
        }
        userId = Number(providedId.id)
      }
      return await ctx.prisma.user.findUnique({ where: { id: userId } })
    },
  },
  Mutation: {
    signupUser: async (parent, args, ctx: Context) => {
      const result: any = { clientMutationId: args.input.clientMutationId }

      if (!isAccepted(validatePassword(args.input.password))) {
        result.success = false
        result.message = validatePassword(args.input.password)
      } else if (!isAccepted(validateEmail(args.input.email))) {
        result.success = false
        result.message = validateEmail(args.input.email)
      } else {
        const hashedPassword = await bcrypt.hash(args.input.password, 10)
        try {
          const sameEmail = await ctx.prisma.user.findUnique({
            where: { email: args.input.email?.toLowerCase() },
          })
          if (sameEmail) {
            result.success = false
            result.message = 'A user with that email already exists'
          } else {
            const user = await ctx.prisma.user.create({
              data: {
                email: args.input.email?.toLowerCase(),
                password: hashedPassword,
                name: args.input.name,
              },
            })
            result.success = true
            result.user = user

            await invalidateAndSendEmailConfirmation(user, ctx.prisma)
          }
        } catch (error) {
          result.success = false
          result.message = error.message
        }
      }

      return result
    },

    changePassword: async (parent, args, ctx: Context) => {
      if (!ctx.user) {
        return { success: false, message: 'You must be logged in to do this' }
      }

      let targetUserId = ctx.user.id
      if (args.input.id) {
        const providedId = decodeGlobalId(args.input.id)
        if (providedId.type !== 'User') {
          return { success: false, message: 'Provided user ID is invalid' }
        }
        targetUserId = Number(providedId.id)
      }

      // only admin or the user himself can change password
      if (ctx.user.role === 'ADMIN' || ctx.user.id === targetUserId) {
        const user = await ctx.prisma.user.findUnique({
          where: { id: targetUserId },
        })
        if (!user) {
          return { success: false, message: 'User not found' }
        }
        const passwordCheck = await bcrypt.compare(
          args.input.currentPassword,
          user.password,
        )
        if (!passwordCheck) {
          return { success: false, message: 'Current password incorrect' }
        }

        if (!isAccepted(validatePassword(args.input.newPassword))) {
          return {
            success: false,
            message: validatePassword(args.input.newPassword),
          }
        }

        await ctx.prisma.user.update({
          where: { id: targetUserId },
          data: { password: await bcrypt.hash(args.input.newPassword, 10) },
        })

        return { success: true }
      } else {
        return { success: false, message: 'Permission denied' }
      }
    },

    editProfile: async (parent, args, ctx: Context) => {
      if (!ctx.user) {
        return { success: false, message: 'You must be logged in to do this' }
      }

      let targetUserId = ctx.user.id
      if (args.input.id) {
        const providedId = decodeGlobalId(args.input.id)
        if (providedId.type !== 'User') {
          return { success: false, message: 'Provided user ID is invalid' }
        }
        targetUserId = Number(providedId.id)
      }

      // only admin or the user himself can change profile
      if (ctx.user.role === 'ADMIN' || ctx.user.id === targetUserId) {
        const user = await ctx.prisma.user.findUnique({
          where: { id: targetUserId },
        })

        if (!user) {
          return { success: false, message: 'user not found' }
        }

        if (args.input.email && !isAccepted(validateEmail(args.input.email))) {
          return { success: false, message: validateEmail(args.input.email) }
        }

        let newRole = user.role
        if (args.input.role) {
          // Only admin can change role
          if (ctx.user.role === 'ADMIN') {
            newRole = args.input.role
          } else if (newRole !== args.input.role) {
            return {
              success: false,
              message: "You do not have permission to change this user's role",
            }
          }
        }

        const newUser = await ctx.prisma.user.update({
          where: { id: targetUserId },
          data: {
            email: args.input.email?.toLowerCase() || undefined,
            name: args.input.name || undefined,
            role: newRole,
          },
        })

        if (args.input.email) {
          await invalidateAndSendEmailConfirmation(user, ctx.prisma)
        }

        return {
          success: true,
          user: newUser,
        }
      }
    },
  },
  User: {
    id: (parent) => {
      return encodeGlobalId('User', parent.id)
    },

    emailConfirmed: (parent, args, ctx: Context) => {
      // Only admins or the user himself can see their email confirmation status
      if (
        ctx.user &&
        (ctx.user.id === parent.id || ctx.user.role === 'ADMIN')
      ) {
        return parent.emailConfirmed
      } else {
        return null
      }
    },

    email: (parent, args, ctx: Context) => {
      // Only admins or the user himself can see their own email.
      // In applications where the user can choose to make their email public, it would go here too.
      if (
        ctx.user &&
        (ctx.user.id === parent.id || ctx.user.role === 'ADMIN')
      ) {
        return parent.email
      } else {
        return null
      }
    },
  },
}

import { gql } from 'apollo-server'
import { Context } from '../context'
import isEmail from 'isemail'
import { FindManyUserArgs } from '@prisma/client'
import { decodeGlobalId, encodeGlobalId } from '../utils'
import bcrypt from 'bcrypt'

export const userTypeDefs = gql`
  enum UserRole {
    USER
    ADMIN
  }

  type User implements Node {
    email: String!
    id: ID!
    name: String
    role: UserRole
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
  },
  Mutation: {
    signupUser: async (parent, args, ctx: Context) => {
      const result: any = { clientMutationId: args.input.clientMutationId }

      if (isEmail.validate(args.input.email)) {
        const hashedPassword = await bcrypt.hash(args.input.password, 10)
        const user = await ctx.prisma.user.create({
          data: {
            email: args.input.email,
            password: hashedPassword,
            name: args.input.name,
          },
        })
        result.success = true
        result.user = user
      } else {
        result.success = false
        result.message = 'Email not valid'
      }

      return result
    },
  },
  User: {
    id: (parent) => {
      return encodeGlobalId('User', parent.id)
    },
  },
}

import { gql } from 'apollo-server'
import { userResolvers, userTypeDefs } from './controllers/userController'
import * as _ from 'lodash'
import { loginResolvers, loginTypeDefs } from './controllers/login'

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
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`

export const rootResolvers = {}

export const typeDefs = [rootTypeDefs, userTypeDefs, loginTypeDefs]

export const resolvers = _.merge(
  {},
  rootResolvers,
  userResolvers,
  loginResolvers,
)

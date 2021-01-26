import dotenv from 'dotenv'
import { ApolloServer } from 'apollo-server-express'
import { typeDefs, resolvers } from './schema'
import { createContext } from './context'
import cookieParser from 'cookie-parser'
import express from 'express'

dotenv.config()

const app = express()

app.use(cookieParser())

const server = new ApolloServer({ typeDefs, resolvers, context: createContext })
server.applyMiddleware({ app })

app.listen({ port: 4000 }, () =>
  console.log(
    `🚀 Server ready at: http://localhost:4000\n⭐️ See sample queries: http://pris.ly/e/ts/graphql-sdl-first#using-the-graphql-api`,
  ),
)

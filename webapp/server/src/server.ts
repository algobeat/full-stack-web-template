import dotenv from 'dotenv'
import { ApolloServer } from 'apollo-server-express'
import { typeDefs, resolvers } from './schema'
import { createContext, startRemovingExpiredSessions } from './context'
import cookieParser from 'cookie-parser'
import express from 'express'
import * as path from 'path'

dotenv.config()

const app = express()

app.use(cookieParser())

const server = new ApolloServer({ typeDefs, resolvers, context: createContext })
server.applyMiddleware({ app })

app.use(express.static(path.join(__dirname, '../../build')))

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'))
})

startRemovingExpiredSessions()

app.listen({ port: 4000 }, () =>
  console.log(
    `🚀 Server ready at: http://localhost:4000\n⭐️ See sample queries: http://pris.ly/e/ts/graphql-sdl-first#using-the-graphql-api`,
  ),
)

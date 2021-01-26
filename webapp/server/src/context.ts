import { PrismaClient, User } from '@prisma/client'
import { ContextFunction } from 'apollo-server-core'
import { ExpressContext } from 'apollo-server-express/src/ApolloServer'
import { Request, Response } from 'express'
import { createJWT, decodeJWT, renewJWT } from './utils'

const prisma = new PrismaClient()

export interface Context {
  prisma: PrismaClient
  user?: User
  req: Request
  res: Response
}

export async function createContext(args: ExpressContext): Promise<Context> {
  const ctx: Context = { prisma, req: args.req, res: args.res }

  if (args.req.cookies && args.req.cookies.authorization) {
    const payload = decodeJWT(args.req.cookies.authorization)

    if (payload && payload.valid) {
      const user = await prisma.user.findUnique({
        where: { email: payload.email },
      })
      if (user) {
        ctx.user = user
      }

      if (payload.shouldRefresh) {
        renewJWT(payload.email, ctx.res)
      }
    }
  }

  return ctx
}

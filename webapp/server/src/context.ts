import { PrismaClient, User, Session } from '@prisma/client'
import { ContextFunction } from 'apollo-server-core'
import { ExpressContext } from 'apollo-server-express/src/ApolloServer'
import { Request, Response } from 'express'
import { createJWT, decodeJWT, renewJWT, sleep } from './utils'

const prisma = new PrismaClient()

export interface Context {
  prisma: PrismaClient
  user?: User
  req: Request
  res: Response
}

export async function startRemovingExpiredSessions() {
  while (true) {
    // Every 2 minutes, prune expired sessions.
    await sleep(2 * 60 * 1000)
    try {
      await prisma.session.deleteMany({
        where: { expires: { lte: new Date() } },
      })
    } catch (e) {
      console.log('exception while pruning sessions: ' + e.message)
    }
  }
}

export async function createContext(args: ExpressContext): Promise<Context> {
  const ctx: Context = { prisma, req: args.req, res: args.res }

  if (
    args.req.cookies &&
    (args.req.cookies.authorization || args.req.cookies.refreshToken)
  ) {
    const payload = args.req.cookies.authorization
      ? decodeJWT(args.req.cookies.authorization)
      : undefined

    let refreshSession: Session | undefined = undefined

    if (
      (payload && !payload.active) ||
      (!payload && args.req.cookies.refreshToken)
    ) {
      // check for refresh token
      if (args.req.cookies.refreshToken) {
        const session = await ctx.prisma.session.findUnique({
          where: { token: args.req.cookies.refreshToken },
        })
        if (session && session.expires > new Date()) {
          refreshSession = session
        }
      }
    }

    if (payload && payload.active) {
      ctx.user =
        (await prisma.user.findUnique({
          where: { id: payload.userId },
        })) || undefined

      if (payload.shouldRefresh || !payload.active) {
        renewJWT(payload.userId, ctx.res)
      }
    } else if (refreshSession) {
      ctx.user =
        (await prisma.user.findUnique({
          where: { id: refreshSession.userId },
        })) || undefined
      if (ctx.user) {
        renewJWT(ctx.user.id, ctx.res)
      }
    }
  }

  return ctx
}

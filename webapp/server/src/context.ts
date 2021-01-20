import { PrismaClient, User } from '@prisma/client'
import {ContextFunction} from "apollo-server-core";
import {ExpressContext} from "apollo-server-express/src/ApolloServer";

const prisma = new PrismaClient()

export interface Context {
  prisma: PrismaClient,
  user?: User
}

export async function createContext(args: ExpressContext): Promise<Context> {
  const ctx: Context = { prisma };

  if (args.req.headers && args.req.headers.authorization) {
    // TODO: use proper secure auth.
    const user = await prisma.user.findOne({where: {email: args.req.headers.authorization}});
    if (user) {
      ctx.user = user;
    }
  }

  return ctx;
}


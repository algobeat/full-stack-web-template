import jwt from 'jsonwebtoken'
import { stringify } from 'querystring'
import express from 'express'

export function encodeGlobalId(type: string, id: string) {
  return Buffer.from(`${type}_${id}`, 'binary').toString('base64')
}

export function decodeGlobalId(globalId: string) {
  const decoded = Buffer.from(globalId, 'base64').toString('binary')
  const [type, id] = decoded.split('_')

  return { type, id }
}

export interface JWTPayload {
  userId: number
  expires: number
  expiresDate: Date
  active: boolean
  shouldRefresh: boolean
}

// 20 minute expiry by default
export function createJWT(userId: number, expiresIn: number = 20 * 60 * 1000) {
  return jwt.sign(
    { userId: userId, expires: Date.now() + expiresIn },
    process.env.AUTH_SIGN_SECRET!,
  )
}

export function decodeJWT(token: string): JWTPayload | null {
  if (!jwt.verify(token, process.env.AUTH_SIGN_SECRET!)) {
    return null
  }

  const payload = jwt.decode(token) as JWTPayload

  payload.expiresDate = new Date(payload.expires)

  if (payload && payload.expires > Date.now()) {
    payload.active = true
    payload.shouldRefresh = payload.expires < Date.now() + 15 * 60 * 1000 // 15 min until expiry? then refresh.
    payload.shouldRefresh = payload.expires < Date.now() + 15 * 60 * 1000 // 15 min until expiry? then refresh.
  } else {
    payload.active = false
  }

  return payload
}

export function renewJWT(userId: number, res: express.Response) {
  // 1 month expiry if remember me, otherwise default.
  const token = createJWT(userId)
  const payload = decodeJWT(token)
  res.cookie('authorization', token, {
    httpOnly: true,
    expires: payload?.expiresDate,
  })
  return token
}

export function clearJWT(res: express.Response) {
  res.clearCookie('authorization')
}

export async function sleep(ms: number) {
  return new Promise((res, rej) => {
    setTimeout(res, ms)
  })
}

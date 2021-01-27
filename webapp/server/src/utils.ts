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
  email: string
  expires: number
  expiresDate: Date
  valid: boolean
  shouldRefresh: boolean
}

// 24 hour expiry default.
export function createJWT(
  email: string,
  expiresIn: number = 24 * 60 * 60 * 1000,
) {
  return jwt.sign(
    { email, expires: Date.now() + expiresIn },
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
    payload.valid = true
    payload.shouldRefresh = payload.expires < Date.now() + 1 * 60 * 60 * 1000 // 12 hour until expiry = refresh.
  } else {
    payload.valid = false
  }

  return payload
}

export function renewJWT(
  email: string,
  res: express.Response,
  rememberMe?: boolean,
) {
  // 1 month expiry if remember me, otherwise default.
  const token = createJWT(
    email,
    rememberMe ? 31 * 24 * 60 * 60 * 1000 : undefined,
  )
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

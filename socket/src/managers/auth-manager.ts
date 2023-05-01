import { sign, verify } from "jsonwebtoken"
import { TOKEN_SECRET } from "../envs"
import { User } from "../models/user"

type TokenPayload = Pick<User, "id" | "name"> & {
  createdAt: Date
}

type VerifyTokenResult = Pick<User, "id" | "name"> & {
  iat: number
}

export const validateToken = (token: string): TokenPayload => {
  const { iat, ...payload } = verify(token, TOKEN_SECRET) as VerifyTokenResult

  return {
    ...payload,
    createdAt: new Date(iat),
  }
}

export const generateToken = (
  payload: Pick<TokenPayload, "id" | "name">
): string => sign(payload, TOKEN_SECRET)

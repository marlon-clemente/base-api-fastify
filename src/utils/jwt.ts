import jwt from "jsonwebtoken"

type JWTPayload = {
  userId: string
}

const secret = process.env.JWT_SECRET_KEY || "secret"

export const generateAccessToken = (user: JWTPayload, expireIn: string) => {
  const token = jwt.sign(user, secret, { expiresIn: expireIn })
  return token
}

export const verifyAccessToken = (accessToken: string): { userId: string } => {
  const decode = jwt.verify(accessToken, process.env.JWT_SECRET_KEY || "secret")
  return { userId: (decode as JWTPayload).userId }
}

import { verifyAccessToken } from "@/utils/jwt"
import { FastifyReply, FastifyRequest } from "fastify"

export const hookAuth = async (req: FastifyRequest, resp: FastifyReply) => {
  const accessToken = req.cookies.accessToken
  if (!accessToken) {
    return resp.code(401).send({ error: "Unauthorized" })
  }
  try {
    const userVerificated = verifyAccessToken(accessToken)
    req.user = {
      userId: userVerificated.userId
    }
  } catch (error) {
    return resp.code(401).send({ error: "Unauthorized!" })
  }
}

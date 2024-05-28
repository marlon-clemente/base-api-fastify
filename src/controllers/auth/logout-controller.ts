import { FastifyReply, FastifyRequest } from "fastify"

export const logoutController = async (_: FastifyRequest, resp: FastifyReply) => {
  resp.clearCookie("accessToken").status(202).send({ message: "Logout success" })
}

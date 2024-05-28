import { prisma } from "@/services/prisma"
import { FastifyReply, FastifyRequest } from "fastify"

export const deleteAvatarController = async (req: FastifyRequest, resp: FastifyReply) => {
  try {
    await prisma.user.update({
      where: {
        id: req.user.userId
      },
      data: {
        avatar: ""
      }
    })

    resp.status(200).send({ message: "avatar deleted"})
  } catch (error) {
    resp.status(500).send({ error: "Internal Server Error" })
  }
}

import { prisma } from "@/services/prisma"
import { FastifyReply, FastifyRequest } from "fastify"

export const deleteUserController = async (req: FastifyRequest, resp: FastifyReply) => {
  try {
    const id = (req.params as any).id

    if (!id) {
      resp.status(400).send({ error: "ID is required" })
    }

    await prisma.user.delete({
      where: {
        id,
      },
    })

    resp.status(200).send({ message: "Usuário removido com sucesso" })
  } catch (error) {
    resp.status(500).send({ error: "Internal Server Error" })
  }
}

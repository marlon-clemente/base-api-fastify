import { prisma } from "@/services/prisma"
import { FastifyReply, FastifyRequest } from "fastify"

export const resetPassVerifyHashController = async (req: FastifyRequest, resp: FastifyReply) => {
  const hash = (req.params as any).hash

  if (!hash) {
    return resp.status(400).send({ message: "hash is required" })
  }

  try {
    const hashExists = await prisma.authResetPassword.findUnique({
      select: {
        id: true,
        createdAt: true,
        hash: true,
      },
      where: {
        hash,
      },
    })

    if (!hashExists) {
      return resp.status(404).send({ message: "Hash não encontrado." })
    }

    if (new Date().getTime() - hashExists.createdAt.getTime() > 1000 * 60 * 60) {
      return resp.status(400).send({ message: "Hash expirado." })
    }

    resp.status(202)
  } catch (error) {
    resp.status(500).send({ message: "Internal server error" })
  }
}

import { prisma } from "@/services/prisma"
import { hashPassword } from "@/utils/passwords"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

const schemaRequest = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

export const resetPasswordSaveController = async (req: FastifyRequest, resp: FastifyReply) => {
  const hash = (req.params as any).hash
  if (!hash) {
    return resp.status(400).send({ message: "Email is required" })
  }

  const data = schemaRequest.safeParse(req.body)
  if (!data.success) {
    return resp.status(400).send({ message: "Invalid data", errors: data.error })
  }

  const userByhash = await prisma.authResetPassword.findFirst({
    select: {
      userId: true,
    },
    where: {
      hash,
    },
  })

  if (!userByhash) {
    return resp.status(400).send({ message: "Invalid hash" })
  }

  const { userId } = userByhash
  const { password } = data.data
  const newPassword = await hashPassword(password)

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: newPassword,
    },
  })

  await prisma.authResetPassword.delete({
    where: {
      hash,
    },
  })

  try {
    resp.status(200).send({ message: "Senha atualizada com sucesso." })
  } catch (error) {
    resp.status(500).send({ message: "Internal server error" })
  }
}

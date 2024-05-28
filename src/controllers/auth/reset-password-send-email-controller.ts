import { prisma } from "@/services/prisma"
import { sendEmail } from "@/services/resend"
import { FastifyReply, FastifyRequest } from "fastify"

export const resetPasswordSendEmailController = async (req: FastifyRequest, resp: FastifyReply) => {
  const email = (req.params as any).email
  const origin = req.hostname

  if (!email) {
    return resp.status(400).send({ message: "Email is required" })
  }

  try {
    const userByEmail = await prisma.user.findUnique({
      select: {
        id: true,
      },
      where: {
        email,
      },
    })

    if (!userByEmail) {
      return resp.status(404).send({ message: "Usuário não encontrado." })
    }

    const { hash } = await prisma.authResetPassword.create({
      data: {
        userId: userByEmail.id,
        createdAt: new Date(),
      },
    })

    const url = `${origin}/auth/new-password/${hash}`
    await sendEmail(email, "Recuperação de senha", `Clique no link para criar uma nova senha: ${url}`)

    resp.status(200).send({ message: "E-mail enviado com sucesso.", email })
  } catch (error) {
    resp.status(500).send({ message: "Internal server error" })
  }
}

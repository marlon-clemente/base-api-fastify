import { prisma } from "@/services/prisma"
import { sendEmail } from "@/services/resend"
import { generateRandomChar, hashPassword } from "@/utils"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

const schemaNewUser = z.object({
  name: z.string({ required_error: "Nome é obrigatório" }),
  surname: z.string().optional(),
  email: z.string({ required_error: "E-mail obrigatório" }).email({ message: "E-mail inválido" }),
  sendEmailConfirmation: z.boolean().optional(),
})

export const newUserController = async (req: FastifyRequest, resp: FastifyReply) => {
  try {
    const bodyValidate = schemaNewUser.safeParse(req.body)
    if (!bodyValidate.success) {
      return resp.status(400).send({ error: bodyValidate.error })
    }

    const { name, surname, email, sendEmailConfirmation } = bodyValidate.data

    const userExists = await prisma.user.findUnique({ where: { email } })

    if (userExists) {
      return resp.status(400).send({ message: "Esse e-mail já esta send usado por outro usuário" })
    }

    const tempPessword = generateRandomChar(8)
    const password = await hashPassword(tempPessword)

    await prisma.user.create({
      data: {
        name,
        surname: surname || "",
        email,
        password,
      },
    })

    if (sendEmailConfirmation) {
      sendEmail([email], "Confirmação de Cadastro", `Sua senha temporária é ${tempPessword}`)
    }

    if (process.env.NODE_ENV !== "production") {
      console.log(`Senha temporária para ${email}: ${tempPessword}`)
    }

    resp.status(200).send({ message: "Usuário cadastrado com sucesso" })
  } catch (error) {
    resp.status(500).send({ error: "Internal Server Error" })
  }
}

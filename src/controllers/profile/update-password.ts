import { prisma } from "@/services/prisma"
import { hasValidatePassword, hashPassword } from "@/utils/passwords";
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod";

const schemaRequest = z.object({
    password: z.string({required_error: "Password is required"}),
    newPassword: z.string({required_error: "New password is required"}).min(8, {message: "New password must be at least 8 characters"}),
    confirmNewPassword: z.string({required_error: "Confirm new password is required"}).min(8, {message: "Confirm new password must be at least 8 characters"})
})

export const updatePasswordController = async (req: FastifyRequest, resp: FastifyReply) => {
  try {

    const data = schemaRequest.safeParse(req.body)
    
    if (!data.success) {
      return resp.status(400).send({ message: "Invalid request body", errors: data.error})
    }
    
    const { password, newPassword, confirmNewPassword } = data.data
    
    const currentPassword = await prisma.user.findUnique({
        where: {
            id: req.user.userId
        },
        select: {
            password: true
        }
    })


    const passwordMatch = await hasValidatePassword(password, currentPassword?.password || "")

    if (!passwordMatch) {
        return resp.status(400).send({ code: "PASSWORD_INCORRECT" })
    }

    if (newPassword !== confirmNewPassword) {
        return resp.status(400).send({ code: "PASSWORDS_DIFERENT" })
    }

    const hashedPassword = await hashPassword(newPassword)

    await prisma.user.update({
        where: {
            id: req.user.userId
        },
        data: {
            password: hashedPassword
        }
    })

    resp.status(200).send({ message: "Senha atualizada com sucesso"})
  } catch (error) {
    resp.status(500).send({ error: "Internal Server Error" })
  }
}

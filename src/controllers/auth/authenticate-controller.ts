import { prisma } from "@/services/prisma"
import { sendEmail } from "@/services/resend"
import { HandleError } from "@/utils/handle-error"
import { generateAccessToken } from "@/utils/jwt"
import { hasValidatePassword } from "@/utils/passwords"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

const requestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  rememberMe: z.boolean().optional(),
})

export const authenticateController = async (req: FastifyRequest, resp: FastifyReply) => {
  const data = requestSchema.safeParse(req.body)

  if (!data.success) {
    throw new HandleError("Invalid data", 400, data.error)
  }

  const reqUser = data.data

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: reqUser.email,
      },
    })

    if (!user) {
      throw new HandleError("User not found", 404)
    }

    const passwordMatch = await hasValidatePassword(reqUser.password, user.password)

    if (!passwordMatch) {
      throw new HandleError("Invalid user", 400)
    }

    const accessToken = generateAccessToken({ userId: user.id }, reqUser.rememberMe ? "7d" : "1d")

    sendEmail(
      [user.email],
      "Login",
      "Você acabou de autenticar-se."
    )

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastAccess: new Date(),
      },
    })
    
    resp
      .setCookie("accessToken", accessToken, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: reqUser.rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24, // 7 days or 1 day in seconds
      })
      .status(200)
  } catch (error) {
    console.log(error)
    if (error instanceof HandleError) {
      return resp.code(error.statusCode).send({ error })
    }
    return resp.code(400).send({ error })
  }
}

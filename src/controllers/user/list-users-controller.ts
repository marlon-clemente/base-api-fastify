import { prisma } from "@/services/prisma"
import { getAvatarURL } from "@/services/supabase"
import { FastifyReply, FastifyRequest } from "fastify"

export const listUsersController = async (_: FastifyRequest, resp: FastifyReply) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        avatar: true,
        rules: true,
        lastAccess: true,
      },
    })

    const dataUser = await Promise.all(
      users.map(async (user) => {
        let avatar = ""

        if (user.avatar !== "") {
          avatar = (await getAvatarURL(user.avatar)) || ""
        }

        return {
          id: user.id,
          name: user.name,
          surname: user.surname,
          email: user.email,
          avatar: avatar,
          rules: user.rules,
          lastAccess: user.lastAccess,
        }
      })
    )

    resp.status(200).send(dataUser)
  } catch (error) {
    resp.status(500).send({ error: "Internal Server Error" })
  }
}

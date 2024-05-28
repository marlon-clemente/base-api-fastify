import { prisma } from "@/services/prisma"
import { getAvatarURL } from "@/services/supabase"
import { FastifyReply, FastifyRequest } from "fastify"

export const meController = async (req: FastifyRequest, resp: FastifyReply) => {
  try {
    let avatar = ""
    const dataUser = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
    })

    if (!dataUser) {
      return resp.status(404).send({ error: "User Not Found" })
    }
    
    if (dataUser.avatar !== "") {
      avatar = await getAvatarURL(dataUser.avatar) || ""
    }

    resp.status(200).send({
      id: dataUser.id,
      name: dataUser.name,
      surname: dataUser.surname,
      email: dataUser.email,
      avatar: avatar,
      rules: dataUser.rules,
      lastAccess: dataUser.lastAccess,
    })
  } catch (error) {
    resp.status(500).send({ error: "Internal Server Error" })
  }
}

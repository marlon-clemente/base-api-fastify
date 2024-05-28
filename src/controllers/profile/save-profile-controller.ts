import { prisma } from "@/services/prisma"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

const schemaSaveProfile = z.object({
    name: z.string({required_error: "Name is required"}).trim(),
    surname: z.string({required_error: "Surname is required"}).trim(),
})

 

export const saveProfileController = async (req: FastifyRequest, resp: FastifyReply) => {
  try {    
    const data = schemaSaveProfile.safeParse(req.body)
    if (!data.success) {
      return resp.status(400).send({ error: data.error })
    }

    const {name, surname} = data.data

    await prisma.user.update({
        where: {
            id: req.user.userId
        },
        data: {
            name,
            surname
        }
    })

    resp.status(200).send({ message: "Profile saved"})
  } catch (error) {
    resp.status(500).send({ error: "Internal Server Error" })
  }
}

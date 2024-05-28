import { prisma } from "@/services/prisma"
import { uploadAvatarFile } from "@/services/supabase"
import { FastifyReply, FastifyRequest } from "fastify"
import { v4 as uuidv4 } from "uuid";

export const saveAvatarController = async (req: FastifyRequest, resp: FastifyReply) => {
  
  

  try {
    // @ts-ignore
    const files = req.raw.files

    
    if (!files){
      return resp.status(400).send({ error: "No file uploaded" })
    }
    
    const avatarFile =  files['avatar']
    if (!files){
      return resp.status(400).send({ error: "No avatarFile uploaded" })
    }
    
    const fileName = uuidv4() + "." + avatarFile.name.split('.').pop()

    await prisma.user.update({
      where: {
        id: req.user.userId
      },
      data: {
        avatar: fileName
      }
    })

    await uploadAvatarFile(avatarFile, fileName)
    resp.status(200).send({ message: "Profile saved"})
  } catch (error) {
    resp.status(500).send({ error: "Internal Server Error" })
  }
}

import { prisma } from "@/services/prisma"
import { FastifyInstance } from "fastify"

export async function statusRoutes(server: FastifyInstance) {
  server.get("/ping", async (_, resp) => {
    resp.code(200).send({ message: "pong", version: "ALPHA 0.0.1" })
  })
  server.get("/ping/db", async (_, resp) => {
    try {
      const data = await prisma.user.count()
      resp.code(200).send({ message: "conected", data })
    } catch (error) {
      resp.code(200).send({ message: "fail conection", error })
    }
  })
}

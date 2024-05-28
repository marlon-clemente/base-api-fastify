import { meController } from "@/controllers/me/me-controller"
import { FastifyInstance } from "fastify"

export async function meRoutes(server: FastifyInstance) {
  server.get("/me", async (req, resp) => await meController(req, resp))
}

import { deleteUserController } from "@/controllers/user/delete-user-controller"
import { listUsersController } from "@/controllers/user/list-users-controller"
import { newUserController } from "@/controllers/user/new-user-controller"
import { FastifyInstance } from "fastify"

export async function userRoutes(server: FastifyInstance) {
  server.get("/users", async (req, resp) => await listUsersController(req, resp))
  server.post("/users", async (req, resp) => await newUserController(req, resp))
  server.delete("/users/:id", async (req, resp) => await deleteUserController(req, resp))
}

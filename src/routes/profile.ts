import { deleteAvatarController } from "@/controllers/profile/delete-avatar"
import { saveAvatarController } from "@/controllers/profile/save-avatar"
import { saveProfileController } from "@/controllers/profile/save-profile-controller"
import { updatePasswordController } from "@/controllers/profile/update-password"
import { FastifyInstance } from "fastify"

export async function profileRoutes(server: FastifyInstance) {
  server.post("/profile", async (req, resp) => await saveProfileController(req, resp))
  server.post("/profile/avatar", async (req, resp) => await saveAvatarController(req, resp))
  server.delete("/profile/avatar", async (req, resp) => await deleteAvatarController(req, resp))
  server.put("/profile/password", async (req, resp) => await updatePasswordController(req, resp))
}

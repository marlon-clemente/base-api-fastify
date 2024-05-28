import { authenticateController } from "@/controllers/auth/authenticate-controller"
import { logoutController } from "@/controllers/auth/logout-controller"
import { resetPasswordSaveController } from "@/controllers/auth/reset-password-save-controller"
import { resetPasswordSendEmailController } from "@/controllers/auth/reset-password-send-email-controller"
import { resetPassVerifyHashController } from "@/controllers/auth/reset-password-verify-hash-controller"
import { FastifyInstance } from "fastify"

export async function authRoutes(server: FastifyInstance) {
  server.post("/auth/authenticate", async (req, resp) => await authenticateController(req, resp))
  server.post("/auth/logout", async (req, resp) => await logoutController(req, resp))
  server.post("/auth/password/reset/:email", async (req, resp) => await resetPasswordSendEmailController(req, resp))
  server.get("/auth/password/reset/verify/:hash", async (req, resp) => await resetPassVerifyHashController(req, resp))
  server.post("/auth/password/save/:hash", async (req, resp) => await resetPasswordSaveController(req, resp))
}

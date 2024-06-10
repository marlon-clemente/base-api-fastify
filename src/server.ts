import cookie from "@fastify/cookie"
import cors from "@fastify/cors"
import fileUpload from "fastify-file-upload"

import { configDotenv } from "dotenv"
import fastify from "fastify"
import path from "path"
import { authRoutes } from "./routes/auth-routes"
import { statusRoutes } from "./routes/statusRoutes"

import { hookAuth } from "./hooks/hook-auth"
import { meRoutes } from "./routes/me"
import { profileRoutes } from "./routes/profile"
import { userRoutes } from "./routes/user-route"

// instrument({ aspectoAuth: "791075d4-42b1-49a1-9f4c-99fad96270e2" })

export const init = () => {
  const app = fastify()
  const envFilePath = process.env.NODE_ENV === "production" ? ".env.prod" : ".env"

  configDotenv({
    path: path.resolve(__dirname, envFilePath),
  })
  app.register(cors, {
    // origin: ['http://localhost:3333'],
    origin: true,
    credentials: true,
  })
  app.register(cookie)
  app.register(fileUpload)

  // rotas
  app.register(authRoutes)
  app.register(statusRoutes)

  // rotas privadas
  app.register(async (server) => {
    server.addHook("preValidation", async (req, resp) => hookAuth(req, resp))

    server.register(meRoutes)
    server.register(profileRoutes)
    server.register(userRoutes)
  })
  return app
}

const port = Number(process.env.PORT) || 3333

if (require.main === module) {
  init()
    .listen({
      port,
      host: "0.0.0.0",
    })
    .then(() => {
      console.log("running...")
    })
}

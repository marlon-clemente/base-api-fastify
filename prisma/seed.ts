import { prisma } from "@/services/prisma"
import bcrypt from "bcryptjs"

// npx prisma db seed

async function main() {
  const password = await bcrypt.hash("admin", 10)

  const newUser = await prisma.user.create({
    data: {
      email: "admin@email.com",
      name: "admin",
      surname: "admin",
      password: password,
      createdAt: new Date(),
      lastAccess: new Date(),
      rules: ["ADMIN"],
    },
  })
  console.log(`Created user: ${newUser.name} (ID: ${newUser.id})`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

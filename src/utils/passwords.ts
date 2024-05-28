import bcrypt from "bcryptjs"

export const hasValidatePassword = async (userPassword: string, hashedPassword: string): Promise<boolean> => {
  const match = await bcrypt.compare(userPassword, hashedPassword)
  if (!match) {
    return false
  }
  return true
}

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}

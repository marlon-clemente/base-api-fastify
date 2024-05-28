import { Resend } from "resend"

const resendService = new Resend(process.env.RESEND_API_KEY)

/**
 * @description Send an email using Resend
 * @param to array destination email addresses
 * @param subject assunto do email
 * @param content conteudo do email
 */

export const sendEmail = async (to: string[], subject: string, content: string) => {
  const { data, error } = await resendService.emails.send({
    from: "MCS.IO <onboarding@resend.dev>",
    to,
    subject,
    html: content,
  })
  if (error) {
    console.error(error)
  }
  console.log(data)
}

import { createTransport } from 'nodemailer'
import { Options } from 'nodemailer/lib/mailer'

interface MessageOptions {
    email: string
    subject: string
    message: string
    html?: string
}

const sendEmail = async (options: MessageOptions): Promise<void> => {
    const transport = createTransport({
        host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
        port: +process.env.SMTP_PORT || 2525,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    })

    const message: Options = {
        from: `DUNGEON_MASTER: <negativ12@gmail.com>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    }

    const info = await transport.sendMail(message)
    console.log(`Message sent: ${info.message}`)
}

export default sendEmail

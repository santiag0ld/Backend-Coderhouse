import { createTransport } from 'nodemailer'
import { configObject } from '../config/config.js'

const transport = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: configObject.gmail_user_app,
        pass: configObject.gmail_pass_app
    }
})

async function sendEmail(to, subject, html) {
    try {
        await transport.sendMail({
            from: 'VidaVerde <sant.feas@gmail.com>',
            to,
            subject,
            html
        })
        console.log(`Email sent to ${to}`)
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error)
    }
}

export default sendEmail

import nodemailer from 'nodemailer'
import mailgun from 'nodemailer-mailgun-transport'
import logger from '../utils/logger'
import { getEnv } from '../utils/utils'

const api_key = getEnv('MAILGUN_API_KEY')
const domain = getEnv('MAILGUN_DOMAIN')
const appname = getEnv('APP_NAME')

const auth = {
    auth:{
        api_key,
        domain
    }
}

const transporter = nodemailer.createTransport(mailgun(auth))

export const mail = async (to: string, subject: string, text: string) => {
    try{
        await transporter.sendMail({
            from: `"${appname}" <nao-responda@${appname}.com>`, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html: text, // html body
        });
    }
    catch (error){
        logger.error('Erro ao enviar email.', error)
    }
}

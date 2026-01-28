import nodemailer from 'nodemailer'
import mailgun from 'nodemailer-mailgun-transport'
import logger from '../utils/logger'
import { getEnv } from '../utils/utils'

const appname = getEnv('APP_NAME')
const NODEMAILER_HOST = getEnv('NODEMAILER_HOST')
const NODEMAILER_PASS = getEnv('NODEMAILER_PASS')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: NODEMAILER_HOST,
        pass: NODEMAILER_PASS
    }
})

export const mail = async (to: string, subject: string, text: string) => {
    try{
        await transporter.sendMail({
            from: `"${appname}" <nao-responda@${appname}.com>`, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html: text, // html body
        });
        console.log('Email enviado com sucesso para ' + to);
    }
    catch (error){
        logger.error('Erro ao enviar email.', error)
    }
}

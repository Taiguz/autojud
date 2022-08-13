import { differenceInCalendarDays, format , parseISO } from "date-fns";
import { Andamento, Processo, Tarefa, Usuario } from "../controlers/types";
import { mail } from "../mail";
import logger from "../utils/logger";
import { getEnv } from "../utils/utils";

const appName = getEnv('APP_NAME')

// TODO: Refatorar isso aqui, ficou ruim. Seria legal ter um template pronto de email que só recebesse os valores.
export const notificarAndamentosResponsaveis = async (processo: Processo, andamentos: Andamento[], usuarios: Usuario[]) => {
    console.log('notificando responsáveis...')
    console.log(`${usuarios.length} responsaveis e ${andamentos.length} andamentos`)
    if(andamentos.length > 20){
        // TODO: o que fazer nesses casos?
        logger.error('Numero de andamentos muito alto!')
        return
    }
    usuarios.forEach(({ usu_tag, usu_email }) => {
        console.log(`Enviando andamentos para ${usu_email}`)

        let text = `<h1>Olá ${usu_tag}, você tem novos andamentos para o processo ${processo.pro_titulo}.</h1>`
        text += '<hr>'
        andamentos
            .forEach(({ and_data, and_descricao}) => text += `<p style="margin-bottom: 5px;">${format(parseISO(and_data), 'dd/MM/yyyy')} ${and_descricao}<p>`)
        text += '<hr>'
        text += '<p>Bom trabalho!</p>'
        text += `<p>Equipe ${appName}.</p>`
        mail(usu_email, 'Novos andamentos chegaram!', text)
    })
}

// TODO: Refatorar isso aqui
export const notificarTarefasResponsaveis = async (responsavel: Usuario, tarefas: Tarefa[]) => {
    const { usu_tag, usu_email } = responsavel
    console.log('notificando responsáveis para tarefas em vencimento...')
    console.log(`Enviando notificacao para ${usu_email}...`)
    console.log(`notificando ${tarefas.length} tarefas...`)

    let text = `<h1>Olá ${usu_tag}, você tem tarefas próximas do vencimento.</h1>`
    text += '<hr>'
    tarefas.forEach(({ processo, tar_data_termino, tar_objetivo }) => {
        if(processo === undefined){ // Não é pra acontecer. Mas o type é chato.
            logger.error('Tarefa sem um processo setado.')
            return
        } 
        const hoje = new Date()
        const tarefaTermino = parseISO(tar_data_termino)
        let diferencaDias: string | number = differenceInCalendarDays(tarefaTermino, hoje) 
        diferencaDias = diferencaDias === 0 ? 'hoje!' : `em ${diferencaDias} ${diferencaDias === 1 ? 'dia' : 'dias'}!`
        text += `<p style="margin-bottom: 5px;">Processo: ${processo.pro_titulo} Tarefa: ${tar_objetivo} <span style="font-weight: bold;">Vence ${diferencaDias} ${format(tarefaTermino, 'dd/MM/yyyy')}</span> <p>`
    })
    text += '<hr>'
    text += '<p>Bom trabalho!</p>'
    text += `<p>Equipe ${appName}.</p>`
    mail(usu_email, 'Você tem tarefas em vencimento!', text)
    console.log('Ok. Notificado.')
}
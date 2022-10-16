import { differenceInCalendarDays, format , parseISO } from "date-fns";
import { NotificacaoController } from "../controlers";
import { Andamento, CreateNotificacao, Notificacao, Processo, Tarefa, Usuario } from "../controlers/types";
import { mail } from "../mail";
import { dateToISOSTring, getHojeDate } from "../utils/dataUtils";
import logger from "../utils/logger";
import { getEnv } from "../utils/utils";

const appName = getEnv('APP_NAME')
const appHostName = getEnv('APP_HOSTNAME')

// TODO: Refatorar isso aqui, ficou ruim. Seria legal ter um template pronto de email que só recebesse os valores.
export const notificarAndamentosResponsaveis = async (processo: Processo, andamentos: Andamento[], usuarios: Usuario[]) => {
    console.log('notificando responsáveis...')
    console.log(`${usuarios.length} responsaveis e ${andamentos.length} andamentos`)
    const notificacoes: CreateNotificacao[] = []
    const hoje = getHojeDate()
    if(andamentos.length > 20){
        // TODO: o que fazer nesses casos?
        logger.error('Numero de andamentos muito alto!')
        return
    }
    usuarios.forEach(({ usu_tag, usu_email, usu_id }) => {
        console.log(`Enviando andamentos para ${usu_email}`)

        let text = `<h1>Olá ${usu_tag}, você tem novos andamentos para o processo <a href="${appHostName}/processos/${processo.pro_cnj}" target="_blank">${processo.pro_titulo}</a>.</h1>`
        text += '<hr>'
        andamentos.forEach(({ and_data, and_descricao, and_id }) => {
            text += `
                <a href="${appHostName}/processos/${processo.pro_cnj}/andamentos/${and_id}" target="_blank">
                <p style="margin-bottom: 5px;">
                    ${format(parseISO(and_data), 'dd/MM/yyyy')} ${and_descricao}
                <p>
                </a>`

            notificacoes.push({ 
                not_data_envio: dateToISOSTring(hoje),
                not_aviso: '{novo_andamento}',
                not_visto: false,
                not_importancia: 3,
                pro_id: processo.pro_id,
                and_id,
                usu_id 
            })
        })
        text += '<hr>'
        text += '<p>Bom trabalho!</p>'
        text += `<p>Equipe ${appName}.</p>`
        mail(usu_email, 'Novos andamentos chegaram!', text)
    })
    NotificacaoController.createBulk(notificacoes)
}


// TODO: Refatorar isso aqui
export const notificarTarefasResponsaveis = async (responsavel: Usuario, tarefas: Tarefa[]) => {
    const { usu_tag, usu_email, usu_id } = responsavel
    console.log('notificando responsáveis para tarefas em vencimento...')
    console.log(`Enviando notificacao para ${usu_email}...`)
    console.log(`notificando ${tarefas.length} tarefas...`)

    let text = `<h1>Olá ${usu_tag}, você tem tarefas próximas do vencimento.</h1>`
    text += '<hr>'
    const notificacoes: CreateNotificacao[] = []
    tarefas.forEach(({ processo, tar_data_termino, tar_objetivo, tar_id }) => {
        if(processo === undefined){ // Não é pra acontecer. Mas o type é chato.
            logger.error('Tarefa sem um processo setado.')
            return
        } 
        const hoje = getHojeDate()
        const tarefaTermino = parseISO(tar_data_termino)
        let diferencaDias: string | number = differenceInCalendarDays(tarefaTermino, hoje) 
        diferencaDias = diferencaDias === 0 ? 'hoje!' : `em ${diferencaDias} ${diferencaDias === 1 ? 'dia' : 'dias'}!`

        notificacoes.push({ 
            not_data_envio: dateToISOSTring(hoje),
            not_aviso: '{vencimento_tarefa}',
            not_visto: false,
            not_importancia: 3,
            pro_id: processo.pro_id,
            tar_id,
            usu_id 
        })

        text += `<p style="margin-bottom: 5px;">
            Processo: <a href="${appHostName}/processos/${processo.pro_cnj}" target="_blank">${processo.pro_titulo}</a> 
            Tarefa: <a href="${appHostName}/processos/${processo.pro_cnj}/tarefas/${tar_id}" target="_blank">${tar_objetivo}</a> 
            <span style="font-weight: bold;">
                Vence ${diferencaDias} ${format(tarefaTermino, 'dd/MM/yyyy')}
            </span>
            <p>`
    })
    text += '<hr>'
    text += '<p>Bom trabalho!</p>'
    text += `<p>Equipe ${appName}.</p>`
    NotificacaoController.createBulk(notificacoes)
    mail(usu_email, 'Você tem tarefas em vencimento!', text)
    console.log('Ok. Notificado.')
}
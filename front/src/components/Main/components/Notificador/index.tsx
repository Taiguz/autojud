import { parseISO, formatDistance, differenceInCalendarDays } from 'date-fns';
import brLocale from 'date-fns/locale/pt-BR'
import React, { useContext, useEffect, useState } from 'react'
import { Toast, ToastContainer }  from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { MainContext, useError } from '../..';
import api from '../../../../api';
import { AppName, getNotificacoesIntervalMs, notificacoesDelay } from '../../../../constants';
import { getHojeDate } from '../../../../utils';
import { ImportanciaNotificacao, NotificacoesSistema, TipoAviso } from './types';

// TODO: Fazer notificao para os processos
// FIX: Notificao não sai ao trocar de pagina
const Notificador: React.FC = () => {

  const { notificacoes, setNotificacoes, logado } = useContext(MainContext)
  const [notificacoesSistema, setNotificacoesSistema] = useState<NotificacoesSistema[]>([])
  const showError = useError()


  useEffect(() => {
    const fetchNotificacoes = async () => {
      if(!logado) return
      // TODO: melhorar o endpoint, trazer só as notificacoes apos determinada data
      try{
        const { data } = await api.get<NotificacoesSistema[]>('usuario/notificacoes')
        const getTime = (not_data_envio: string): number => {
          return parseISO(not_data_envio).getTime()
        }
        
        setNotificacoesSistema(notificacoes => {
          const filtrado = data.filter(({ not_id }) => notificacoes.find(({ not_id: id}) => id === not_id) === undefined)
          const novasNotificacoes = notificacoes.concat(filtrado)
          novasNotificacoes.sort((a,b) => getTime(a.not_data_envio) - getTime(b.not_data_envio))

          //console.log(novasNotificacoes)
          return novasNotificacoes
        })
      }
      catch(erro){
        showError('Erro ao buscar as notificaçoes.')
      }

    }
    const interval = setInterval(fetchNotificacoes, getNotificacoesIntervalMs)
    return () => clearInterval(interval);
  }, [logado, showError]);

  const marcarVista = async (not_id: number) => {
    try{
      const not = notificacoesSistema.findIndex(({ not_id: id }) => id === not_id)
      if(not === -1) return
      await api.put(`notificacao/${not_id}`)

      notificacoesSistema.splice(not,1)
      setNotificacoesSistema([...notificacoesSistema])
      //console.log('vista', not)
      //console.log('nots', notificacoesSistema)

    }
    catch(error){
      showError('Erro ao marcar a notificação como lida.')
    }
  }

  const getVariant = (not_importancia: number) => {
    switch(not_importancia){
      case ImportanciaNotificacao.NORMAL:
        return 'primary'
      case ImportanciaNotificacao.AVISO:
        return 'warning'
      case ImportanciaNotificacao.PERIGO:
        return 'danger'
    }
  }

  const removeNotification = (targetUuid: string) => {
    const not = notificacoes.findIndex(({ uuid }) => uuid === targetUuid)
    if(not === -1) return
    notificacoes.splice(not,1)
    setNotificacoes([...notificacoes])
  }

  const montarAviso = ({ not_aviso, processo, andamento, tarefa }: NotificacoesSistema)=> {
    if(not_aviso === TipoAviso.NOVO_ANDAMENTO && processo && andamento){
      const { and_id } = andamento
      const { pro_titulo, pro_id } = processo
      return (
        <>Você tem um novo <Link to={`/processos/${pro_id}/andamentos/${and_id}`}>andamento</Link> para o processo <Link to={`/processos/${pro_id}`}>{pro_titulo}</Link>!</>
      )
    }
    else if(not_aviso === TipoAviso.VENCIMENTO_TAREFA && processo && tarefa){
      const { tar_id, tar_data_termino, tar_objetivo } = tarefa
      const { pro_id } = processo
      const hoje = getHojeDate()
      const tarefaTermino = parseISO(tar_data_termino)
      let diferencaDias: string | number = differenceInCalendarDays(tarefaTermino, hoje) 
      diferencaDias = diferencaDias === 0 ? 'hoje!' : `em ${diferencaDias} ${diferencaDias === 1 ? 'dia' : 'dias'}!`
      return (
        <>Sua tarefa <Link to={`/processos/${pro_id}/tarefas/${tar_id}`}>{tar_objetivo}</Link> vence {diferencaDias}!</>
      )
    }
    
    return <>{not_aviso}</>
  }

  return (
    <>
      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: '1000'}}>
        {notificacoesSistema.map(({ not_id, not_aviso, not_data_envio, not_importancia }, index) => (
            <Toast key={not_id} bg={getVariant(not_importancia)} onClose={() => marcarVista(not_id)}>
              <Toast.Header>
                <strong className="me-auto">{AppName}</strong>
                <small>{formatDistance(parseISO(not_data_envio), getHojeDate(), { locale: brLocale })}</small>
              </Toast.Header>
              <Toast.Body>{montarAviso(notificacoesSistema[index])}</Toast.Body>
            </Toast>
        ))}
      </ToastContainer>
      <ToastContainer position="bottom-center" className="p-3" style={{ zIndex: '1000'}}>
        {notificacoes.map(({ uuid, message, type }) => (
          <Toast key={uuid} autohide bg={type} delay={notificacoesDelay} onClose={() => removeNotification(uuid)} onClick={() => removeNotification(uuid)}>
            <Toast.Body className={type === "dark" ? "text-white" : ""}>{message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </>
  )
}

export default Notificador
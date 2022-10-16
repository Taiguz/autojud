import { format, parseISO } from 'date-fns'
import React from 'react'
import { ITarefa } from '../../../Tarefas/types'
import { BsFillCheckCircleFill } from "react-icons/bs";
import { TbArrowForward } from "react-icons/tb";
import { LiTarefa } from './style';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

interface Props {
    tarefa: ITarefa
    processoId: string
}

const Tarefa: React.FC<Props> = ({ tarefa: { tar_objetivo, tar_data_termino, tar_situacao, tar_id }, processoId }) => {


    return (
        <LiTarefa as={Link} style={{ backgroundColor: tar_situacao ? 'lightgreen' : 'white'}} situacao={tar_situacao} to={`/processos/${processoId}/tarefas/${tar_id}`}>
            { tar_situacao ? <BsFillCheckCircleFill width={40}/> : <span style={{ width: '40px'}}></span> }
            <span>{tar_objetivo}</span>
            <span>{format(parseISO(tar_data_termino), 'dd/MM/yyyy')}</span>
            <TbArrowForward width={40}/>
        </LiTarefa>
    )

}

export default Tarefa
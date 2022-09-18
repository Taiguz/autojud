import { format, parseISO } from 'date-fns'
import React from 'react'
import { TbArrowForward } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import { limitString } from '../../../../../../../utils'
import { Li } from './style'
import { BsFillCheckCircleFill } from "react-icons/bs";
import { ITarefa } from '../../Tarefas/types'
import { Link } from 'react-router-dom'

interface Props {
    tarefa: ITarefa
    processoId: string
}
const Subtarefa: React.FC<Props> = ({ tarefa:{ tar_id, tar_objetivo, tar_data_cadastro, tar_data_termino, tar_situacao, tar_pai_id }, processoId}) => {

    return (
        <Li as={Link} to={`/processos/${processoId}/tarefas/${tar_pai_id}/subtarefa/${tar_id}`} situacao={tar_situacao}>
            <div className="margin">
                { tar_situacao ? <BsFillCheckCircleFill width={40}/> : <div style={{ width: '40px'}}> </div> }
                <span>{limitString(tar_objetivo, 120)}</span>
                <span style={{ fontWeight: 'bold'}}>Vence em: {format(parseISO(tar_data_termino), 'dd/MM/yyyy')}</span>
            </div>
            <TbArrowForward width={40}/>
        </Li>
    )
}


export default Subtarefa
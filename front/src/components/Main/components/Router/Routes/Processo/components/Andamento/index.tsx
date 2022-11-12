import { parseISO, format } from 'date-fns'
import React from 'react'
import { limitString } from '../../../../../../../../utils'
import { IAndamento } from '../../../Andamentos/types'
import { Li } from './style'
import { TbArrowForward } from "react-icons/tb";
import { Link } from 'react-router-dom'


interface Props {
    andamento: IAndamento
    processoId: string
}

const Andamento: React.FC<Props>  = ({ andamento: {and_data, and_descricao, and_id }, processoId }) => {
    return (
        <Li as={Link} to={`/processos/${processoId}/andamentos/${and_id}`}>
            <span style={{ fontWeight: 'bold', marginRight: '15px'}} >{format(parseISO(and_data), 'dd/MM/yyyy' )}</span>
            <span>{and_descricao}</span>
            <TbArrowForward width={40}/>
        </Li>
    )
}

export default Andamento
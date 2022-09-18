import { format, parseISO } from 'date-fns'
import React from 'react'
import { limitString } from '../../../../../../../utils'
import { IAndamento } from '../types'
import { Li } from './style'
import { TbArrowForward } from "react-icons/tb";
import { Link } from 'react-router-dom'

interface Props {
    andamento: IAndamento
    processoId: string
}

const Andamento: React.FC<Props> = ({ andamento: {and_data, and_descricao, and_id}, processoId }) => {


    return (
        <Li as={Link} to={`/processos/${processoId}/andamentos/${and_id}`}>
            <div>
                <span style={{ fontWeight: 'bold'}}>{format(parseISO(and_data), 'dd/MM/yyyy')}</span>
                <span>{limitString(and_descricao, 120)}</span>
            </div>
            <TbArrowForward width={40}/>
        </Li>
    )

}

export default Andamento
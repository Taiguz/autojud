import React from 'react'
import { TbArrowForward } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { IProcesso } from '../../Processo/types'
import { Li } from './style'

interface Props {
    processo: IProcesso
}
const Processo: React.FC<Props> = ({ processo:{ pro_id, pro_cnj, pro_titulo } }) => {

    const navigate = useNavigate()

    return (
        <Li as={Link} to={`/processos/${pro_id}`}>
            <div>
                <span style={{fontWeight: 'bold'}}>{pro_titulo}</span>
                <span>{pro_cnj}</span>
            </div>
            <TbArrowForward width={40}/>
        </Li>
    )
}


export default Processo
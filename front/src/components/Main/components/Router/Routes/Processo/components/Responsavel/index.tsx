import React from 'react'
import { IUsuario } from '../../../Usuario/types'
import { Li } from '../Andamento/style'
import { AiOutlineUser } from "react-icons/ai";

interface Props {
    responsavel: IUsuario
}

const Responsavel: React.FC<Props> = ({ responsavel: { usu_tag }}) => {

    return (
        <Li>
            <AiOutlineUser width={40}/>
            <span>{usu_tag}</span>
        </Li>
    )

}

export default Responsavel
import React from 'react'
import { AiOutlineUser } from "react-icons/ai";
import { IUsuario } from '../../Usuario/types';
import { Li } from './style';

interface Props {
    responsavel: IUsuario
}

const Responsavel: React.FC<Props> = ({ responsavel: { usu_tag }}) => {

    return (
        <Li>
            <AiOutlineUser width={40} style={{ marginRight: '15px'}}/>
            <span>{usu_tag}</span>
        </Li>
    )

}

export default Responsavel
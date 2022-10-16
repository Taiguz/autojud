import React from 'react'
import { AiOutlineUser } from 'react-icons/ai'
import { TbArrowForward } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { IUsuario } from '../../Usuario/types'
import { Li } from './style'

interface Props {
    usuario: IUsuario
}
const Usuario: React.FC<Props> = ({ usuario: { usu_tag } }) => {


    return (
        <Li as={Link} to={`/usuarios/${usu_tag}`}>
            <div>
                <AiOutlineUser style={{ marginRight: '10px', fontSize: '1.1rem'}}/>
                <span style={{fontWeight: 'bold'}}>{usu_tag}</span>
            </div>
            <TbArrowForward width={40}/>
        </Li>
    )
}


export default Usuario
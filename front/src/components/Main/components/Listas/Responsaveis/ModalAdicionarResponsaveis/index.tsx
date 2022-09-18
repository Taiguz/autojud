import React, { useEffect, useState } from 'react'
import { Button as BButton, Form, InputGroup, Modal } from 'react-bootstrap'
import { useError } from '../../../..'
import api from '../../../../../../api'
import Button from '../../../Button'
import Loader from '../../../Loader'
import { IProcesso } from '../../../Router/Routes/Processo/types'
import { IUsuario } from '../../../Router/Routes/Usuario/types'
import { Ul, Li }  from './style'
import { AiOutlineUser, AiOutlineDelete } from "react-icons/ai";
import ButtonIcon from '../../../ButtonIcon'
import { v4 } from 'uuid'

interface Props {
    show: boolean
    setShow: (b: boolean) => void
    adicionar: (usuarios: IUsuario[]) => Promise<void>
}

const ModalAdicionarResponsaveis: React.FC<Props> = ({ show, setShow, adicionar }) => {

    const [usuarios, setUsuarios] = useState<IUsuario[]>([])
    const [tag, setTag] = useState("")
    const [selecionados, setSelecionados] = useState<IUsuario[]>([])
    const [adicionando, setAdicionando] = useState(false)
    const [carregando, setCarregando] = useState(true)
    const showError = useError()

    const handleClose = () => {
        if(!adicionando)
            setShow(false)
    }

    useEffect(() => {
        const fetch = async () => {
            try{
                const { data } = await api.get('usuario')
                setUsuarios(data)
                setCarregando(false)
            }
            catch(erro){
                setShow(false)
                showError('Erro retornando os usuários.')
            }
        }
        fetch()
    }, [setShow, showError])

    const adicionarResponsaveis = async () => {
        setAdicionando(true)
        await adicionar(selecionados)
        setShow(false)
    }

    const selecionarUsuario = (usu_tag: string) => {
        const usuario = usuarios.find(u => u.usu_tag === usu_tag)
        if(usuario)
            setSelecionados(s => [...s, usuario])
    }

    const removerResponsavel = (usu_tag: string) => {
        const usuario = usuarios.findIndex(u => u.usu_tag === usu_tag)
        if(usuario !== -1)
            setSelecionados(s => s.splice(usuario, 1))
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
            <Modal.Title>Adicionar responsáveis</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {carregando ? <Loader/> :
                <>
                <InputGroup className="mb-3">
                    <Form.Control
                        autoFocus 
                        placeholder="@" 
                        type="input"
                        list="user-data"
                        value={tag}
                        onChange={({ target: { value }}) => setTag(value)}
                    />
                    <datalist id="user-data">
                        {usuarios.map(({ usu_tag, usu_id }) => <option key={usu_id} value={usu_tag}>{usu_tag}</option>)}
                    </datalist>
                    <BButton variant="secondary" onClick={() => selecionarUsuario(tag)}>Inserir</BButton>
                </InputGroup>
                <Ul>
                    {selecionados.map(({ usu_tag }) => 
                        <Li className="d-flex justify-content-between align-items-center" key={v4()}>
                            <div>
                                <AiOutlineUser width={40} style={{marginRight: '10px'}}/> 
                                <span>{usu_tag}</span>
                            </div>
                            <ButtonIcon title="Remover responsável da lista." onClick={() => removerResponsavel(usu_tag)}>
                                <AiOutlineDelete width={40}/>
                            </ButtonIcon>
                        </Li>)}
                </Ul>
                </>
            }
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={handleClose} disabled={adicionando || carregando}>Cancelar</Button>
            <Button onClick={adicionarResponsaveis} level="primary" disabled={adicionando || carregando}>{adicionando ? 'Adicionando...' : 'Adicionar'}</Button>
        </Modal.Footer>
        </Modal>
    )
}

export default ModalAdicionarResponsaveis
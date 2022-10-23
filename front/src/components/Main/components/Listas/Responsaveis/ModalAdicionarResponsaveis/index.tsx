import React, { FormEvent, useEffect, useState } from 'react'
import { Button as BButton, Form, InputGroup, Modal } from 'react-bootstrap'
import { useError } from '../../../..'
import api from '../../../../../../api'
import Button from '../../../Button'
import Loader from '../../../Loader'
import { IProcesso } from '../../../Router/Routes/Processo/types'
import { BasicUsuario, IUsuario } from '../../../Router/Routes/Usuario/types'
import { Ul, Li }  from './style'
import { AiOutlineUser, AiOutlineDelete } from "react-icons/ai";
import ButtonIcon from '../../../ButtonIcon'
import { v4 } from 'uuid'
import { validarProcessoResponsaveisTags } from '../../../Router/Routes/Processos/utils'

interface Props {
    show: boolean
    setShow: (b: boolean) => void
    adicionar: (usuarios: string) => Promise<void>
}

const ModalAdicionarResponsaveis: React.FC<Props> = ({ show, setShow, adicionar }) => {

    const [usuarios, setUsuarios] = useState<string[]>([])
    const [tag, setTag] = useState("")
    const [adicionando, setAdicionando] = useState(false)
    const [carregando, setCarregando] = useState(true)
    const [validar, setValidar] = useState(false)
    const showError = useError()

    const handleClose = () => {
        if(!adicionando)
            setShow(false)
    }

    useEffect(() => {
        const fetch = async () => {
            try{
                const { data } = await api.get<BasicUsuario[]>('usuario')
                setUsuarios(data.map(({ usu_tag }) => usu_tag))
                setCarregando(false)
            }
            catch(erro){
                setShow(false)
                showError('Erro retornando os usuários.')
            }
        }
        fetch()
    }, [setShow, showError])

    const adicionarResponsaveis = async (event: FormEvent) => {
        event.preventDefault()
        event.stopPropagation()
        if(!validarProcessoResponsaveisTags(tag, usuarios)){
            setValidar(true)
            return
        }
        setAdicionando(true)
        await adicionar(tag)
        setShow(false)
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
            <Modal.Title>Adicionar responsáveis</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {carregando ? <Loader/> :
                <Form onSubmit={adicionarResponsaveis} id="adicionarProcesso">
                    <Form.Group className="mb-3">
                        <Form.Label>Responsável</Form.Label>
                        <Form.Control
                            autoFocus 
                            required
                            placeholder="Responsável 1, Responsável 2..." 
                            type="input"
                            list="user-data"
                            value={tag}
                            onChange={({ target: { value }}) => setTag(value)}
                            isValid={validar && validarProcessoResponsaveisTags(tag, usuarios)}
                            isInvalid={validar && !validarProcessoResponsaveisTags(tag, usuarios)}
                        />
                        <datalist id="user-data">
                            {usuarios.map(usuario => <option key={v4()} value={usuario}>{usuario}</option>)}
                        </datalist>
                        <Form.Control.Feedback type="invalid">
                            Por favor verifique se as tags de usuário são válidas.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form>
            }
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={handleClose} disabled={adicionando || carregando}>Cancelar</Button>
            <Button type="submit" form="adicionarProcesso" level="primary" disabled={adicionando || carregando}>{adicionando ? 'Adicionando...' : 'Adicionar'}</Button>
        </Modal.Footer>
        </Modal>
    )
}

export default ModalAdicionarResponsaveis
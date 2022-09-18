import React, { FormEvent, useContext, useState } from 'react'
import { Form, Modal } from 'react-bootstrap'
import Button from '../../../../Button'
import { IUsuario } from '../types'
import { validarUsuarioTag, validarUsuarioOAB } from '../utils'

interface Props {
    show: boolean
    setShow: (b: boolean) => void
    usuarioEditar: IUsuario
    editar: (usuario: IUsuario) => Promise<void>
}

const ModalEditarUsuario: React.FC<Props> = ({ show, setShow, editar, usuarioEditar }) => {

    const [usuario, setUsuario] = useState<IUsuario>({ ...usuarioEditar})
    const [salvando, setSalvando] = useState(false)
    const [validar, setValidar] = useState(false)

    const handleClose = () => {
        if(!salvando)
            setShow(false)
    }

    const adicionarUsuario = async (event: FormEvent) => {
        event.preventDefault()
        event.stopPropagation()
        setValidar(true)
        if(validarUsuarioTag(usuario.usu_tag) &&
           validarUsuarioOAB(usuario.usu_oab)){
            setSalvando(true)
            await editar(usuario)
            setShow(false)
        }
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Form onSubmit={adicionarUsuario}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar usuário</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Tag</Form.Label>
                        <Form.Control 
                            autoFocus 
                            required
                            type="text" 
                            placeholder="Tag..." 
                            isValid={validar && validarUsuarioTag(usuario.usu_tag)}
                            isInvalid={validar && !validarUsuarioTag(usuario.usu_tag)}
                            value={usuario.usu_tag} onChange={({ target: { value } }) => setUsuario({...usuario, usu_tag: value})}
                        />
                        <Form.Control.Feedback type="invalid">Utilize apenas letras, sem espaços.</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Use de 4 a 20 caracteres.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>OAB</Form.Label>
                        <Form.Control 
                            required
                            type="text" 
                            placeholder="UF111222..." 
                            isValid={validar && validarUsuarioOAB(usuario.usu_oab)}
                            isInvalid={validar && !validarUsuarioOAB(usuario.usu_oab)}
                            value={usuario.usu_oab} onChange={({ target: { value } }) => setUsuario({...usuario, usu_oab: value})}
                        />
                        <Form.Control.Feedback type="invalid">Use um número de OAB válido.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Check type="checkbox" label="Administrador" checked={usuario.usu_administrador} onChange={({ target: { checked }}) => setUsuario({...usuario, usu_administrador: checked}) } />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose} disabled={salvando}>Cancelar</Button>
                    <Button type="submit" level="primary" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default ModalEditarUsuario
import React, { FormEvent, useContext, useState } from 'react'
import { Alert, Form, Modal } from 'react-bootstrap'
import Button from '../../../../Button'
import { IUsuario } from '../../Usuario/types'
import { validarUsuarioOAB, validarUsuarioTag, validarUsuarioEmail } from '../../Usuario/utils'
import { useError } from '../../../../..'
import { AxiosError } from 'axios'

interface Props {
    show: boolean
    setShow: (b: boolean) => void
    adicionar: (usuario: IUsuario) => Promise<void>
}

const ModalAdicionarUsuario: React.FC<Props> = ({ show, setShow, adicionar }) => {

    const [usuario, setUsuario] = useState<IUsuario>({ usu_id: 0, usu_nome: '', usu_oab: '', usu_tag: '', usu_email: '', usu_verificado: false, usu_administrador: false })
    const [adicionando, setAdicionando] = useState(false)
    const [validar, setValidar] = useState(false)
    const showError = useError()

    const handleClose = () => {
        if(!adicionando)
            setShow(false)
    }

    const adicionarUsuario = async (event: FormEvent) => {
        event.preventDefault()
        event.stopPropagation()
        setValidar(true)
        if(validarUsuarioTag(usuario.usu_tag) &&
           validarUsuarioEmail(usuario.usu_email) &&
           validarUsuarioOAB(usuario.usu_oab)){
            setAdicionando(true)
            try {
                await adicionar(usuario)
                setShow(false)
            }
            catch (erro) {
                if (erro instanceof (AxiosError) && erro.message) {
                    showError(`Houve um erro ao adicionar usuário.\n${erro.message}`, erro as Error)
                }
                showError('Houve um erro ao adicionar usuário.', erro as Error)
            }
            finally {
                setAdicionando(false)
            }
        }
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                <Modal.Title>Adicionar usuário</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={adicionarUsuario} id="adicionarUsuario">
                    <Form.Group className="mb-3">
                        <Form.Label>Tag única</Form.Label>
                        <Form.Control 
                            autoFocus 
                            required
                            type="text" 
                            placeholder="Tag do usuário..." 
                            isValid={validar && validarUsuarioTag(usuario.usu_tag)}
                            isInvalid={validar && !validarUsuarioTag(usuario.usu_tag)}
                            value={usuario.usu_tag} onChange={({ target: { value } }) => setUsuario({...usuario, usu_tag: value})}
                        />
                        <Form.Control.Feedback type="invalid">Utilize apenas letras, sem espaços.</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Use de 4 a 20 caracteres.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email corporativo</Form.Label>
                        <Form.Control 
                            autoFocus
                            required
                            type="text" 
                            placeholder="tag@empresa.com..." 
                            isValid={validar && validarUsuarioEmail(usuario.usu_email)}
                            isInvalid={validar && !validarUsuarioEmail(usuario.usu_email)}
                            value={usuario.usu_email} onChange={({ target: { value } }) => setUsuario({...usuario, usu_email: value})}
                        />
                        <Form.Control.Feedback type="invalid">Use um e-mail válido.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>OAB</Form.Label>
                        <Form.Control 
                            autoFocus
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
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose} disabled={adicionando}>Cancelar</Button>
                    <Button type="submit" form="adicionarUsuario" level="primary" disabled={adicionando}>{adicionando ? 'Adicionando...' : 'Adicionar'}</Button>
                </Modal.Footer>
        </Modal>
    )
}

export default ModalAdicionarUsuario
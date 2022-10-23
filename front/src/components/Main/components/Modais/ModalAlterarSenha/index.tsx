import React, { FormEvent, useContext, useState } from 'react'
import { Form, Modal } from 'react-bootstrap'
import { useError, useMessage } from '../../..'
import api from '../../../../../api'
import Button from '../../Button'
import { validarSenha } from '../../Router/Routes/Usuario/utils'

interface Props {
    show: boolean
    setShow: (b: boolean) => void
}

const ModalAlterarSenha: React.FC<Props> = ({ show, setShow }) => {

    const [senhaAtual, setSenhaAtual] = useState("")
    const [novaSenha, setNovaSenha] = useState("")
    const [adicionando, setAdicionando] = useState(false)
    const [validar, setValidar] = useState(false)
    const showError = useError()
    const showMessage = useMessage()

    const handleClose = () => {
        if(!adicionando)
            setShow(false)
    }

    const alterarSenha = async (event: FormEvent) => {
        event.preventDefault()
        event.stopPropagation()
        setValidar(true)
        if(validarSenha(novaSenha) && senhaAtual !== novaSenha){
            setAdicionando(true)
            try{
                await api.post(`usuario/alterar-senha`, { senha_atual: senhaAtual, nova_senha: novaSenha})
                showMessage('Senha alterada com sucesso.')
            }
            catch(error){
                setAdicionando(false)
                showError('Erro ao alterar senha.')
            }
            setShow(false)
        }
    }

    return (
        <Modal show={show} onHide={handleClose} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Alterar Senha</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={alterarSenha} id="alterarSenha">
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Senha antiga</Form.Label>
                        <Form.Control 
                            autoFocus 
                            type="password" 
                            placeholder="Senha antiga..." 
                            required
                            isValid={validar && novaSenha !== senhaAtual && senhaAtual.length > 0}
                            isInvalid={validar && novaSenha === senhaAtual && senhaAtual.length === 0}
                            value={senhaAtual} onChange={({ target: { value } }) => setSenhaAtual(value)}
                        />
                        <Form.Control.Feedback type="invalid">A nova senha deve ser diferente da senha antiga.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Nova senha</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Nova senha..."
                            required
                            isValid={validar && validarSenha(novaSenha)}
                            isInvalid={validar && !validarSenha(novaSenha)}
                            value={novaSenha} onChange={({ target: { value } }) => setNovaSenha(value)}
                        />
                        <Form.Control.Feedback type="invalid">Use de 4 a 20 caracteres.</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Sua senha deve conter ao menos um símbolo, número, um caracter em letra maiúscula e um caracter especial.</Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose} disabled={adicionando}>Cancelar</Button>
                <Button type="submit" form="alterarSenha" level="primary" disabled={adicionando}>{adicionando ? 'Salvando...' : 'Salvar'}</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalAlterarSenha
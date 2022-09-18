import React, { FormEvent, useContext, useState } from 'react'
import { Alert, Form, Modal } from 'react-bootstrap'
import Button from '../../../../Button'
import { IProcesso } from '../../Processo/types'
import validator from 'validator'
import { validarProcessoCNJ, validarProcessoTitulo } from '../utils'

interface Props {
    show: boolean
    setShow: (b: boolean) => void
    adicionar: (processo: IProcesso) => Promise<void>
}

const ModalAdicionarProcesso: React.FC<Props> = ({ show, setShow, adicionar }) => {

    const [processo, setProcesso] = useState<IProcesso>({ pro_id: 0, pro_cnj: '', pro_titulo: ''})
    const [validar, setValidar] = useState(false)
    const [adicionando, setAdicionando] = useState(false)

    const handleClose = () => {
        if(!adicionando)
            setShow(false)
    }

    const adicionarProcesso = async (event: FormEvent) => {
        event.preventDefault()
        event.stopPropagation()
        setValidar(true)
        if(validarProcessoTitulo(processo.pro_titulo) && validarProcessoCNJ(processo.pro_cnj)){
            setAdicionando(true)
            await adicionar(processo)
            setShow(false)
        }
    }


    return (
        <Modal show={show} onHide={handleClose} centered>
            <Form onSubmit={adicionarProcesso}>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar processo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Título do processo</Form.Label>
                        <Form.Control 
                            autoFocus 
                            type="text" 
                            placeholder="Título..." 
                            required
                            isValid={validar && validarProcessoTitulo(processo.pro_titulo)}
                            isInvalid={validar && !validarProcessoTitulo(processo.pro_titulo)}
                            value={processo.pro_titulo} onChange={({ target: { value } }) => setProcesso({...processo, pro_titulo: value})}
                        />
                        <Form.Control.Feedback type="invalid">Utilize apenas letras e números.</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Use de 4 a 200 caracteres.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Número CNJ</Form.Label>
                        <Form.Control 
                            autoFocus
                            required
                            type="text" 
                            placeholder="000..." 
                            isValid={validar && validarProcessoCNJ(processo.pro_cnj)}
                            isInvalid={validar && !validarProcessoCNJ(processo.pro_cnj)}
                            value={processo.pro_cnj} onChange={({ target: { value } }) => setProcesso({...processo, pro_cnj: value})}
                        />
                        <Form.Control.Feedback type="invalid">O número de CNJ deve ter um formato válido.</Form.Control.Feedback>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose} disabled={adicionando}>Cancelar</Button>
                    <Button type="submit" level="primary" disabled={adicionando}>{adicionando ? 'Adicionando...' : 'Adicionar'}</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default ModalAdicionarProcesso
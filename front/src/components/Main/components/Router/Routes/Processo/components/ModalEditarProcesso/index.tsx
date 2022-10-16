import React, { FormEvent, useContext, useState } from 'react'
import { Form, Modal } from 'react-bootstrap'
import Button from '../../../../../Button'
import { validarProcessoTitulo } from '../../../Processos/utils'
import { IProcesso } from '../../types'

interface Props {
    show: boolean
    setShow: (b: boolean) => void
    processoEditar: IProcesso
    editar: (processo: IProcesso) => Promise<void>
}

const ModalEditarProcesso: React.FC<Props> = ({ show, setShow, editar, processoEditar }) => {

    const [processo, setProcesso] = useState<IProcesso>({ ...processoEditar})
    const [salvando, setSalvando] = useState(false)
    const [validar, setValidar] = useState(false)

    const handleClose = () => {
        if(!salvando)
            setShow(false)
    }

    const adicionarProcesso = async (event: FormEvent) => {
        event.preventDefault()
        event.stopPropagation()
        setValidar(true)
        if(validarProcessoTitulo(processo.pro_titulo)){
            setSalvando(true)
            await editar(processo)
            setShow(false)
        }
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Editar processo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={adicionarProcesso} id="editarProcesso">
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
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
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose} disabled={salvando}>Cancelar</Button>
                <Button type="submit" form="editarProcesso" level="primary" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalEditarProcesso
import React, { FormEvent, useContext, useState } from 'react'
import { Alert, Form, Modal } from 'react-bootstrap'
import Button from '../../Button'
import { validarTarefaObjetivo, validarTarefaPrazoFatal } from '../../Router/Routes/Tarefa/utils'
import { ITarefa } from '../../Router/Routes/Tarefas/types'

interface Props {
    show: boolean
    setShow: (b: boolean) => void
    adicionar: (tarefa: ITarefa) => Promise<void>
}

const ModalAdicionarTarefa: React.FC<Props> = ({ show, setShow, adicionar }) => {

    const [tarefa, setTarefa] = useState<ITarefa>({ tar_id: 0, tar_objetivo: '', tar_data_cadastro: '', tar_data_termino: '', tar_situacao: false, tar_pai_id: null, pro_id: 0})
    const [adicionando, setAdicionando] = useState(false)
    const [validar, setValidar] = useState(false)

    const handleClose = () => {
        if(!adicionando)
            setShow(false)
    }

    const adicionarTarefa = async (event: FormEvent) => {
        event.preventDefault()
        event.stopPropagation()
        setValidar(true)
        if(validarTarefaObjetivo(tarefa.tar_objetivo) && validarTarefaPrazoFatal(tarefa.tar_data_termino)){
            setAdicionando(true)
            await adicionar(tarefa)
            setShow(false)
        }
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
        <Form onSubmit={adicionarTarefa}>
            <Modal.Header closeButton>
                <Modal.Title>Adicionar tarefa</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Objetivo da tarefa</Form.Label>
                    <Form.Control 
                        autoFocus 
                        type="text" 
                        placeholder="Objetivo..." 
                        required
                        isValid={validar && validarTarefaObjetivo(tarefa.tar_objetivo)}
                        isInvalid={validar && !validarTarefaObjetivo(tarefa.tar_objetivo)}
                        value={tarefa.tar_objetivo} onChange={({ target: { value } }) => setTarefa({...tarefa, tar_objetivo: value})}
                    />
                    <Form.Control.Feedback type="invalid">Utilize apenas letras e números.</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">Use de 4 a 200 caracteres.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Prazo fatal</Form.Label>
                    <Form.Control 
                        type="date" 
                        required
                        isValid={validar && validarTarefaPrazoFatal(tarefa.tar_data_termino)}
                        isInvalid={validar && !validarTarefaPrazoFatal(tarefa.tar_data_termino)}
                        value={tarefa.tar_data_termino} onChange={({ target: { value } }) => setTarefa({...tarefa, tar_data_termino: value})}
                    />
                    <Form.Control.Feedback type="invalid">Utilize apenas letras e números.</Form.Control.Feedback>
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

export default ModalAdicionarTarefa
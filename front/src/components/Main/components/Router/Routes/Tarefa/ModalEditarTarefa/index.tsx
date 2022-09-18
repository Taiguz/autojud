import React, { FormEvent, useContext, useState } from 'react'
import { Alert, Form, Modal } from 'react-bootstrap'
import Button from '../../../../Button'
import { ITarefa } from '../../Tarefas/types'
import { validarTarefaObjetivo, validarTarefaPrazoFatal } from '../utils'

interface Props {
    show: boolean
    setShow: (b: boolean) => void
    isSubtarefa: boolean
    aoConcluir: (tarefa: ITarefa) => Promise<void>
    tarefaEditar: ITarefa
}

const ModalEditarTarefa: React.FC<Props> = ({ show, setShow, isSubtarefa, tarefaEditar, aoConcluir }) => {

    const [tarefa, setTarefa] = useState<ITarefa>(tarefaEditar)
    const [concluindo, setConcluindo] = useState(false)
    const [validar, setValidar] = useState(false)

    const handleClose = () => {
        if(!concluindo)
            setShow(false)
    }

    const aoConcluirTarefa = async (event: FormEvent) => {
        event.preventDefault()
        event.stopPropagation()
        setValidar(true)
        if(validarTarefaObjetivo(tarefa.tar_objetivo) && validarTarefaPrazoFatal(tarefa.tar_data_termino) && validarTarefaPrazoFatal(tarefa.tar_data_cadastro)){
            setConcluindo(true)
            await aoConcluir(tarefa)
            setShow(false)
        }
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
        <Form onSubmit={aoConcluirTarefa}>
            <Modal.Header closeButton>
                <Modal.Title>Editar {isSubtarefa ? 'subtarefa' : 'tarefa'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3">
                    <Form.Label>{isSubtarefa ? 'Descrição da subtarefa' : 'Objetivo da tarefa'}</Form.Label>
                    <Form.Control 
                        autoFocus 
                        type="text" 
                        placeholder={`${isSubtarefa ? 'Descrição...' : 'Objetivo...'}`} 
                        isValid={validar && validarTarefaObjetivo(tarefa.tar_objetivo)}
                        isInvalid={validar && !validarTarefaObjetivo(tarefa.tar_objetivo)}
                        value={tarefa.tar_objetivo} onChange={({ target: { value } }) => setTarefa({...tarefa, tar_objetivo: value})}
                    />
                    <Form.Control.Feedback type="invalid">Utilize apenas letras e números.</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">Use de 4 a 200 caracteres.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Data de cadastro</Form.Label>
                    <Form.Control 
                        type="date" 
                        isValid={validar && validarTarefaPrazoFatal(tarefa.tar_data_cadastro)}
                        isInvalid={validar && !validarTarefaPrazoFatal(tarefa.tar_data_cadastro)}
                        value={tarefa.tar_data_cadastro} onChange={({ target: { value } }) => setTarefa({...tarefa, tar_data_cadastro: value})}
                    />
                    <Form.Control.Feedback type="invalid">Insira uma data válida.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>{isSubtarefa ? 'Data de vencimento' : 'Prazo fatal'}</Form.Label>
                    <Form.Control 
                        type="date" 
                        isValid={validar && validarTarefaPrazoFatal(tarefa.tar_data_termino)}
                        isInvalid={validar && !validarTarefaPrazoFatal(tarefa.tar_data_termino)}
                        value={tarefa.tar_data_termino} onChange={({ target: { value } }) => setTarefa({...tarefa, tar_data_termino: value})}
                    />
                    <Form.Control.Feedback type="invalid">Insira uma data válida.</Form.Control.Feedback>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose} disabled={concluindo}>Cancelar</Button>
                <Button type="submit" level="primary" disabled={concluindo}>{concluindo ? 'Salvando...' : 'Salvar'}</Button>
            </Modal.Footer>
        </Form>
        </Modal>
    )
}

export default ModalEditarTarefa
import React, { useContext, useState } from 'react'
import { Alert, Form, Modal } from 'react-bootstrap'
import Button from '../../../../Button'
import { ITarefa } from '../../Tarefas/types'

interface Props {
    show: boolean
    setShow: (b: boolean) => void
    adicionar: (tarefa: ITarefa) => Promise<void>
}

const ModalAdicionarSubtarefa: React.FC<Props> = ({ show, setShow, adicionar }) => {

    const [tarefa, setTarefa] = useState<ITarefa>({ tar_id: 0, tar_objetivo: '', tar_data_cadastro: '', tar_data_termino: '', tar_situacao: false, tar_pai_id: null, pro_id: 0})
    const [adicionando, setAdicionando] = useState(false)

    const handleClose = () => {
        if(!adicionando)
            setShow(false)
    }

    const adicionarTarefa = async () => {
        setAdicionando(true)
        await adicionar(tarefa)
        setShow(false)
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
            <Modal.Title>Adicionar subtarefa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group className="mb-3">
                <Form.Label>Descrição da subtarefa</Form.Label>
                <Form.Control 
                    autoFocus 
                    type="text" 
                    placeholder="Descrição..." 
                    value={tarefa.tar_objetivo} onChange={({ target: { value } }) => setTarefa({...tarefa, tar_objetivo: value})}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Data de finalização</Form.Label>
                <Form.Control 
                    type="date" 
                    value={tarefa.tar_data_termino} onChange={({ target: { value } }) => setTarefa({...tarefa, tar_data_termino: value})}
                />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={handleClose} disabled={adicionando}>Cancelar</Button>
            <Button onClick={adicionarTarefa} level="primary" disabled={adicionando}>{adicionando ? 'Adicionando...' : 'Adicionar'}</Button>
        </Modal.Footer>
        </Modal>
    )
}

export default ModalAdicionarSubtarefa
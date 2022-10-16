import React, { useContext } from 'react'
import { Modal } from 'react-bootstrap'
import Button from './../Button'
import { MainContext } from '../..'


const CustomMessage: React.FC = () => {
    
    const { message, setMessage } = useContext(MainContext)

    const handleClose = () => {
        setMessage({ message: '', trigger: false})
    }

    return (
        <Modal show={message.trigger} onHide={handleClose} centered>
        <Modal.Header closeButton>
            <Modal.Title>Aviso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {message.message.split('/n').map(message => <p>{message}</p>)}
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={handleClose}>Ok</Button>
        </Modal.Footer>
        </Modal>
    )
}

export default CustomMessage
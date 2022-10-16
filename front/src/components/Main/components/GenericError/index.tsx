import React, { useContext } from 'react'
import { Modal } from 'react-bootstrap'
import Button from './../Button'
import { MainContext } from '../..'
import { AxiosError } from 'axios'


const CustomError: React.FC = () => {
    
    const { error, setError } = useContext(MainContext)

    const handleClose = () => {
        setError({...error, trigger: false})
    }


    return (
        <Modal show={error.trigger} onHide={handleClose} centered>
        <Modal.Header closeButton>
            <Modal.Title>Tivemos um problema :(</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>{error.message}</p>
            {error.errorOb instanceof(AxiosError) && error.errorOb.response?.data?.message !== undefined ?
                <p>{error.errorOb.response.data.message}</p> :
                null
            }
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={handleClose}>Ok</Button>
        </Modal.Footer>
        </Modal>
    )
}

export default CustomError
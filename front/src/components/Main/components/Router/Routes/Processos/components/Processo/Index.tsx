import React from 'react'
import { Button, Card } from 'react-bootstrap'
import { IProcesso } from './Types'

interface Props {
    processo: IProcesso
}
const Processo: React.FC<Props> = ({ processo }) => {
    return (
        <Card>
            <Card.Header>Processo N: {processo.numero}</Card.Header>
            <Card.Body>
                <Card.Title>{processo.sistema} {processo.data}</Card.Title>
                <Card.Text>Instancia: {processo.instancia}</Card.Text>
                <Card.Text>Extra Instancia: {processo.extraInstancia}</Card.Text>
                <Button variant="primary">Detalhes</Button>
            </Card.Body>
        </Card>
    )

}

export default Processo
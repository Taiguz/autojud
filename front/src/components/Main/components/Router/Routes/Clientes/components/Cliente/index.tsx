import React from 'react'
import { Button, Card } from 'react-bootstrap'
import { ICliente } from '../../types'
import { CustomCard } from './styles'

interface Props {
    cliente: ICliente
}

const Cliente: React.FC<Props> = ({ cliente }) => {

    return (
        <CustomCard>
            <Card.Body>
                <Card.Title>{cliente.nome}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{cliente.principalDemanda}</Card.Subtitle>
                <Card.Text>Processos cadastrados: {cliente.processosCadastrados}</Card.Text>
                {cliente.prazosEmAberto === 0 ? 
                    <Card.Text>Sem prazos em aberto</Card.Text> :
                    <Card.Text>Prazos em aberto: {cliente.prazosEmAberto}</Card.Text>
                }
                <hr/>
                <Button variant="primary" style={{ marginBottom: '10px'}}>Acessar cliente</Button>
                <div>
                    <Card.Link href="#">Processos</Card.Link>
                    <Card.Link href="#">Documentos</Card.Link>
                </div>
            </Card.Body>
        </CustomCard>
    )

}

export default Cliente
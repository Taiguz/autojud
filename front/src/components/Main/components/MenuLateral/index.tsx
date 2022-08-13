import React, { useContext } from 'react'
import { Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'


const MenuLateral: React.FC = () => {

    return (
        <Container>
            <Row>
                <Link to="/">Home</Link>
            </Row>
            <Row>
                <Link to="clientes">Clientes</Link>
            </Row>
            <Row>
                <Link to="processos">Processos</Link>
            </Row>
        </Container>
    )

}

export default MenuLateral
import React from 'react'
import { Badge, NavDropdown } from 'react-bootstrap'
import { BsCardChecklist } from 'react-icons/bs'

const Task: React.FC = () => {

    return (
        <NavDropdown title={<><BsCardChecklist width={40}/> <Badge pill bg="primary">2</Badge></>} id="basic-nav-dropdown" align="end">
            <NavDropdown.Item disabled style={{ fontWeight: 'bold', color: 'black'}}>Minhas pendências</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.1" className="d-flex justify-content-between">
                <span>Processos</span>
                <Badge bg="dark" pill>2</Badge>
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.1" className="d-flex justify-content-between">
                <span>Tarefas</span>
                <Badge bg="dark" pill>4</Badge>
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.1" className="d-flex justify-content-between">
                <span>Subtarefas</span>
                <Badge bg="dark" pill>15</Badge>
            </NavDropdown.Item>
        </NavDropdown>
    )

}

export default Task
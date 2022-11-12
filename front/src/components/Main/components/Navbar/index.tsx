import React, { useContext, useState } from 'react'
import { AppName } from '../../../../constants'
import { Navbar as BNavbar, Nav, NavDropdown, Container, Form} from 'react-bootstrap'
import Task from './components/Task'
import { AiOutlineUser } from 'react-icons/ai'
import { useNavigate } from 'react-router'
import { MainContext } from '../..'
import { Link } from 'react-router-dom'
import ModalAlterarSenha from '../Modais/ModalAlterarSenha'

const Navbar: React.FC = () => {

    const navigate = useNavigate()
    const { setLogado, usuario } = useContext(MainContext)
    const [showModalAlterarSenha, setShowModalAlterarSenha] = useState(false)
    

    const logout = () => {
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
      setLogado(false)
    }

    return (
      <BNavbar bg="dark" expand="lg" variant="dark" style={{ width: '100%', paddingLeft: '20px', paddingRight: '20px', zIndex: '1001'}}>
        {
          showModalAlterarSenha &&
            <ModalAlterarSenha show={showModalAlterarSenha} setShow={setShowModalAlterarSenha}/>
        }
        <BNavbar.Brand>{AppName}</BNavbar.Brand>
        <BNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BNavbar.Collapse>
          <Nav className="me-auto"> 
            <Nav.Link as={Link} to="/">Início</Nav.Link>
            <Nav.Link as={Link} to="/processos">Processos</Nav.Link>
            {usuario.usu_administrador && <Nav.Link as={Link} to="/usuarios">Usuários</Nav.Link>}
            <Nav.Link as={Link} to="/agenda">Agenda</Nav.Link>
          </Nav>
        </BNavbar.Collapse>
        <BNavbar.Collapse className="justify-content-end">
          <Nav>
            {/*
            TODO: implementar
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Procurar..."
                className="me-2"
                aria-label="Search"
              />
            </Form>
            <Task/>
            */}
            <NavDropdown title={<><AiOutlineUser width={40}/> {usuario.usu_tag}</>} id="basic-nav-dropdown" align="end">
              <NavDropdown.Item
              as={Link}
              to={`usuarios/${usuario.usu_tag}`}
              >Minhas informações</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                onClick={() => setShowModalAlterarSenha(true)}
              >Alterar senha</NavDropdown.Item>
              <NavDropdown.Item onClick={logout}>Sair</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </BNavbar.Collapse>
      </BNavbar>
    )
}

export default Navbar
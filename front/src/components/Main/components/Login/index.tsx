import React, { useContext, useState } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import { AppName, mainBackgroundColor, mainBackgroundColor2 } from '../../../../constants'
import Button from '../Button'
import { CustomContainer } from './style'
import { GoLaw } from 'react-icons/go'
import api from '../../../../api'
import { MainContext, useError } from '../..'
import { useNavigate } from 'react-router'

const Login: React.FC = () => {

    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [salvarToken, setSalvarToken] = useState(false)
    const [entrando, setEntrando] = useState(false)
    const { setLogado } = useContext(MainContext)
    const showError = useError()
    const navigate = useNavigate()

    const fazerLogin = async () => {
        setEntrando(true)
        try{
            const { data: { token } } = await api.post<{ token: string }>('usuario/login', { email, password: senha})
            if(salvarToken) localStorage.setItem('token', token)
            else sessionStorage.setItem('token', token)
            Object.assign(api.defaults, {headers: {authorization: `Bearer ${token}`}});
            setLogado(true)
            navigate('/')
        }
        catch(error){
            setEntrando(false)
            showError('Erro ao fazer login.')
        }
    }

    return (
        <CustomContainer>
            <Container>
                <Row>
                    <Col className="d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: mainBackgroundColor, padding: '40px 20px', borderRadius: '8px 0px 0px 8px'}}>
                        <GoLaw fontSize="6rem" style={{ marginBottom: '20px'}}/>
                        <h4 style={{ fontWeight: 'bold', color: mainBackgroundColor2, textTransform: 'uppercase'}}>{AppName}</h4>
                        <h6>Monitoramento de processos judiciais e controle de prazos</h6>
                    </Col>
                    <Col className="d-flex flex-column justify-content-center" style={{ backgroundColor: 'white', padding: '40px 20px', borderRadius: '0px 8px 8px 0px'}}>
                        <h4>Bem vindo!</h4>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control type="email" placeholder="Email..." value={email} onChange={({target: { value }}) => setEmail(value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Control type="password" placeholder="Senha..." value={senha} onChange={({target: { value }}) => setSenha(value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Mantenha-me conectado" checked={salvarToken} onChange={({ target }) => setSalvarToken(target.checked)} />
                        </Form.Group>
                        <Button variant="dark" disabled={entrando} onClick={fazerLogin}>{entrando ? 'Entrando...' : 'Entrar'}</Button>
                    </Col>
                </Row>
            </Container>
        </CustomContainer>
    )

}

export default Login
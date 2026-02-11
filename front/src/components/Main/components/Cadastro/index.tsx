import React, { useContext, useState } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import { AppName, mainBackgroundColor, mainBackgroundColor2 } from '../../../../constants'
import Button from '../Button'
import { CustomContainer } from './style'
import { GoLaw } from 'react-icons/go'
import api from '../../../../api'
import { MainContext, useError, useMessage } from '../..'
import { useNavigate, Link } from 'react-router-dom'
import { z } from 'zod'

const Cadastro: React.FC = () => {

    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [confirmarSenha, setConfirmarSenha] = useState("")
    const [erros, setErros] = useState<Record<string, string>>({})
    const [cadastrando, setCadastrando] = useState(false)
    const { setLogado } = useContext(MainContext)
    const showError = useError()
    const showMessage = useMessage()
    const navigate = useNavigate()

    const fazerCadastro = async (event: React.FormEvent) => {
        event.preventDefault()
        setErros({})
        
        const cadastroSchema = z
            .object({
                nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
                email: z.string().email('Email inválido'),
                senha: z.string()
                    .min(8, 'Senha deve ter pelo menos 8 caracteres')
                    .max(20, 'Senha deve ter no máximo 20 caracteres')
                    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
                    .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
                    .regex(/[^A-Za-z0-9]/, 'Senha deve conter pelo menos um caractere especial'),
                confirmarSenha: z.string()
            })
            .refine((data) => data.senha === data.confirmarSenha, {
                message: 'As senhas não coincidem',
                path: ['confirmarSenha']
            })

        const result = cadastroSchema.safeParse({ nome, email, senha, confirmarSenha })
        
        if (!result.success) {
            const errors = result.error.issues.reduce<Record<string, string>>((acc, { path, message }) => {
                const errorName = path[0] as string
                acc[errorName] = message
                return acc
            }, {})
            setErros(errors)
            return
        }

        setCadastrando(true)
        try{
            await api.post('/usuario/admin', { usu_nome: nome, usu_email: email, usu_senha: senha })
            showMessage(`Um email foi enviado para ${email}.\nEntre no link enviado para seu e-mail para poder realizar login no sistema.`)
            navigate('/login')
        }
        catch(error){
            console.log(error)
            showError('Erro ao fazer cadastro. Verifique se o email já está em uso.')
        }
        finally {
            setCadastrando(false)
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
                        <h4>Crie sua conta!</h4>
                        <Form id="cadastro-form"> 
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Control 
                                required 
                                type="text" 
                                placeholder="Nome completo..." 
                                value={nome} 
                                onChange={({ target: { value } }) => setNome(value)}
                                isInvalid={!!erros.nome}
                            />
                            <Form.Control.Feedback type="invalid">{erros.nome}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control 
                                required 
                                type="email" 
                                placeholder="Email..." 
                                value={email} 
                                onChange={({target: { value }}) => setEmail(value)}
                                isInvalid={!!erros.email}
                            />
                            <Form.Control.Feedback type="invalid">{erros.email}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Control 
                                required 
                                type="password" 
                                placeholder="Senha..." 
                                value={senha} 
                                onChange={({target: { value }}) => setSenha(value)}
                                isInvalid={!!erros.senha}
                            />
                            <Form.Control.Feedback type="invalid">{erros.senha}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPasswordConfirm">
                            <Form.Control 
                                required 
                                type="password" 
                                placeholder="Confirmar senha..." 
                                value={confirmarSenha} 
                                onChange={({ target: { value } }) => setConfirmarSenha(value)}
                                isInvalid={!!erros.confirmarSenha}
                            />
                            <Form.Control.Feedback type="invalid">{erros.confirmarSenha}</Form.Control.Feedback>
                        </Form.Group>
                        </Form>
                        <Button form="cadastro-form" variant="dark" disabled={cadastrando} onClick={fazerCadastro}>{cadastrando ? 'Cadastrando...' : 'Cadastrar'}</Button>
                        <div className="text-center mt-3">
                            <span>Já tem uma conta? </span>
                            <Link to="/login" style={{ textDecoration: 'none' }}>Faça login</Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </CustomContainer>
    )

}

export default Cadastro
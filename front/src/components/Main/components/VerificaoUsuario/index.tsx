import React, { useContext, useState } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import { AppName, mainBackgroundColor, mainBackgroundColor2 } from '../../../../constants'
import Button from '../Button'
import { CustomContainer } from './style'
import { GoLaw } from 'react-icons/go'
import api from '../../../../api'
import { MainContext, useError, useMessage, useNotification } from '../..'
import { useNavigate, useParams } from 'react-router'

const VerificaoUsuario: React.FC = () => {

    const [senhaAtual, setSenhaAtual] = useState("")
    const [novaSenha, setNovaSenha] = useState("")
    const [entrando, setEntrando] = useState(false)
    const { token } = useParams()
    const showError = useError()
    const showMessage = useMessage()
    const navigate = useNavigate()

    const verificar = async () => {
        if(!token)
            return
        setEntrando(true)
        try{
            await api.post<{ token: string }>(`usuario/verify/${token}`, { senha_atual: senhaAtual, nova_senha: novaSenha})
            navigate('/login')
            showMessage('Sua senha alterada com sucesso.\n É possível fazer o login agora.')
        }
        catch(error){
            setEntrando(false)
            showError('Erro ao alterar senha.')
        }
    }

    if(token === undefined)
        return <>Não há nada aqui</>

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
                        <h4>Olá! Informe uma nova senha para fazer login.</h4>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control type="password" placeholder="Senha atual..." value={senhaAtual} onChange={({target: { value }}) => setSenhaAtual(value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Control type="password" placeholder="Nova senha..." value={novaSenha} onChange={({target: { value }}) => setNovaSenha(value)} />
                        </Form.Group>
                        <Button variant="dark" disabled={entrando} onClick={verificar}>{entrando ? 'Salvando...' : 'Salvar'}</Button>
                    </Col>
                </Row>
            </Container>
        </CustomContainer>
    )

}

export default VerificaoUsuario
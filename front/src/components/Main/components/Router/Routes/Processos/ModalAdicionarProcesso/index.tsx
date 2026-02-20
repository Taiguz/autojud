import React, { FormEvent, useEffect, useState } from 'react'
import { Form, Modal } from 'react-bootstrap'
import Button from '../../../../Button'
import { IProcesso } from '../../Processo/types'
import { getValidacaoProcessoCNJMensagem, validarProcessoCNJ, validarProcessoResponsaveisTags, validarProcessoTitulo } from '../utils'
import api from '../../../../../../../api'
import { useError } from '../../../../..'
import { v4 } from 'uuid'
import Loader from '../../../../Loader'

interface Props {
    show: boolean
    setShow: (b: boolean) => void
    adicionar: (processo: IProcesso, usu_tag: string) => Promise<void>
}

const ModalAdicionarProcesso: React.FC<Props> = ({ show, setShow, adicionar }) => {

    const [processo, setProcesso] = useState<IProcesso>({ pro_id: 0, pro_cnj: '', pro_titulo: '', pro_situacao: 0})
    const [usuarios, setUsuarios] = useState<string[]>([])
    const [tag, setTag] = useState('')
    const [validar, setValidar] = useState(false)
    const [adicionando, setAdicionando] = useState(false)
    const [carregando, setCarregando] = useState(true)
    const showError = useError()
    const mensagemValidacaoCNJ = getValidacaoProcessoCNJMensagem(processo.pro_cnj)

    useEffect(() => {
        const fetch = async () => {
            try{
                const { data } = await api.get<{usu_tag: string}[]>('usuario')
                setUsuarios(data.map(({ usu_tag }) => usu_tag ))
                setCarregando(false)
            }
            catch(erro){
                setShow(false)
                showError('Erro retornando os usuários.')
            }
        }
        fetch()
    }, [setShow, showError])

    const handleClose = () => {
        if(!adicionando)
            setShow(false)
    }

    const adicionarProcesso = async (event: FormEvent) => {
        event.preventDefault()
        event.stopPropagation()
        setValidar(true)
        if(validarProcessoTitulo(processo.pro_titulo) &&
           validarProcessoCNJ(processo.pro_cnj) &&
           validarProcessoResponsaveisTags(tag, usuarios)){
            setAdicionando(true)
            await adicionar(processo, tag)
            setShow(false)
        }
    }

    return (
        <Modal show={show} onHide={handleClose} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Adicionar processo</Modal.Title>
            </Modal.Header>
              <Modal.Body>
                { carregando ?  <Loader/> :
                    <Form onSubmit={adicionarProcesso} id="adicionarProcesso">
                    <Form.Group className="mb-3">
                        <Form.Label>Título do processo</Form.Label>
                        <Form.Control 
                            autoFocus 
                            type="text" 
                            placeholder="Título..." 
                            required
                            isValid={validar && validarProcessoTitulo(processo.pro_titulo)}
                            isInvalid={validar && !validarProcessoTitulo(processo.pro_titulo)}
                            value={processo.pro_titulo} onChange={({ target: { value } }) => setProcesso({...processo, pro_titulo: value})}
                        />
                        <Form.Control.Feedback type="invalid">Utilize apenas letras e números.</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Use de 4 a 200 caracteres.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Número CNJ</Form.Label>
                        <Form.Control 
                            required
                            type="text" 
                                placeholder="NNNNNNN-DD.AAAA.J.TR.OOOO"
                            isValid={validar && validarProcessoCNJ(processo.pro_cnj)}
                            isInvalid={validar && !validarProcessoCNJ(processo.pro_cnj)}
                            value={processo.pro_cnj} onChange={({ target: { value } }) => setProcesso({...processo, pro_cnj: value})}
                        />
                            <Form.Control.Feedback type="invalid">{mensagemValidacaoCNJ}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Responsável</Form.Label>
                        <Form.Control
                            required
                            placeholder="Responsável 1, Responsável 2..." 
                            type="input"
                            list="user-data"
                            value={tag}
                            onChange={({ target: { value }}) => setTag(value)}
                            isValid={validar && validarProcessoResponsaveisTags(tag, usuarios)}
                            isInvalid={validar && !validarProcessoResponsaveisTags(tag, usuarios)}
                        />
                        <datalist id="user-data">
                            {usuarios.map(usuario => <option key={v4()} value={usuario}>{usuario}</option>)}
                        </datalist>
                        <Form.Control.Feedback type="invalid">
                            Por favor verifique se as tags de usuário são válidas.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose} disabled={adicionando || carregando}>Cancelar</Button>
                <Button type="submit" form="adicionarProcesso" level="primary" disabled={adicionando || carregando}>{adicionando ? 'Adicionando...' : 'Adicionar'}</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalAdicionarProcesso

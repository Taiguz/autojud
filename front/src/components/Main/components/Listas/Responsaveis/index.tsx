import React, { useEffect, useState } from 'react'
import { BasicUsuario, IUsuario } from '../../Router/Routes/Usuario/types'
import { AiOutlineUser, AiOutlineUserAdd, AiOutlineDelete } from "react-icons/ai";
import { Li, Ul } from './style';
import ButtonIcon from '../../ButtonIcon';
import { useError, useNotification } from '../../..';
import api from '../../../../../api';
import Loader from '../../Loader';
import ModalAdicionarResponsaveis from './ModalAdicionarResponsaveis';
import { v4 } from 'uuid';

interface Props {
    url: string
    style?: "simplified"
}

const ListaResponsaveis: React.FC<Props> = ({ url, style }) => {

    const [responsaveis, setResponsaveis] = useState<BasicUsuario[]>([])
    const [carregando, setCarregando] = useState(true)
    const [showModalAddResponsavel, setShowModalAddResponsavel] = useState(false)
    const showError = useError()
    const addNotification = useNotification()

    useEffect(() => {
        const fetchResponsaveis = async () => {
            try{
                const { data } = await api.get<BasicUsuario[]>(url)
                setResponsaveis(data)
                setCarregando(false)
            }
            catch(error){
                showError('Erro ao buscar os responsáveis.')
            }
        }
        fetchResponsaveis()
    },[showError, url])

    const addResponsaveis = async (usu_tags: string) => {
        try {
            const responsaveis = usu_tags.split(',').map(tag => tag.trim())
            await api.post(url, { usu_tag: responsaveis })
            // TODO: fazer uma req única para adicionar em batch
            setResponsaveis(s => {
                const r = responsaveis
                    .map(tag => ({ usu_tag: tag }))
                    .filter(novoUser => s.find(({ usu_tag }) => usu_tag === novoUser.usu_tag) === undefined)
                return [...s, ...r]
            })
            addNotification("Responsáveis adicionados com sucesso.")
        }
        catch(erro){
            showError("Erro ao adicionar responsáveis.")
        }
    }

    const removeResponsavel = async (usu_tag: string) => {
        try{
            await api.delete(`${url}/${usu_tag}`)
            const usuario = responsaveis.findIndex(u => u.usu_tag === usu_tag)
            if(usuario === -1) throw new Error('Usuário não encontrado.')
            addNotification(`Responsável ${responsaveis[usuario].usu_tag} removido.`)
            setResponsaveis(r => {
                const novosResponsaveis = [...r]
                novosResponsaveis.splice(usuario, 1)
                return novosResponsaveis
            })
        }
        catch(error){
            showError('Erro ao remover responsável.')
        }
    }


    if(carregando)
        return <Loader/>

    return (
        <>
            {showModalAddResponsavel &&
                <ModalAdicionarResponsaveis show={showModalAddResponsavel} setShow={setShowModalAddResponsavel} adicionar={addResponsaveis}/>
            }
            <div className='d-flex justify-content-between align-items-center mb-3'>
                {style === 'simplified' ?
                    <p style={{fontWeight: 'bold', marginBottom: '0'}}>Responsáveis</p> :
                    <h3 style={{ marginBottom: '0px'}}>Responsáveis</h3>
                }
                <div className="d-flex flex-row">
                    <ButtonIcon title="Adicionar responsável." onClick={() => setShowModalAddResponsavel(true)}>
                        <AiOutlineUserAdd style={{ fontSize: '1.5rem'}}/>
                    </ButtonIcon>
                </div>
            </div>
            {style !== "simplified" && <hr/>}
            {
                responsaveis.length > 0 ?
                <Ul>
                    {responsaveis.map(({ usu_tag }) => (
                        <Li key={v4()}>
                            <div>
                                <AiOutlineUser style={{ marginRight: '10px', fontSize: '1.1rem'}}/>
                                <span>{usu_tag}</span>
                            </div>
                            <ButtonIcon title="Remover responsável." onClick={() => removeResponsavel(usu_tag)}>
                                <AiOutlineDelete style={{ fontSize: '1.1rem'}}/>
                            </ButtonIcon>
                        </Li>
                    ))}
                </Ul> :
                <>Nenhum responsável.</>
            }
        </>
    )

}

export default ListaResponsaveis
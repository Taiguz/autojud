import React, { useEffect, useState } from 'react'
import { IUsuario } from '../../Router/Routes/Usuario/types'
import { AiOutlineUser, AiOutlineUserAdd, AiOutlineDelete } from "react-icons/ai";
import { Li, Ul } from './style';
import ButtonIcon from '../../ButtonIcon';
import { useError, useNotification } from '../../..';
import api from '../../../../../api';
import Loader from '../../Loader';
import ModalAdicionarResponsaveis from './ModalAdicionarResponsaveis';

interface Props {
    url: string
    style?: "simplified"
}

const ListaResponsaveis: React.FC<Props> = ({ url, style }) => {

    const [responsaveis, setResponsaveis] = useState<IUsuario[]>([])
    const [carregando, setCarregando] = useState(true)
    const [showModalAddResponsavel, setShowModalAddResponsavel] = useState(false)
    const showError = useError()
    const addNotification = useNotification()

    useEffect(() => {
        const fetchResponsaveis = async () => {
            try{
                const { data } = await api.get<IUsuario[]>(url)
                setResponsaveis(data)
                setCarregando(false)
            }
            catch(error){
                showError('Erro ao buscar os responsáveis.')
            }
        }
        fetchResponsaveis()
    },[showError, url])

    const addResponsavel = async (usu_id: number) => {
        await api.post(url, { usu_id })
    }
    const addResponsaveis = async (usuarios: IUsuario[]) => {
        try {
            // TODO: fazer uma req única para adicionar em batch
            for(let usuario of usuarios)
                await addResponsavel(usuario.usu_id)
            setResponsaveis(s => [...s, ...usuarios])
            addNotification("Responsáveis adicionados com sucesso.")
        }
        catch(erro){
            showError("Erro ao adicionar responsáveis.")
        }
    }

    const removeResponsavel = async (usu_id: number) => {
        try{
            await api.delete(`${url}/${usu_id}`)
            const usuario = responsaveis.find(u => u.usu_id === usu_id)
            if(!usuario) throw new Error('Usuário não encontrado.')
            addNotification(`Responsável ${usuario.usu_tag} removido.`)
            setResponsaveis(r => {
                r.splice(r.indexOf(usuario), 1)
                return r
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
                    <h3 style={{ marginBottom: '0px'}}>Reponsáveis</h3>
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
                    {responsaveis.map(({ usu_tag, usu_id }) => (
                        <Li key={usu_id}>
                            <div>
                                <AiOutlineUser style={{ marginRight: '10px', fontSize: '1.1rem'}}/>
                                <span>{usu_tag}</span>
                            </div>
                            <ButtonIcon title="Remover responsável." onClick={() => removeResponsavel(usu_id)}>
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
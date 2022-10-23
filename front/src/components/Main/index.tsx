import React, { useState, createContext, useContext, useCallback, useEffect } from 'react'
import { v4 } from 'uuid'
import { isLogado } from '../../utils'
import CustomError from './components/GenericError'
import Notificador from './components/Notificador'
import Router from './components/Router'
import Login from './components/Login'
import { BreadCrumb, CustomError as ICustomError, CustomMessage as ICustomMessage, MainContextType, Notificacao } from './types'
import CustomMessage from './components/GenericMessage'
import { Routes, Route, useLocation } from 'react-router'
import VerificaoUsuario from './components/VerificaoUsuario'
import { IUsuario } from './components/Router/Routes/Usuario/types'
import api from '../../api'
import Loader from './components/Loader'
import ModalAlterarSenha from './components/Modais/ModalAlterarSenha'



export const MainContext = createContext<MainContextType>({ 
    breadCrumb: [],
    setBreadCrumb: () => {},
    error: { trigger: false, errorOb: null, message: '', reloadPage: false},
    message: { trigger: false, message: ''},
    setMessage: () => {},
    setError: () => {},
    notificacoes: [],
    setNotificacoes: () => {},
    logado: false,
    setLogado: () => {},
    usuario: { usu_id: 0, usu_email: '', usu_oab: '', usu_administrador: false, usu_tag: '', usu_verificado: false },
    setUsuario: () => {}
})

export const useMessage = () => {
    const { setMessage } = useContext(MainContext)

    const showMessage = useCallback((message: string) => {
        setMessage({ trigger: true, message })
    }, [setMessage])

    return showMessage
}

export const useError = () => {
    const { setError } = useContext(MainContext)
    const showError = useCallback((message: string, error: Error | null = null) => {
        setError({ trigger: true, errorOb: error, message, reloadPage: false })
    }, [setError])
    return showError
}

export const useNotification = () => {
    const { setNotificacoes } = useContext(MainContext)
    const addNotificao = useCallback((message: string, type: string = "dark") => {
        setNotificacoes(notificacoes => [...notificacoes, {uuid: v4(), message, type }])
    },[setNotificacoes])
    return addNotificao
}

export const useQuery = () => {
    const { search } = useLocation()
  
    return React.useMemo(() => new URLSearchParams(search), [search]);
}



const Main: React.FC = () => {

    const [breadCrumb, setBreadCrumb] = useState<BreadCrumb[]>([])
    const [error, setError] = useState<ICustomError>({ trigger: false, errorOb: null, message: '', reloadPage: false})
    const [message, setMessage] = useState<ICustomMessage>({ trigger: false, message: '' })
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
    const [logado, setLogado] = useState(isLogado())
    const [usuario, setUsuario] = useState<IUsuario>({ usu_id: 0, usu_email: '', usu_oab: '', usu_administrador: false, usu_tag: '', usu_verificado: false})
    const [carregando, setCarregando] = useState(false)
    const showError = useError()

    useEffect(() => {
        const fetchUsuario = async () => {
            try{
                const { data } = await api.get<IUsuario>('/usuario/me')
                setUsuario(data)
                setCarregando(false)
            }
            catch(erro){
                showError('Erro ao buscar usuário.')
            }

        }
        if(logado)
            fetchUsuario()
        else 
            setCarregando(false)
    }, [logado, showError])

    if(carregando)
        return <Loader/>

    return (
        <MainContext.Provider value={{ breadCrumb, setBreadCrumb, error, setError, notificacoes, setNotificacoes, logado, setLogado, message, setMessage, usuario, setUsuario }}>
            <div style={{ width:'100%', height: '100%' }}>
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto'}}>
                    <Notificador/>
                    <CustomError/>
                    <CustomMessage/>
                    <Routes>
                        {logado ? 
                            <>
                                <Route path="/login" element={<Login/>}/>
                                <Route path="/verify/:token" element={<VerificaoUsuario/>}/>
                                <Route path="*" element={<Router/>}/>
                            </> :
                            <>
                                <Route path="/verify/:token" element={<VerificaoUsuario/>}/>
                                <Route path="*" element={<Login/>}/>
                            </>
                        }
                    </Routes>
                </div>
            </div>
        </MainContext.Provider>
    )

}

export default Main
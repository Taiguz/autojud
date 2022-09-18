import { IUsuario } from "./components/Router/Routes/Usuario/types"

export enum paginas {
    clientes,
    processos
}
export interface BreadCrumb {
    name: string
    path: string
    params?: string[]
}

export interface CustomError {
    trigger: boolean
    errorOb: Error | null
    message: string
    reloadPage: boolean
}

export interface CustomMessage {
    trigger: boolean
    message: string
}

export interface Notificacao {
    uuid: string
    message: string
    type: string
}

export interface MainContextType {
    breadCrumb: BreadCrumb[]
    setBreadCrumb: React.Dispatch<React.SetStateAction<BreadCrumb[]>>
    error: CustomError
    message: CustomMessage
    setMessage: React.Dispatch<React.SetStateAction<CustomMessage>>
    setError: React.Dispatch<React.SetStateAction<CustomError>>
    notificacoes: Notificacao[]
    setNotificacoes: React.Dispatch<React.SetStateAction<Notificacao[]>>
    logado: boolean
    setLogado: React.Dispatch<React.SetStateAction<boolean>>
    usuario: IUsuario
    setUsuario: React.Dispatch<React.SetStateAction<IUsuario>>
}
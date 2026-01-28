export interface IUsuario {
    usu_id: number
    usu_nome: string
    usu_tag: string
    usu_email: string
    usu_oab: string
    usu_verificado: boolean
    usu_administrador: boolean
}

export interface BasicUsuario {
    usu_tag: string
}
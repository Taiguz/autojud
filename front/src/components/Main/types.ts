export enum paginas {
    clientes,
    processos
}
export interface BreadCumb {
    name: string
    path: string
    params?: string[]
}
export interface MainContextType {
    breadCumb: BreadCumb[]
    setBreadCumb: React.Dispatch<React.SetStateAction<BreadCumb[]>>
}
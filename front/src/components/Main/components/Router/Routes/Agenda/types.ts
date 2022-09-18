import { ITarefa } from "../Tarefas/types"

export interface Evento {
    id: string
    title: string
    date: string
    backgroundColor?: string
    tarefa: ITarefa
}
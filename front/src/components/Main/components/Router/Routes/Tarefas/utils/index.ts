import api from "../../../../../../../api"
import { dateToISOSTring } from "../../../../../../../utils"
import { ITarefa } from "../types"

export const adicionarTarefa = async (tarefa: ITarefa, pro_id: number): Promise<ITarefa> => {
    const { tar_objetivo, tar_data_termino } = tarefa
    const tar_data_cadastro = dateToISOSTring(new Date())
    const { data } = await api.post<ITarefa>(`processo/${pro_id}/tarefa`, { tar_objetivo, tar_data_termino, tar_data_cadastro })
    return data
}

export const adicionarSubtarefa = async (tarefa: ITarefa): Promise<ITarefa> => {
    const { tar_objetivo, tar_data_termino, tar_pai_id } = tarefa
    const tar_data_cadastro = dateToISOSTring(new Date())
    const { data } = await api.post<ITarefa>(`tarefa/${tar_pai_id}`, { tar_objetivo, tar_data_termino, tar_data_cadastro })
    return data
}
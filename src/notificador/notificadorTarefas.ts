import { notificarTarefasResponsaveis } from "."
import { getAllParaVencimentoParaResponsaveis } from "../controlers/tarefaController"


export const buscarTarefasEmVencimento = async () => {
    const responsaveisEmVencimento = await getAllParaVencimentoParaResponsaveis()
    Object.values(responsaveisEmVencimento)
        .forEach(({ responsavel, tarefas }) => notificarTarefasResponsaveis(responsavel, tarefas))
}


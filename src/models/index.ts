
//Configurações em comum 

const modelOptions = {
    freezeTableName: true,
    timestamps: false
}

import { modelAndamento } from './andamentoModel'
import { modelProcesso } from './processoModel'
import { modelUsuario } from './usuarioModel'
import { modelTarefa } from './tarefaModel'
import { modelProcessoResponsavel } from './responsavelProcessoModel'
import { modelTarefaResponsavel } from './responsavelTarefaModel'

// Relacionamentos
modelProcesso.hasMany(modelAndamento, { foreignKey: 'pro_id', as: 'andamentos'})

modelProcesso.hasMany(modelTarefa, { foreignKey: 'pro_id', as: 'tarefas'})

modelAndamento.belongsTo(modelProcesso, { foreignKey: 'pro_id', as: 'processo' })

modelTarefa.belongsTo(modelProcesso, { foreignKey: 'pro_id', as: 'processo'})

modelProcesso.belongsToMany(modelUsuario, { through: modelProcessoResponsavel, foreignKey: 'usu_id' })

modelUsuario.belongsToMany(modelProcesso, { through: modelProcessoResponsavel, foreignKey: 'pro_id' })

modelTarefa.belongsToMany(modelUsuario, { through: modelTarefaResponsavel, foreignKey: 'usu_id' })

modelUsuario.belongsToMany(modelTarefa, { through: modelTarefaResponsavel, foreignKey: 'tar_id' })

export {modelOptions, modelUsuario, modelProcesso, modelAndamento, modelTarefa, modelProcessoResponsavel, modelTarefaResponsavel}
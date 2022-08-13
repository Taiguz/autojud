import { DataTypes } from "sequelize";
import { modelOptions  } from ".";
import database from "../database";
import { ModelTarefaResponsavel } from "./types";

export const modelTarefaResponsavel = database.define<ModelTarefaResponsavel>('responsavel_tarefa', {
        usu_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            validate: {
                isInt: true
            }
        },
        tar_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            validate: {
                isInt: true
            }
        }
}, modelOptions)
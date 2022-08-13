import { DataTypes } from "sequelize";
import { modelOptions, modelProcesso, modelUsuario } from ".";
import database from "../database";
import { ModelProcessoResponsavel } from "./types";

export const modelProcessoResponsavel = database.define<ModelProcessoResponsavel>('responsavel_processo', {
        usu_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            validate: {
                isInt: true
            }
        },
        pro_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            validate: {
                isInt: true
            }
        }
}, modelOptions)
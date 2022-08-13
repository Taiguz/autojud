import { DataTypes } from "sequelize";
import { modelOptions } from ".";
import database from "../database";
import { regValidadeTextFields } from "../utils/constants";
import { ModelTarefa } from "./types";

export const modelTarefa = database.define<ModelTarefa>('tarefa', {
        tar_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        tar_objetivo: {
            type: DataTypes.STRING(200),
            allowNull: false,
            validate: {
                is: {
                    args: regValidadeTextFields,
                    msg: 'O objetivo da tarefa não pode conter caracteres especiais.'
                },
                notEmpty: {
                    msg: 'O objetivo da tarefa não pode ser vazio.'
                },
                len: {
                    args: [4, 200],
                    msg: 'O objetivo da tarefa deve ter entre 4 e 200 caracteres.'
                }
            }
        },
        tar_data_cadastro: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                isDate: {
                    msg: 'A tarefa deve ter uma data de cadastro válida.',
                    args: true
                }
            }
        },
        tar_data_termino: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                isDate: {
                    msg: 'A tarefa deve ter uma data de término válida.',
                    args: true
                }
            }
        },
        tar_situacao: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        tar_pai_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
            validate: {
                isInt: true
            }
        },
        and_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isInt: true
            }
        },
        pro_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true
            }
        }
}, modelOptions)
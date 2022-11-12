import { DataTypes } from "sequelize";
import { modelOptions } from ".";
import database from "../database";
import { regValidadeTextFields } from "../utils/constants";
import { ModelProcesso } from "./types";

export const modelProcesso = database.define<ModelProcesso>('processo', {
        pro_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        pro_cnj: { 
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: {
                name: 'cnj_unique',
                msg: 'Este número de CNJ já está cadastrado no sistema.'
            },
            validate: {
                notEmpty: {
                    msg: 'O número de CNJ não pode ser vazio.'
                },
                is: {
                    args: /^[0-9-.]+$/,
                    msg: 'O número de CNJ não possui um formato válido.'
                }
            }
        },
        pro_titulo: {
            type: DataTypes.STRING(200),
            allowNull: false,
            validate:{
                notEmpty: {
                    msg: 'O título do processo não pode ser vazio'
                },
                is: {
                    args: regValidadeTextFields,
                    msg: 'O título do processo não pode conter caracteres especiais.'
                },
                len: {
                    args: [4, 200],
                    msg: 'O título do processo deve ter entre 4 a 20 caracteres.'
                }
            }
        },
        pro_ultimo_andamento: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            validate: {
                notEmpty: true,
                isDate: true
            }
        },
        pro_external_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isInt: true
            }
        },
        pro_situacao: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
            validate: {
                isInt: true
            }
        },
        pro_buscando_andamentos: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        }
}, modelOptions)
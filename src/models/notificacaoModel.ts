import { DataTypes } from "sequelize";
import { modelOptions } from ".";
import database from "../database";
import { ModelNotificacao } from "./types";

export const modelNotificacao = database.define<ModelNotificacao>('notificacao', {
        not_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        not_aviso: {
            type: DataTypes.STRING(300),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'O aviso da notificação não pode ser vazio.'
                },
                len: {
                    args: [4, 300],
                    msg: 'O aviso da notificação deve ter entre 4 e 300 caracteres.'
                }
            }
        },
        not_data_envio: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                isDate: {
                    msg: 'O aviso deve ter uma data de envio válida.',
                    args: true
                }
            }
        },
        not_visto: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        not_importancia: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
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
        },
        tar_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
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
        usu_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isInt: true
            }
        }
}, modelOptions)
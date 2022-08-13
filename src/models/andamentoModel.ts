import { DataTypes } from "sequelize";
import { modelOptions } from ".";
import database from "../database";
import { ModelAndamento } from "./types";

export const modelAndamento = database.define<ModelAndamento>('andamento', {
        and_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        and_descricao: { 
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        and_data: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                isDate: true
            }
        },
        and_external_id: {
            type: DataTypes.NUMBER,
            allowNull: true,
            validate: {
                isInt: true
            }
        },
        pro_id: {
            type: DataTypes.NUMBER,
            allowNull: false,
            validate: {
                isInt: true
            }
        },

}, modelOptions)
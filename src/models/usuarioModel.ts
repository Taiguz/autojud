import { DataTypes } from "sequelize";
import { modelOptions } from ".";
import database from "../database";
import { ModelUsuario } from "./types";


export const modelUsuario = database.define<ModelUsuario>('usuario', {
    usu_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    usu_tag: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: {
            name: 'tag_unique',
            msg: 'Já existe um usuário com está tag.'
        },
        validate: {
            isAlphanumeric: {
                msg: 'Tag do usuário não pode conter caracteres especiais.'
            },
            notEmpty: {
                msg: 'Tag do usuário não pode ser vazia.'
            },
            len: { 
                args: [4, 20],
                msg: 'Tag do usuário deve ter entre 4 a 20 caracteres.'
            }
        }
    },
    usu_email: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: {
            name: 'email_unique',
            msg: 'Este e-mail já está cadastrado no sistema. Por favor, tente fazer login.'
        },
        validate: {
            isEmail: {
                msg: 'O email do usuário deve estar em um formato válido.'
            },
            notEmpty: {
                msg: 'O email do usuário não pode ser vazio'
            },
            len: { 
                args: [4, 200],
                msg: 'O email do usuário deve ter entre 4 a 200 caracteres.'
            }
        }
    },
    usu_senha: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    usu_administrador: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    usu_verificado: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    usu_oab: {
        //TODO: usuário pode ter mais de uma oab, implementar isso no futuro
        type: DataTypes.STRING(8),
        allowNull: false,
        //TODO: Não estou checando se a oab existe somente se tem um formato válido. Checar a existência no futuro?
        validate: {
            is: {
                args: /[A-Z]{2}[0-9]{6}/,
                msg: 'A oab do usuário não possui o formato adequado.'
            },
            notEmpty: {
                msg: 'A oab do usuário não pode ser vazia.'
            }
        }
    }

}, modelOptions)
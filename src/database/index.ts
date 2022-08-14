import { Options, Sequelize  } from "sequelize";
import logger from "../utils/logger";
import Logger from '../utils/logger'
import { isProductionEnv } from "../utils/utils";


const options: Options = {
    logging: (msg: any) => Logger.info(`Database ${msg}`) ,
}

if(isProductionEnv()){
    options.dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
}


const getDBUrl = (): string => {
    if(isProductionEnv()){
        if(process.env.DATABASE_URL !== undefined)
            return process.env.DATABASE_URL
        logger.error('No database url for prodcution enviroment.')
        process.exit(-1)
    }
    const { DB_NAME, DB_URL, DB_PORT, DB_USER, DB_PASS} = process.env
    return `postgres://${DB_USER}:${DB_PASS}@${DB_URL}:${DB_PORT}/${DB_NAME}`
}
const sequelize = new Sequelize(getDBUrl(), options)

const testConnection = async () => {
    try {
        await sequelize.authenticate()
        Logger.info('Successfully connected to the database!')
    } catch(error){
        Logger.error('Could not connect to database.', error)
        process.exit(-1)
    }
}

testConnection()

export default sequelize

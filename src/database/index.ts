import { Options, Sequelize  } from "sequelize";
import logger from "../utils/logger";
import Logger from '../utils/logger'
import { isProductionEnv } from "../utils/utils";


const options: Options = {
    logging: (msg: any) => Logger.info(`Database ${msg}`) ,
}

//if(isProductionEnv()){
//options.dialectOptions = {
//ssl: {
//require: true,
//rejectUnauthorized: false
//}
//}
//}


const getDBUrl = (): string => {
    const { DB_NAME, DB_URL, DB_PORT, DB_USER, DB_PASS } = process.env
    if (!DB_NAME || !DB_URL || !DB_PORT || !DB_USER || !DB_PASS) {
        logger.error('Database environment variables not set.')
        process.exit(-1)
    }
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

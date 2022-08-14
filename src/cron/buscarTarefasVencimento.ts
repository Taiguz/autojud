import { isProductionEnv } from "../utils/utils";
if(!isProductionEnv())
    require('dotenv').config()
import { buscarTarefasEmVencimento } from "../notificador/notificadorTarefas";


buscarTarefasEmVencimento()
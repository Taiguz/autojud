import { isProductionEnv } from "../utils/utils";
if(!isProductionEnv())
    require('dotenv').config()
import { buscaPeriodicaAndamentos } from "../buscador";


buscaPeriodicaAndamentos()
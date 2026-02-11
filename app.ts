require('dotenv').config()
import http from 'http'
import cors from 'cors'
import Logger from './src/utils/logger'
import { dataHoje } from './src/utils/dataUtils'
import database from './src/database'
import processoRouter from './src/routes/processo'
import rootRouter from './src/routes/root'
import usuarioRouter from './src/routes/usuario'
import tarefaRouter from './src/routes/tarefa'
import andamentoRouter from './src/routes/andamento'
import notificacaoRouter from './src/routes/notificacao'
import { getEnv, isProductionEnv } from './src/utils/utils'
import { buscarTarefasEmVencimento } from './src/notificador/notificadorTarefas'
import { buscaPeriodicaAndamentos } from './src/buscador'
import { Request, Response } from 'express'

const appDomain = getEnv('DOMAIN')
const debug = require('debug')('autojud:server');

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();

app.use(logger('dev')); //  Requests logs

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (isProductionEnv())
  app.use(cors({ origin: appDomain, credentials: true }))
else
  app.use(cors())

app.use('/processo', processoRouter)
app.use('/andamento', andamentoRouter)
app.use('/usuario', usuarioRouter)
app.use('/tarefa', tarefaRouter)
app.use('/notificacao', notificacaoRouter)
app.use('/', rootRouter);

const normalizePort = (val: string) => {
  const port = parseInt(val, 10);
  if (isNaN(port))
    return val;
  if (port >= 0)
    return port;
  return false;
}

const port = normalizePort(process.env.PORT || '3000');

const onError = (error: { syscall: string; code: any; }) => {
  Logger.error('Server error.', error)
  if (error.syscall !== 'listen')
    throw error;

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      Logger.error(`Erro de acesso a porta ${port}.`, error)
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      Logger.error(`Porta em uso ${port}.`, error)
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

app.set('port', port);

const server = http.createServer(app);

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr?.port;
  Logger.info(`Server online on ${bind}!.`)
  debug('Server online on ' + bind);
  console.log(`Servidor online! Rodando em ${process.env.PORT}.`)
}

// TODO enhance the gracefull shutdown?
const gracefullShutdown = () => {
  Logger.info('Initiating gracefull shutdown...')
  server.close(async () => {
    Logger.info('HTTP server closed.')
    await database.close()
    Logger.info('Exiting application.')
    process.exit(0)
  });
}

server.listen(port);

server.on('error', onError);

server.on('listening', onListening);

process.on('SIGTERM', gracefullShutdown)
process.on('SIGINT', gracefullShutdown)

//buscarTarefasEmVencimento()
//buscaPeriodicaAndamentos()

// Utilização do Heroku Scheduller
//new CronJob(cronBuscarTarefasVencimento, buscarTarefasEmVencimento, null, true);
//new CronJob(cronBuscarAndamentos, buscaPeriodicaAndamentos, null, true);

module.exports = app;

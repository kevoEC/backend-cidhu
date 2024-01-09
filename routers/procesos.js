const express = require('express');
const ProcesosController = require('../controllers/procesos');
const md_auth = require('../middlewares/authenticated');
const { createProcesoValidations } = require('../controllers/procesos');
const api = express.Router();

api.post('/proceso/:id', [md_auth.asureAuth], ProcesosController.getProceso);
api.post('/procesos',[md_auth.asureAuth] ,ProcesosController.getProcesos);
api.post('/proceso',[md_auth.asureAuth], createProcesoValidations , ProcesosController.createProceso);
api.post('/procesoU/:id',[md_auth.asureAuth], createProcesoValidations ,ProcesosController.updateProceso);
api.post('/procesoD/:id',[md_auth.asureAuth] ,ProcesosController.deleteProceso);

module.exports = api;
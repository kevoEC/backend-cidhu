const express = require('express');
const Denuncia_Abogado = require('../controllers/denuncia_abogado');
const md_auth = require('../middlewares/authenticated');
const { createDenuncia_AbogadoValidations } = require('../controllers/denuncia_abogado');
const api = express.Router();

api.post('/relacion/:id', [md_auth.asureAuth], Denuncia_Abogado.getRelacion);
api.post('/relaciones',[md_auth.asureAuth] ,Denuncia_Abogado.getRelaciones);
api.post('/relacion',[md_auth.asureAuth], createDenuncia_AbogadoValidations , Denuncia_Abogado.createRelacion);
api.post('/relacionU/:id',[md_auth.asureAuth], createDenuncia_AbogadoValidations ,Denuncia_Abogado.updateRelacion);
api.post('/relacionD/:id',[md_auth.asureAuth] ,Denuncia_Abogado.deleteRelacion);

module.exports = api;
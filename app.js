const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {API_VERSION} = require('./constants');

const app = express();

//Import routings
const authRoutes = require('./routers/auth');
const userRoutes = require('./routers/user');
const menuRoutes = require('./routers/menu');
const denunciaRoutes = require('./routers/denuncias');
const procesoRoutes = require('./routers/procesos');
const fechaRoutes = require('./routers/fecha');
const denuncia_abogadoRoutes = require('./routers/denuncia_abogado');

// Configure Body Parse
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Configure static folder
app.use(express.static('uploads'));

//Configure Header HTTP - CORS
app.use(cors());

//Configure routings
app.use(`/api/${API_VERSION}`, authRoutes)
app.use(`/api/${API_VERSION}`, userRoutes)
app.use(`/api/${API_VERSION}`, menuRoutes)
app.use(`/api/${API_VERSION}`, denunciaRoutes)
app.use(`/api/${API_VERSION}`, procesoRoutes)
app.use(`/api/${API_VERSION}`, fechaRoutes)
app.use(`/api/${API_VERSION}`, denuncia_abogadoRoutes)


module.exports = app;

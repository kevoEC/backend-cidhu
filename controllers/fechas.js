const Proceso = require('../models/procesos');
const Fecha = require('../models/fechas');
const { validationResult, body } = require('express-validator');
const STATUS = {
    SUCCESS: { msg: 'Operación exitosa', status: true },
    ERROR: { msg: 'Error en la operación', status: false },
  };


  const createFechaValidations = [
    body('procesos').notEmpty(),
    body('fechaInicio').notEmpty(),
    body('asunto').notEmpty(),
    body('activo').notEmpty()
];

// OBTENER LA DENUNCIA POR ID
async function getCita(req, res){
    const { id } = req.params;
    try {
        const response = await Fecha.findById(id).populate(
            {
                path: "procesos",
                select: "_id",
            }
        );

        if (!response) {
            return res.status(404).json({ ...STATUS.ERROR, msg: 'Cita no encontrado' });
        }

        return res.status(200).json({ ...STATUS.SUCCESS, data: response });
    } catch (error) {
        return res.status(500).json({ ...STATUS.ERROR, msg: `Error al obtener la cita: ${error}` });
    }
}


const getCitas = async (req, res) => {
    const { fecha } = req;
  
    try {
      const fechas = await Fecha.find({ active: true }).populate(
        {
                path: "procesos",
                select: "_id",
        }
      );
      res.status(200).json({ data: fechas, status: true });
      console.log(fechas);
    } catch (error) {
      res.status(400).json({ msg: error.message, status: false });
    }
  };

// CREAR CITA Y GUARDARLA EN LA BASE DE DATOS
async function createCita(req, res) {
    // Validar los campos obligatorios
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), status: false });
    }

    const { procesos, tipo, descripcion, activo } = req.body;
    const cita = new Fecha({ ...req.body, active: false });

    try {
        const existProceso = await Proceso.findOne({
            _id: procesos,
            activo: true
        });

        if (!existProceso) {
            const error = new Error("Proceso no registrado o inactivo consultarlo con el administrador");
            return res.status(400).json({ msg: error.message, status: false });
        }

        // GUARDAR CITA
        await cita.save();

        // GUARDAR REFERENCIA EN PROCESO
        existProceso.fechas.push(cita._id);
        await existProceso.save();

        return res.status(201).json({ ...STATUS.SUCCESS, data: cita });
    } catch (error) {
        return res.status(500).json({ ...STATUS.ERROR, msg: `Error al crear la cita: ${error}` });
    }
}
// ACTUALIZAR CITA
async function updateCita(req, res) {
    const { id } = req.params;
    const citaData = req.body;

    try {
        // Validar los campos opcionales
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), status: false });
        }

        // Actualizar la cita
        const updatedCita = await Fecha.findByIdAndUpdate(id, citaData, { new: true });

        if (!updatedCita) {
            return res.status(404).json({ ...STATUS.ERROR, msg: 'Cita no encontrado' });
        }

        return res.status(200).json({ ...STATUS.SUCCESS, data: updatedCita });
    } catch (error) {
        return res.status(500).json({ ...STATUS.ERROR, msg: `Error al actualizar la cita: ${error}` });
    }
}


  

// ELIMINAR CITA
async function deleteCita(req, res) {
    try {
        const { id } = req.params;

        // Buscar y eliminar la cita
        const deleteCita = await Fecha.findByIdAndDelete(id);

        if (!deleteCita) {
            return res.status(404).json({ ...STATUS.ERROR, msg: 'Cita no encontrada' });
        }

        // Eliminar la referencia de la cita en el proceso
        const existProceso = await Proceso.findOneAndUpdate(
            { Fechas: id },
            { $pull: { Fechas: id } },
            { new: true }
        );

        return res.status(200).json({ ...STATUS.SUCCESS, data: deleteCita });
    } catch (error) {
        return res.status(500).json({ ...STATUS.ERROR, msg: `Error al eliminar la cita: ${error}` });
    }
}

// EXPORTAR LOS MÉTODOS
module.exports = {
    getCita,
    getCitas,
    createCita,
    updateCita,
    deleteCita,
    createFechaValidations
}

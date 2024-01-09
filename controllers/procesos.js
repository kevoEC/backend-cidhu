const Proceso = require('../models/procesos');
const Denuncia = require('../models/denuncias');
const { validationResult, body } = require('express-validator');
const STATUS = {
    SUCCESS: { msg: 'Operación exitosa', status: true },
    ERROR: { msg: 'Error en la operación', status: false },
  };


  const createProcesoValidations = [
    body('denuncia').notEmpty(),
    body('tipo').notEmpty(),
    body('descripcion').notEmpty(),
    body('activo').notEmpty()

];

// OBTENER LA DENUNCIA POR ID
async function getProceso(req, res){
    const { id } = req.params;

    try {
        const response = await Proceso.findById(id);

        if (!response) {
            return res.status(404).json({ ...STATUS.ERROR, msg: 'Proceso no encontrado' });
        }

        return res.status(200).json({ ...STATUS.SUCCESS, data: response });
    } catch (error) {
        return res.status(500).json({ ...STATUS.ERROR, msg: `Error al obtener el proceso: ${error}` });
    }
}



// OBTENER TODOS LOS PROCESOS
// async function getProcesos(req, res){
//     const {activo} = req.query;
//     let response = null;

//     if(activo == undefined){
//         response = await Proceso.find();
//     }else{
//         response = await Proceso.find({activo});
//     }
//     res.status(200).send(response);
// }

const getProcesos = async (req, res) => {
    const { denuncia } = req;
  
    try {
      const procesos = await Proceso.find({ active: true }).populate(
        {
                    path: "fechas",
                    select: "_id",
        }
      );
      res.status(200).json({ data: procesos, status: true });
      console.log(procesos);
    } catch (error) {
      res.status(400).json({ msg: error.message, status: false });
    }
  };

// CREAR PROCESO Y GUARDARLA EN LA BASE DE DATOS
async function createProceso(req, res) {
    // Validar los campos obligatorios
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), status: false });
    }

    const { denuncia, tipo, descripcion, active } = req.body;
    const proceso = new Proceso({ ...req.body, active: false });

    try {
        const existDenuncia = await Denuncia.findOne({
            _id: denuncia,
            activo: true,
        });

        if (!existDenuncia) {
            const error = new Error("Denuncia no registrada o inactiva consultarlo con el administrador");
            return res.status(400).json({ msg: error.message, status: false });
        }

        // GUARDAR PROCESO
        await proceso.save();

        // GUARDAR REFERENCIA EN DENUNCIA
        existDenuncia.procesos.push(proceso._id);
        await existDenuncia.save();

        return res.status(201).json({ ...STATUS.SUCCESS, data: proceso });
    } catch (error) {
        return res.status(500).json({ ...STATUS.ERROR, msg: `Error al crear el proceso: ${error}` });
    }
}
// ACTUALIZAR PROCESO
async function updateProceso(req, res) {
    const { id } = req.params;
    const procesoData = req.body;

    try {
        // Validar los campos opcionales
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), status: false });
        }

        // Actualizar el proceso
        const updatedProceso = await Proceso.findByIdAndUpdate(id, procesoData, { new: true });

        if (!updatedProceso) {
            return res.status(404).json({ ...STATUS.ERROR, msg: 'Proceso no encontrado' });
        }

        return res.status(200).json({ ...STATUS.SUCCESS, data: updatedProceso });
    } catch (error) {
        return res.status(500).json({ ...STATUS.ERROR, msg: `Error al actualizar el proceso: ${error}` });
    }
}


  

// ELIMINAR PROCESO
async function deleteProceso(req, res) {
    try {
        const { id } = req.params;

        // Buscar y eliminar el proceso
        const deletedProceso = await Proceso.findByIdAndDelete(id);

        if (!deletedProceso) {
            return res.status(404).json({ ...STATUS.ERROR, msg: 'Proceso no encontrada' });
        }

        // Eliminar la referencia del proceso en la denuncia
        const existDenuncia = await Denuncia.findOneAndUpdate(
            { Procesos: id },
            { $pull: { Procesos: id } },
            { new: true }
        );

        return res.status(200).json({ ...STATUS.SUCCESS, data: deletedProceso });
    } catch (error) {
        return res.status(500).json({ ...STATUS.ERROR, msg: `Error al eliminar el proceso: ${error}` });
    }
}

// EXPORTAR LOS MÉTODOS
module.exports = {
    getProceso,
    getProcesos,
    createProceso,
    updateProceso,
    deleteProceso,
    createProcesoValidations
}

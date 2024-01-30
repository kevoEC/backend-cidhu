const Denuncia = require('../models/denuncias');
const User = require('../models/user');
const { validationResult, body } = require('express-validator');
const STATUS = {
    SUCCESS: { msg: 'Operación exitosa', status: true },
    ERROR: { msg: 'Error en la operación', status: false },
  };

  const createDenunciaValidations = [
    body('user').notEmpty(),
    body('caracter').notEmpty(),
    body('instancia').notEmpty(),
    body('caracterPersonal').notEmpty(),
    body('asistencia').notEmpty(),
    body('resumenHechos').notEmpty(),
    body('nombresResponsables').notEmpty(),
    body('activo').notEmpty()
    // Puedes agregar más validaciones para otros campos si es necesario
];

// OBTENER LA DENUNCIA POR ID
async function getDenuncia(req, res){
    const { id } = req.params;

    try {
        const response = await Denuncia.findById(id);

        if (!response) {
            return res.status(404).json({ ...STATUS.ERROR, msg: 'Denuncia no encontrada' });
        }

        return res.status(200).json({ ...STATUS.SUCCESS, data: response });
    } catch (error) {
        return res.status(500).json({ ...STATUS.ERROR, msg: `Error al obtener la denuncia: ${error}` });
    }
}



// OBTENER TODAS LAS DENUNCIAS
// async function getDenuncias(req, res){
//     const {activo} = req.query;
//     let response = null;

//     if(activo == undefined){
//         response = await Denuncia.find();
//     }else{
//         response = await Denuncia.find({activo});
//     }
//     res.status(200).send(response);
// }

const getDenuncias = async (req, res) => {
    const { denuncia } = req;
  
    try {
      const denuncias = await Denuncia.find({ active: true }).populate(
        {
            path: "procesos",
            select: "_id",
                populate: {
                    path: "fechas",
                    select: "_id",
                },

        }
      );
      res.status(200).json({ data: denuncias, status: true });
      console.log(denuncias);
    } catch (error) {
      res.status(400).json({ msg: error.message, status: false });
    }
  };

// CREAR DENUNCIA Y GUARDARLA EN LA BASE DE DATOS
async function createDenuncia(req, res) {
    // Validar los campos obligatorios
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), status: false });
    }

    const { user, caracter, instancia, caracterPersonal, asistencia, resumenHechos, nombresResponsables, activo } = req.body;
    const denuncia = new Denuncia({ ...req.body, active: false });

    try {
        const existUser = await User.findOne({
            _id: user,
            active: true,
        });

        if (!existUser) {
            const error = new Error("Usuario no registrado o inactivo consultarlo con el administrador");
            return res.status(400).json({ msg: error.message, status: false });
        }

        // GUARDAR DENUNCIA
        await denuncia.save();

        // GUARDAR REFERENCIA EN USUARIO
        existUser.denuncias.push(denuncia._id);
        await existUser.save();

        return res.status(201).json({ ...STATUS.SUCCESS, data: denuncia });
    } catch (error) {
        return res.status(500).json({ ...STATUS.ERROR, msg: `Error al crear la denuncia: ${error}` });
    }
}
// ACTUALIZAR DENUNCIA
async function updateDenuncia(req, res) {
    const { id } = req.params;
    const denunciaData = req.body;

    try {
        // Validar los campos opcionales
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), status: false });
        }

        // Actualizar la denuncia
        const updatedDenuncia = await Denuncia.findByIdAndUpdate(id, denunciaData, { new: true });

        if (!updatedDenuncia) {
            return res.status(404).json({ ...STATUS.ERROR, msg: 'Denuncia no encontrada' });
        }

        return res.status(200).json({ ...STATUS.SUCCESS, data: updatedDenuncia });
    } catch (error) {
        return res.status(500).json({ ...STATUS.ERROR, msg: `Error al actualizar la denuncia: ${error}` });
    }
}


  

// ELIMINAR DENUNCIA
async function deleteDenuncia(req, res) {
    try {
        const { id } = req.params;

        // Buscar y eliminar la denuncia
        const deletedDenuncia = await Denuncia.findByIdAndDelete(id);

        if (!deletedDenuncia) {
            return res.status(404).json({ ...STATUS.ERROR, msg: 'Denuncia no encontrada' });
        }

        // Eliminar la referencia de la denuncia en el usuario
        const existUser = await User.findOneAndUpdate(
            { Denuncias: id },
            { $pull: { Denuncias: id } },
            { new: true }
        );

        return res.status(200).json({ ...STATUS.SUCCESS, data: deletedDenuncia });
    } catch (error) {
        return res.status(500).json({ ...STATUS.ERROR, msg: `Error al eliminar la denuncia: ${error}` });
    }
}

// EXPORTAR LOS MÉTODOS
module.exports = {
    getDenuncia,
    getDenuncias,
    createDenuncia,
    createDenunciaValidations,
    updateDenuncia,
    deleteDenuncia
}

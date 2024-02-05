const Denuncia = require('../models/denuncias');
const User = require('../models/user');
const Denuncia_Abogado = require('../models/denuncia_abogado');
const { validationResult, body } = require('express-validator');
const STATUS = {
    SUCCESS: { msg: 'Operación exitosa', status: true },
    ERROR: { msg: 'Error en la operación', status: false },
  };

  const createDenuncia_AbogadoValidations = [
    body('user').notEmpty(),
    body('denuncia').notEmpty()
];

// OBTENER LA RELACIÓN POR ID
async function getRelacion(req, res){
    const { id } = req.params;

    try {
        const response = await Denuncia_Abogado.findById(id).populate(
            {
                path: "user",
                select: "_id",
            }
        );

        if (!response) {
            return res.status(404).json({ ...STATUS.ERROR, msg: 'La relación no existe' });
        }

        return res.status(200).json({ ...STATUS.SUCCESS, data: response });
    } catch (error) {
        return res.status(500).json({ ...STATUS.ERROR, msg: `Error al obtener la asignación del caso: ${error}` });
    }
}

  


const getRelaciones = async (req, res) => {
    try {
      const relaciones = await Denuncia_Abogado.find();
      const relacionesCompletas = [];
  
      for (const relacion of relaciones) {
        // Obtener datos completos del usuario
        const usuario = await User.findOne(relacion.user).lean();
  
        // Obtener datos completos de la denuncia
        const denuncia = await Denuncia.findById(relacion.denuncia).lean();
  
        // Combinar datos completos de la relación, usuario y denuncia
        const relacionCompleta = {
          _id: relacion._id,
          user: usuario,
          denuncia: denuncia,
          createdAt: relacion.createdAt,
          updatedAt: relacion.updatedAt,
          __v: relacion.__v
        };
  
        relacionesCompletas.push(relacionCompleta);
      }
  
      res.status(200).json({ data: relacionesCompletas, status: true });
    } catch (error) {
      res.status(400).json({ msg: error.message, status: false });
    }
  };
  



// CREAR DENUNCIA Y GUARDARLA EN LA BASE DE DATOS
async function createRelacion(req, res) {
    // Validar los campos obligatorios
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), status: false });
    }

    const { user, denuncia } = req.body;
    const relacion = new Denuncia_Abogado({ ...req.body, active: false });

    try {
        const existUser = await User.findOne({
            _id: user,
            active: true,
        });

        const existDenuncia = await Denuncia.findOne({
            _id: denuncia,
            active: true,
        });


        if (!existUser) {
            const error = new Error("Usuario no registrado o inactivo consultarlo con el administrador");
            return res.status(400).json({ msg: error.message, status: false });
        }

        if (!existDenuncia) {
            const error = new Error("Denuncia no registrada o inactiva");
            return res.status(400).json({ msg: error.message, status: false });
        }

        // GUARDAR RELACION
        await relacion.save();

        return res.status(201).json({ ...STATUS.SUCCESS, data: relacion });
    } catch (error) {
        return res.status(500).json({ ...STATUS.ERROR, msg: `Error al crear la relación: ${error}` });
    }
}


// ACTUALIZAR DENUNCIA
async function updateRelacion(req, res) {
    const { id } = req.params;
    const relacionData = req.body;

    try {
        // Validar los campos opcionales
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), status: false });
        }

        // Actualizar la denuncia
        const updatedRelacion = await Denuncia_Abogado.findByIdAndUpdate(id, relacionData, { new: true });

        if (!updatedRelacion) {
            return res.status(404).json({ ...STATUS.ERROR, msg: 'Relación no encontrada' });
        }

        return res.status(200).json({ ...STATUS.SUCCESS, data: updatedRelacion });
    } catch (error) {
        return res.status(500).json({ ...STATUS.ERROR, msg: `Error al actualizar la relación: ${error}` });
    }
}


  

// ELIMINAR DENUNCIA
async function deleteRelacion(req, res) {
    try {
        const { id } = req.params;

        // Buscar y eliminar la denuncia
        const deletedRelacion = await Denuncia_Abogado.findByIdAndDelete(id);

        if (!deletedRelacion) {
            return res.status(404).json({ ...STATUS.ERROR, msg: 'Relación no encontrada' });
        }

        return res.status(200).json({ ...STATUS.SUCCESS, data: deletedRelacion });
    } catch (error) {
        return res.status(500).json({ ...STATUS.ERROR, msg: `Error al eliminar la relación: ${error}` });
    }
}

// EXPORTAR LOS MÉTODOS
module.exports = {
    getRelacion,
    createRelacion,
    updateRelacion,
    deleteRelacion,
    getRelaciones,
    createDenuncia_AbogadoValidations
}

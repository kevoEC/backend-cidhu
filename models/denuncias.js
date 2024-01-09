const mongoose = require('mongoose');

const DenunciaSchema = mongoose.Schema({
    caracter: String,
    instancia: String,
    caracterPersonal: Boolean,
    asistencia: Boolean,
    resumenHechos: String,
    nombresResponsables: String,
    activo: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    procesos: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "procesos",
        }
    ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('denuncias', DenunciaSchema);
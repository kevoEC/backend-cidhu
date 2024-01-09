const mongoose = require('mongoose');

const ProcesosSchema = mongoose.Schema({
    tipo: String,
    descripcion: String,
    activo: Boolean,
    denuncia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "denuncias",
        required: true,
      },
    fechas: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "fechas",
        }
    ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('procesos', ProcesosSchema);
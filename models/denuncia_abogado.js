const mongoose = require('mongoose');


const Denuncia_AbogadoSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      denuncia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "denuncias",
        activo: true,
        required: true,
      },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('denuncia_abogado', Denuncia_AbogadoSchema);
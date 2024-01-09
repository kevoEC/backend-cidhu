const mongoose = require('mongoose');


const FechaSchema = mongoose.Schema({
    fechaInicio: Date,
    fechaFin: Date,
    asunto: String,
    activo: Boolean,
    procesos: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "procesos",
        required: true,
    },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('fechas', FechaSchema);
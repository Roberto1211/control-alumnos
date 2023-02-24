const { Schema, model } = require('mongoose');

const cursoSchema = Schema({
    nombreCurso: {
        type: String,
        required: [true, 'El nombre del curso es obligatorio' ],
    },
    usuario: [{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    }],
    estado: {
        type: Boolean,
        default: true
    },
});


module.exports = model('Curso', cursoSchema);
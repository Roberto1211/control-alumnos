const { response, request } = require('express');
const Curso = require('../models/curso');

const getCursos = async (req = request, res = response) => {

    const query = { estado: true };

    const listaCursos = await Promise.all([
        Curso.countDocuments(query),
        Curso.find(query)
    ]);

    res.json({
        listaCursos
    });

}

const getCursosAsignados = async (req, res) => {
    const { id } = req.params;

    try {
        const cursosAsignados = await Curso.find({ usuario: id });

        res.json(cursosAsignados);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error'
        });
    }
}

const putAsignCursos = async (req = request, res = response) => {

    const { cursos, usuario } = req.body;

    try {
        for (let i = 0; i < cursos.length; i++) {
            const curso = await Curso.findById(cursos[i]);
            if (curso.usuario.includes(usuario)) {
                return res.status(400).json({
                    msg: 'El usuario ya está asignado a este curso'
                });
            }
        }

        const cursosDB = await Curso.find({ _id: { $in: cursos } });

        if (cursosDB.length !== cursos.length) {
            return res.status(400).json({
                msg: 'Uno o más cursos no existen en la DB'
            });
        }

        const cursosUsuario = await Curso.find({
            usuario: usuario,
            _id: { $nin: cursos }
        });

        if (cursosUsuario.length + cursos.length > 3) {
            return res.status(400).json({
                msg: `No puede ser asignado a más de 3 cursos en total`
            });
        }

        const data = {
            $addToSet: { usuario: usuario }
        }
        await Curso.updateMany({ _id: { $in: cursos } }, data);

        res.json({
            msg: `Los cursos han sido actualizados con éxito`
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error'
        });
    }
}

const postCurso = async (req = request, res = response) => {

    const { nombreCurso } = req.body;
    const cursoGuardado = new Curso({ nombreCurso });

    await cursoGuardado.save();

    res.json({
        msg: 'Post Api - Post Curso',
        cursoGuardado
    });

}

const putCurso = async (req = request, res = response) => {
    const { id } = req.params;
    const { nombreCurso, usuario } = req.body;

    try {
        const curso = await Curso.findById(id);

        curso.nombreCurso = nombreCurso;

        const index = curso.usuario.indexOf(usuario);

        if (usuario) {
            if (index === -1) {
                curso.usuario.addToSet(usuario);
            } else {
                curso.usuario.splice(index, 1);
            }
        }

        const cursoActualizado = await curso.save();

        res.json({
            msg: 'PUT editar curso',
            cursoActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al actualizar el curso'
        });
    }
}

const deleteCurso = async (req = request, res = response) => {
    const { id } = req.params;

    const cursoEliminado = await Curso.findByIdAndUpdate(id, { estado: false, usuario: [] });

    res.json({
        msg: 'DELETE eliminar curso',
        cursoEliminado
    });
}

module.exports = {
    getCursos,
    getCursosAsignados,
    putAsignCursos,
    postCurso,
    putCurso,
    deleteCurso
}
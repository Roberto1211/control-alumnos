const { Router } = require('express');
const { check } = require('express-validator');
const { getCursos, postCurso, putCurso, deleteCurso, putAsignCursos, getCursosAsignados} = require('../controllers/curso');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/mostrar', [
    validarJWT,
],getCursos);

router.get('/mostrar/:id', [
    validarJWT,
    tieneRole('ALUMNO_ROL'),
    validarCampos
],getCursosAsignados);

router.put('/asignar', [
    validarJWT,
    tieneRole('ALUMNO_ROL'),
    check('cursos', 'El curso es obligatorio').not().isEmpty(),
    check('usuario', 'El usuario es obligatorio').not().isEmpty(),
    validarCampos
] ,putAsignCursos);

router.post('/agregar', [
    validarJWT,
    tieneRole('MAESTRO_ROL'),
] ,postCurso);

router.put('/editar/:id', [
    validarJWT,
    tieneRole('MAESTRO_ROL'),
    check('nombreCurso', 'El curso es obligatorio').not().isEmpty(),
] ,putCurso);

router.delete('/eliminar/:id', [
    validarJWT,
    tieneRole('MAESTRO_ROL'),
] ,deleteCurso);

module.exports = router;
const { Router } = require('express');
const { check } = require('express-validator');
const { postCurso, putCurso, deleteCurso, putAsignCursos, getCursosAsignados} = require('../controllers/curso');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/mostrar', [
    check('usuario', 'No es un ID válido').isMongoId(),
    validarCampos
],getCursosAsignados);

router.put('/asignar', [
    validarJWT,
    tieneRole('ALUMNO_ROL'),
    check('cursos', 'No es un ID válido').isMongoId(),
    check('usuario', 'No es un ID válido').isMongoId(),
    validarCampos
] ,putAsignCursos);

router.post('/agregar', [
    validarJWT,
    tieneRole('MAESTRO_ROL'),
] ,postCurso);

router.put('/editar/:id', [
    validarJWT,
    tieneRole('MAESTRO_ROL'),
] ,putCurso);

router.delete('/eliminar/:id', [
    validarJWT,
    tieneRole('MAESTRO_ROL'),
] ,deleteCurso);

module.exports = router;
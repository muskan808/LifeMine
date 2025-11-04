const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/usersController');

router.get('/', ctrl.listUsers);
router.get('/:id', ctrl.getUser);
router.post('/', ctrl.createUser);
router.patch('/:id', ctrl.patchUser);
router.delete('/:id', ctrl.removeUser);

module.exports = router;

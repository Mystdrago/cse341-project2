const express = require('express');
const router = express.Router();

const playerController = require('../controllers/players')

router.get('/', playerController.getAll);

router.get('/:id', playerController.getSingle);

router.post('/', playerController.addPlayer);

router.put('/:id', playerController.updatePlayer);

router.delete('/:id', playerController.removePlayer);

module.exports = router;
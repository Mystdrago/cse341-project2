const express = require('express');
const router = express.Router();

const playerController = require('../controllers/players')

router.get('/', playerController.getAll);

router.get('/:id', playerController.getSingle);

module.exports = router;
const express = require('express');
const router = express.Router();

const monsterController = require('../controllers/monsters')

router.get('/', monsterController.getAll);

router.get('/:id', monsterController.getSingle);

module.exports = router;
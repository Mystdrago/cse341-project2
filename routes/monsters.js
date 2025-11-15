const express = require('express');
const router = express.Router();

const monsterController = require('../controllers/monsters')

router.get('/', monsterController.getAll);

router.get('/:id', monsterController.getSingle);

router.post('/', monsterController.addMonster);

router.put('/:id', monsterController.updateMonster);

router.delete('/:id', monsterController.removeMonster);

module.exports = router;
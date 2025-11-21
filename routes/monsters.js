const express = require('express');
const router = express.Router();

const monsterController = require('../controllers/monsters')
const oauthCheck = require('../middleware/auth');

router.get('/', monsterController.getAll);

router.get('/:id', monsterController.getSingle);

router.post('/', monsterController.addMonster);

router.put('/:id', monsterController.updateMonster);

router.delete('/:id',
    //#swagger.security=[{ "bearerAuth": [] }]
    oauthCheck, 
    monsterController.removeMonster
);

module.exports = router;

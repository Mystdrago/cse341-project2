const express = require('express');
const router = express.Router();

const playerController = require('../controllers/players')
const oauthCheck = require('../middleware/auth');

router.get('/', playerController.getAll);

router.get('/:id', playerController.getSingle);

router.post('/', playerController.addPlayer);

router.put('/:id', playerController.updatePlayer);

router.delete('/:id', 
    //#swagger.security=[{ "bearerAuth": [] }]
    oauthCheck, 
    playerController.removePlayer
);

module.exports = router;
const router = require('express').Router();

router.get('/', (req, res) => {res.send('Hello World');});

router.use('/monsters', require('./monsters'));

router.use('/players', require('./players'));

module.exports = router;

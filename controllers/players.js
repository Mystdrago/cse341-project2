const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    const result = await mongodb.getDatabase().db().collection('players').find();
    result.toArray().then((players) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(players);
    });
};

const getSingle = async (req, res) => {
    const playerId = new ObjectId(String(req.params.id));
    const result = await mongodb.getDatabase().db().collection('players').find({_id: playerId});
    result.toArray().then((players) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(players[0]);
    });
};

module.exports = {
    getAll,
    getSingle
};
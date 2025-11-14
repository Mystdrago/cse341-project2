const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    const result = await mongodb.getDatabase().db().collection('monsters').find();
    result.toArray().then((monsters) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(monsters);
    });
};

const getSingle = async (req, res) => {
    const monsterId = new ObjectId(String(req.params.id));
    const result = await mongodb.getDatabase().db().collection('monsters').find({_id: monsterId});
    result.toArray().then((monsters) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(monsters[0]);
    });
};

module.exports = {
    getAll,
    getSingle
};
const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const validatePlayer = (player) => {
    const requiredFields = ['name', 'level', 'size', 'species', 'types', 'healthPoints', 'staminaPoints', 'attentionPoints', 'luckyPoints'];
    for (const field of requiredFields) {
        if (player[field] === undefined || player[field] === null) {
            return false;
        }
    }
    return true;
};

const getAll = async (req, res) => {
    //#swagger.tags=['players']
    try {
        const result = await mongodb.getDatabase().db().collection('players').find();
        const players = await result.toArray();
        res.status(200).json(players);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getSingle = async (req, res) => {
    //#swagger.tags=['players']
    try {
        const playerId = new ObjectId(String(req.params.id));
        const player = await mongodb.getDatabase().db().collection('players').findOne({ _id: playerId });
        if (!player) return res.status(404).json({ error: 'Player not found' });
        res.status(200).json(player);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addPlayer = async (req, res) => {
    //#swagger.tags=['players']
    try {
        const player = {
            name: req.body.name,
            level: req.body.level,
            size: req.body.size,
            species: req.body.species,
            type: req.body.type,
            healthPoints: req.body.healthPoints,
            staminaPoints: req.body.staminaPoints,
            attentionPoints: req.body.attentionPoints,
            luckyPoints: req.body.luckyPoints
        };

        if (!validatePlayer(player)) {
            return res.status(400).json({ error: 'Invalid player data' });
        }

        const response = await mongodb.getDatabase().db().collection('players').insertOne(player);
        res.status(201).json({ id: response.insertedId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updatePlayer = async (req, res) => {
    //#swagger.tags=['players']
    try {
        const playerId = new ObjectId(String(req.params.id));
        const player = {
            name: req.body.name,
            level: req.body.level,
            size: req.body.size,
            species: req.body.species,
            type: req.body.type,
            healthPoints: req.body.healthPoints,
            staminaPoints: req.body.staminaPoints,
            attentionPoints: req.body.attentionPoints,
            luckyPoints: req.body.luckyPoints
        };

        if (!validatePlayer(player)) {
            return res.status(400).json({ error: 'Invalid player data' });
        }

        const response = await mongodb.getDatabase().db().collection('players').replaceOne({ _id: playerId }, player);
        if (response.modifiedCount > 0) {
            res.status(200).json({ message: 'Player updated' });
        } else {
            res.status(404).json({ error: 'Player not found or no changes made' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const removePlayer = async (req, res) => {
    //#swagger.tags=['players']
    try {
        const playerId = new ObjectId(String(req.params.id));
        const response = await mongodb.getDatabase().db().collection('players').deleteOne({ _id: playerId });
        if (response.deletedCount > 0) {
            res.status(200).json({ message: 'Player deleted' });
        } else {
            res.status(404).json({ error: 'Player not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    addPlayer,
    updatePlayer,
    removePlayer
};

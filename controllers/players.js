const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const validateAllStrings = (data) => {
    const requiredFields = [
        'name',
        'level',
        'size',
        'species',
        'types',
        'healthPoints',
        'staminaPoints',
        'attentionPoints',
        'luckyPoints'
    ];

    for (const field of requiredFields) {
        if (!data[field] || typeof data[field] !== 'string') {
            return `${field} is required and must be a string`;
        }
    }
    return null;
};

const getAll = async (req, res) => {
        //#swagger.tags=['players']
    try {
        const players = await mongodb.getDatabase().db().collection('players').find().toArray();
        res.status(200).json(players);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getSingle = async (req, res) => {
        //#swagger.tags=['players']
    try {
        const playerId = new ObjectId(req.params.id);
        const player = await mongodb.getDatabase().db().collection('players').findOne({_id: playerId});
        if (!player) return res.status(404).json({ error: 'Player not found' });
        res.status(200).json(player);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addPlayer = async (req, res) => {
        //#swagger.tags=['players']
    try {
        const body = req.body || {}; // fallback to empty object
        const error = validateAllStrings(body);
        if (error) return res.status(400).json({ error });

        const response = await mongodb.getDatabase().db().collection('players').insertOne(body);
        if (response.acknowledged) {
            res.status(201).json({ message: 'Player created', id: response.insertedId });
        } else {
            res.status(500).json({ error: 'Failed to add player' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updatePlayer = async (req, res) => {
        //#swagger.tags=['players']
    try {
        const body = req.body || {}; // fallback
        const error = validateAllStrings(body);
        if (error) return res.status(400).json({ error });

        const playerId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('players').replaceOne({_id: playerId}, body);

        if (response.modifiedCount > 0) {
            res.status(200).json({ message: 'Player updated' });
        } else {
            res.status(404).json({ error: 'Player not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const removePlayer = async (req, res) => {
        //#swagger.tags=['players']
    try {
        const playerId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('players').deleteOne({_id: playerId});
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
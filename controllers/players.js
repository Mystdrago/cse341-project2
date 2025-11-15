const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const validateplayer = (data) => {
    if (!data.name || typeof data.name !== 'string') return 'Name is required and must be a String';
    if (!data.level || typeof data.level !== 'string') return 'Level is required and must be a String';
    if (!data.size || typeof data.size !== 'string') return 'Size is required and must be a String';
    if (!data.species || typeof data.species !== 'string') return 'Species is required and must be a String';
    if (!data.types || typeof data.types !== 'string') return 'Types is required and must be a String';
    if (!data.healthPoints || typeof data.healthPoints !== 'string') return 'Health Points is required and must be a String';
    if (!data.staminaPoints || typeof data.staminaPoints !== 'string') return 'Stamina Points is required and must be a String';
    if (!data.attentionPoints || typeof data.attentionPoints !== 'string') return 'Attention Points is required and must be a String';
    if (!data.luckyPoints || typeof data.luckyPoints !== 'string') return 'Lucky Points is required and must be a String';
    return null;
}

const getAll = async (req, res) => {
    //swagger.tags=['players']
    try {
        const players = await mongodb.getDatabase().db().collection('players').find().toArray();
        res.status(200).json(players);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getSingle = async (req, res) => {
    //swagger.tags=['players']
    try {
        const playerId = new ObjectId(req.params.id);
        const player = await mongodb.getDatabase().db().collection('players').findOne({_id: playerId});
        if (!player) return res.status(404).json({ error: 'player not found' });
        res.status(200).json(player);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addPlayer = async (req, res) => {
    //swagger.tags=['players']
    try {
        const error = validateplayer(req.body);
        if (error) return res.status(400).json({ error });

        const player = { ...req.body };
        const response = await mongodb.getDatabase().db().collection('players').insertOne(player);
        if (response.acknowledged) {
            res.status(201).json({ message: 'player created', id: response.insertedId });
        } else {
            res.status(500).json({ error: 'Failed to add player' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updatePlayer = async (req, res) => {
    //swagger.tags=['players']
    try {
        const error = validateplayer(req.body);
        if (error) return res.status(400).json({ error });

        const playerId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('players').replaceOne(
            { _id: playerId },
            { ...req.body }
        );

        if (response.modifiedCount > 0) {
            res.status(200).json({ message: 'player updated' });
        } else {
            res.status(404).json({ error: 'player not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const removePlayer = async (req, res) => {
    //swagger.tags=['players']
    try {
        const playerId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('players').deleteOne({ _id: playerId });
        if (response.deletedCount > 0) {
            res.status(200).json({ message: 'player deleted' });
        } else {
            res.status(404).json({ error: 'player not found' });
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
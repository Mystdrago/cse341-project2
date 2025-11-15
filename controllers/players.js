const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;


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
        const playerId = new ObjectId(String(req.params.id));
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
        const body = req.body || {};
        const response = await mongodb.getDatabase().db().collection('players').insertOne(body);

        const requiredFields = [
            'name', 'level', 'size', 'species', 'types',
            'healthPoints', 'staminaPoints', 'attentionPoints', 'luckyPoints'
        ];

        const errors = requiredFields
            .filter(f => !(f in body))
            .map(f => `${f} is required`);

        if (errors.length > 0) {
            await mongodb.getDatabase().db().collection('players').deleteOne({_id: response.insertedId});
            return res.status(400).json({ error: errors.join(', ') });
        }

        res.status(201).json({ message: 'Player created', id: response.insertedId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updatePlayer = async (req, res) => {
        //#swagger.tags=['players']
    try {
        const body = req.body || {};
        const playerId = new ObjectId(String(req.params.id));

        const response = await mongodb.getDatabase().db().collection('players').replaceOne({_id: playerId}, body);

        const requiredFields = [
            'name', 'level', 'size', 'species', 'types',
            'healthPoints', 'staminaPoints', 'attentionPoints', 'luckyPoints'
        ];

        const errors = requiredFields
            .filter(f => !(f in body))
            .map(f => `${f} is required`);

        if (errors.length > 0) {
            return res.status(400).json({ error: errors.join(', ') });
        }

        if (response.modifiedCount === 0) return res.status(404).json({ error: 'Player not found' });

        res.status(200).json({ message: 'Player updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const removePlayer = async (req, res) => {
        //#swagger.tags=['players']
    try {
        const playerId = new ObjectId(String(req.params.id));
        const response = await mongodb.getDatabase().db().collection('players').deleteOne({_id: playerId});
        if (response.deletedCount === 0) return res.status(404).json({ error: 'Player not found' });
        res.status(200).json({ message: 'Player deleted' });
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

const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const validateAllStrings = (data) => {
    const requiredFields = [
        'name',
        'level',
        'size',
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
        //#swagger.tags=['monsters']
    try {
        const monsters = await mongodb.getDatabase().db().collection('monsters').find().toArray();
        res.status(200).json(monsters);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getSingle = async (req, res) => {
        //#swagger.tags=['monsters']
    try {
        const monsterId = new ObjectId(req.params.id);
        const monster = await mongodb.getDatabase().db().collection('monsters').findOne({_id: monsterId});
        if (!monster) return res.status(404).json({ error: 'Monster not found' });
        res.status(200).json(monster);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addMonster = async (req, res) => {
        //#swagger.tags=['monsters']
    try {
        const body = req.body || {}; // fallback to empty object
        const error = validateAllStrings(body);
        if (error) return res.status(400).json({ error });

        const response = await mongodb.getDatabase().db().collection('monsters').insertOne(body);
        if (response.acknowledged) {
            res.status(201).json({ message: 'Monster created', id: response.insertedId });
        } else {
            res.status(500).json({ error: 'Failed to add monster' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateMonster = async (req, res) => {
        //#swagger.tags=['monsters']
    try {
        const body = req.body || {}; // fallback
        const error = validateAllStrings(body);
        if (error) return res.status(400).json({ error });

        const monsterId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('monsters').replaceOne({_id: monsterId}, body);

        if (response.modifiedCount > 0) {
            res.status(200).json({ message: 'Monster updated' });
        } else {
            res.status(404).json({ error: 'Monster not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const removeMonster = async (req, res) => {
        //#swagger.tags=['monsters']
    try {
        const monsterId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('monsters').deleteOne({_id: monsterId});
        if (response.deletedCount > 0) {
            res.status(200).json({ message: 'Monster deleted' });
        } else {
            res.status(404).json({ error: 'Monster not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    addMonster,
    updateMonster,
    removeMonster
};

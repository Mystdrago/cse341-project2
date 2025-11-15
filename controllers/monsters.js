const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const validateMonster = (data) => {
    if (!data.name || typeof data.name !== 'string') return 'Name is required and must be a String';
    if (!data.level || typeof data.level !== 'string') return 'Level is required and must be a String';
    if (!data.size || typeof data.size !== 'string') return 'Size is required and must be a String';
    if (!data.types || typeof data.types !== 'string') return 'Types is required and must be a String';
    if (!data.healthPoints || typeof data.healthPoints !== 'string') return 'Health Points is required and must be a String';
    if (!data.staminaPoints || typeof data.staminaPoints !== 'string') return 'Stamina Points is required and must be a String';
    if (!data.attentionPoints || typeof data.attentionPoints !== 'string') return 'Attention Points is required and must be a String';
    if (!data.luckyPoints || typeof data.luckyPoints !== 'string') return 'Lucky Points is required and must be a String';
    return null;
}

const getAll = async (req, res) => {
    //swagger.tags=['monsters']
    try {
        const monsters = await mongodb.getDatabase().db().collection('monsters').find().toArray();
        res.status(200).json(monsters);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getSingle = async (req, res) => {
    //swagger.tags=['monsters']
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
    //swagger.tags=['monsters']
    try {
        const error = validateMonster(req.body);
        if (error) return res.status(400).json({ error });

        const monster = { ...req.body };
        const response = await mongodb.getDatabase().db().collection('monsters').insertOne(monster);
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
    //swagger.tags=['monsters']
    try {
        const error = validateMonster(req.body);
        if (error) return res.status(400).json({ error });

        const monsterId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('monsters').replaceOne(
            { _id: monsterId },
            { ...req.body }
        );

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
    //swagger.tags=['monsters']
    try {
        const monsterId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('monsters').deleteOne({ _id: monsterId });
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

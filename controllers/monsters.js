const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const validateMonster = (monster) => {
    const requiredFields = ['name', 'level', 'size', 'type', 'healthPoints', 'staminaPoints', 'attentionPoints', 'luckyPoints'];
    for (const field of requiredFields) {
        if (monster[field] === undefined || monster[field] === null) {
            return false;
        }
    }
    return true;
};

const getAll = async (req, res) => {
    //#swagger.tags=['monsters']
    try {
        const result = await mongodb.getDatabase().db().collection('monsters').find();
        const monsters = await result.toArray();
        res.status(200).json(monsters);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getSingle = async (req, res) => {
    //#swagger.tags=['monsters']
    try {
        const monsterId = new ObjectId(String(req.params.id));
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
        const monster = {
            name: req.body.name,
            level: req.body.level,
            size: req.body.size,
            type: req.body.type,
            healthPoints: req.body.healthPoints,
            staminaPoints: req.body.staminaPoints,
            attentionPoints: req.body.attentionPoints,
            luckyPoints: req.body.luckyPoints
        };
        if (!validateMonster(monster)) {
            return res.status(400).json({ error: 'Invalid monster data' });
        }

        const response = await mongodb.getDatabase().db().collection('monsters').insertOne(monster);
        res.status(201).json({ id: response.insertedId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateMonster = async (req, res) => {
    //#swagger.tags=['monsters']
    try {
        const monsterId = new ObjectId(String(req.params.id));
        const monster = {
            name: req.body.name,
            level: req.body.level,
            size: req.body.size,
            type: req.body.type,
            healthPoints: req.body.healthPoints,
            staminaPoints: req.body.staminaPoints,
            attentionPoints: req.body.attentionPoints,
            luckyPoints: req.body.luckyPoints
        };
        if (!validateMonster(monster)) {
            return res.status(400).json({ error: 'Invalid monster data' });
        }

        const response = await mongodb.getDatabase().db().collection('monsters').replaceOne({_id: monsterId}, monster);
        if (response.modifiedCount > 0) {
            res.status(200).json({ message: 'Monster updated' });
        } else {
            res.status(404).json({ error: 'Monster not found or no changes made' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const removeMonster = async (req, res) => {
    //#swagger.tags=['monsters']
    try {
        const monsterId = new ObjectId(String(req.params.id));
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

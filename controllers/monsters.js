const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
console.log('req.body:', req.body);

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
        const body = req.body || {};
        const response = await mongodb.getDatabase().db().collection('monsters').insertOne(body);


        const requiredFields = [
            'name', 'level', 'size', 'type',
            'healthPoints', 'staminaPoints', 'attentionPoints', 'luckyPoints'
        ];

        const errors = requiredFields
            .filter(f => !(f in body))
            .map(f => `${f} is required`);

        if (errors.length > 0) {
            await mongodb.getDatabase().db().collection('monsters').deleteOne({_id: response.insertedId});
            return res.status(400).json({ error: errors.join(', ') });
        }

        res.status(201).json({ message: 'Monster created', id: response.insertedId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const updateMonster = async (req, res) => {
        //#swagger.tags=['monsters']
    try {
        const body = req.body || {};
        const monsterId = new ObjectId(String(req.params.id));

        const response = await mongodb.getDatabase().db().collection('monsters').replaceOne({_id: monsterId}, body);

        const requiredFields = [
            'name', 'level', 'size', 'type',
            'healthPoints', 'staminaPoints', 'attentionPoints', 'luckyPoints'
        ];

        const errors = requiredFields
            .filter(f => !(f in body))
            .map(f => `${f} is required`);

        if (errors.length > 0) {
            return res.status(400).json({ error: errors.join(', ') });
        }

        if (response.modifiedCount === 0) {
            return res.status(404).json({ error: 'Monster not found' });
        }

        res.status(200).json({ message: 'Monster updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const removeMonster = async (req, res) => {
    //#swagger.tags=['monsters']
    try {
        const monsterId = new ObjectId(String(req.params.id));
        const response = await mongodb.getDatabase().db().collection('monsters').deleteOne({_id: monsterId});
        if (response.deletedCount === 0) return res.status(404).json({ error: 'Monster not found' });
        res.status(200).json({ message: 'Monster deleted' });
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

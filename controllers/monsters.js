const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

function validateMonster(body) {
    const requiredFields = [
        "name",
        "level",
        "size",
        "types",
        "healthPoints",
        "staminaPoints",
        "attentionPoints",
        "luckyPoints"
    ];

    for (const field of requiredFields) {
        if (!body[field]) return `${field} is required`;
        if (typeof body[field] !== "string") return `${field} must be a string`;
    }
    return null;
}

const getAll = async (req, res) => {
    //#swagger.tags=['monsters']
    const result = await mongodb.getDatabase().db().collection('monsters').find();
    result.toArray().then((monsters) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(monsters);
    });
};

const getSingle = async (req, res) => {
    //#swagger.tags=['monsters']
    const monsterId = new ObjectId(String(req.params.id));
    const result = await mongodb.getDatabase().db().collection('monsters').find({_id: monsterId});
    result.toArray().then((monsters) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(monsters[0]);
    });
};

const addMonster = async (req, res) => {
  //#swagger.tags=['monsters']
    try {
        const validationError = validateMonster(req.body);
        if (validationError) return res.status(400).json({ error: validationError });

        const response = await mongodb.getDatabase().db().collection('monsters').insertOne(req.body);
        if (response.acknowledged) res.status(201).json({ id: response.insertedId });
        else res.status(500).json({ error: "Failed to add monster" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateMonster = async (req, res) => {
  //#swagger.tags=['monsters']
    try {
        const validationError = validateMonster(req.body);
        if (validationError) return res.status(400).json({ error: validationError });

        const monsterId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('monsters').replaceOne(
            { _id: monsterId },
            req.body
        );

        if (response.modifiedCount > 0) res.status(204).send();
        else res.status(404).json({ error: "Monster not found" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const removeMonster = async (req, res) => {
    //#swagger.tags=['monsters']
  const monsterId = new ObjectId(String(req.params.id));
  const response = await mongodb.getDatabase().db().collection('monsters').deleteOne({_id: monsterId});
    if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occured while removing the monster.')
  }
};

module.exports = {
    getAll,
    getSingle,
    addMonster,
    updateMonster,
    removeMonster
};
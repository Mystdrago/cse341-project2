const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

function validatePlayer(body) {
    const requiredFields = [
        "name",
        "level",
        "size",
        "species",
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
    return null; // valid
}

const getAll = async (req, res) => {
    //#swagger.tags=['players']
    const result = await mongodb.getDatabase().db().collection('players').find();
    result.toArray().then((players) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(players);
    });
};

const getSingle = async (req, res) => {
    //#swagger.tags=['players']
    const playerId = new ObjectId(String(req.params.id));
    const result = await mongodb.getDatabase().db().collection('players').find({_id: playerId});
    result.toArray().then((players) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(players[0]);
    });
};

const addPlayer = async (req, res) => {
    //#swagger.tags=['players']
    try {
        const validationError = validatePlayer(req.body);
        if (validationError) return res.status(400).json({ error: validationError });

        const response = await mongodb.getDatabase().db().collection('players').insertOne(req.body);

        if (response.acknowledged) {
            res.status(201).json({ id: response.insertedId });
        } else {
            res.status(500).json({ error: "Failed to add player" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updatePlayer = async (req, res) => {
  //#swagger.tags=['players']
    try {
        const validationError = validatePlayer(req.body);
        if (validationError) return res.status(400).json({ error: validationError });

        const playerId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('players').replaceOne(
            { _id: playerId },
            req.body
        );

        if (response.modifiedCount > 0) res.status(204).send();
        else res.status(404).json({ error: "player not found" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const removePlayer = async (req, res) => {
    //#swagger.tags=['players']
  const playerId = new ObjectId(String(req.params.id));
  const response = await mongodb.getDatabase().db().collection('players').deleteOne({_id: playerId});
    if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occured while removing the player.')
  }
};

module.exports = {
    getAll,
    getSingle,
    addPlayer,
    updatePlayer,
    removePlayer
};
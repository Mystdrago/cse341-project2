const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

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
    const player = {
        name: req.body.name,
        level: req.body.level,
        size: req.body.size,
        species: req.body.species,
        types: req.body.types,
        healthPoints: req.body.healthPoints,
        staminaPoints: req.body.staminaPoints,
        attentionPoints: req.body.attentionPoints,
        luckyPoints: req.body.luckyPoints
    };
    const response = await mongodb.getDatabase().db().collection('players').insertOne(player);
    if (response.acknowledged) {
    res.status(204).send();
  }
  else {
    res.status(500).json(response.error || 'Some error occured while adding the player.')
  }
};

const updatePlayer = async (req, res) => {
    //#swagger.tags=['players']
  const playerId = new ObjectId(String(req.params.id));
  const player = {
    name: req.body.name,
        level: req.body.level,
        size: req.body.size,
        types: req.body.types,
        healthPoints: req.body.healthPoints,
        staminaPoints: req.body.staminaPoints,
        attentionPoints: req.body.attentionPoints,
        luckyPoints: req.body.luckyPoints
  };
  const response = await mongodb.getDatabase().db().collection('players').replaceOne({_id: playerId}, player);
    if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occured while updating the player.')
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
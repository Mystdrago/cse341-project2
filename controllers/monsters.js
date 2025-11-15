const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

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
    const monster = {
        name: req.body.name,
        level: req.body.level,
        size: req.body.size,
        types: req.body.types,
        healthPoints: req.body.healthPoints,
        staminaPoints: req.body.staminaPoints,
        attentionPoints: req.body.attentionPoints,
        luckyPoints: req.body.luckyPoints
    };
    const response = await mongodb.getDatabase().db().collection('monsters').insertOne(monster);
    if (response.acknowledged) {
    res.status(204).send();
  }
  else {
    res.status(500).json(response.error || 'Some error occured while adding the monster.')
  }
};

const updateMonster = async (req, res) => {
    //#swagger.tags=['monsters']
  const monsterId = new ObjectId(String(req.params.id));
  const monster = {
    name: req.body.name,
        level: req.body.level,
        size: req.body.size,
        types: req.body.types,
        healthPoints: req.body.healthPoints,
        staminaPoints: req.body.staminaPoints,
        attentionPoints: req.body.attentionPoints,
        luckyPoints: req.body.luckyPoints
  };
  const response = await mongodb.getDatabase().db().collection('monsters').replaceOne({_id: monsterId}, monster);
    if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occured while updating the monster.')
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
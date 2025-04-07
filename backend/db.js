const knex = require('knex');
const config = require('./knexfile');

// Crée une instance de Knex
const db = knex(config.development);

// Exporter l'instance de Knex
module.exports = db;

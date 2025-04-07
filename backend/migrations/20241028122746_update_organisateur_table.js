const { table } = require("../db");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('organisateur', (table) => {
    table.string('tel_organisateur', 20).alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('organisateur', (table) =>{
    table.integer('tel_organisateur').alter();
  });
};

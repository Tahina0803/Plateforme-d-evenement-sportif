/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('statistique', (table) => {
        table.increments('id_statistique').primary();
        table.integer('nombre_inscrit').notNullable();
        table.float('taux_participant').notNullable();
        table.integer('nombre_termine_event').notNullable();
        table.integer('id_evenement').unsigned().notNullable();
        table.foreign('id_evenement').references('id_evenement').inTable('evenement');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('statistique');
};

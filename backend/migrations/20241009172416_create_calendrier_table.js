/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('calendrier', (table) => {
        table.increments('id_calendrier').primary();
        table.datetime('date_calendrier').notNullable();
        table.time('heure_calendrier').notNullable();
        table.integer('id_evenement').unsigned().notNullable();
        table.foreign('id_evenement').references('id_evenement').inTable('evenement');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('calendrier');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('poules', (table) => {
        table.increments('id_poule').primary();
        table.integer('id_evenement').unsigned().notNullable();
        table.string('nom_poule', 50).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());

        table.foreign('id_evenement').references('id_evenement').inTable('evenement').onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('poules');
};

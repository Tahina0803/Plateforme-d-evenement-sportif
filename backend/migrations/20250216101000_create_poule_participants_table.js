/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('poule_participants', (table) => {
        table.increments('id').primary();
        table.integer('id_poule').unsigned().notNullable();
        table.integer('id_participant').unsigned().notNullable();

        table.foreign('id_poule').references('id_poule').inTable('poules').onDelete('CASCADE');
        table.foreign('id_participant').references('id_participant').inTable('participants').onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('poule_participants');
};

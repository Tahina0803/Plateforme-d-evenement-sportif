/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('notification', (table) => {
        table.increments('id_notification').primary();
        table.string('contenue_notification', 255).notNullable();
        table.datetime('date_envoi').notNullable();
        table.string('type_notification', 255).notNullable();
        table.integer('id_organisateur').unsigned().notNullable();
        table.integer('id_participant').unsigned().notNullable();
        table.foreign('id_organisateur').references('id_organisateur').inTable('organisateur');
        table.foreign('id_participant').references('id_participant').inTable('participants');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
return knex.schema.dropTable('notification');
};

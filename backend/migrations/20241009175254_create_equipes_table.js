/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('equipes', (table) => {
        table.increments('id_equipe').primary();
        table.string('nom_equipe', 255).notNullable();
        table.string('categorie_equipe', 50).notNullable();
        table.integer('id_participant').unsigned().notNullable();
        table.foreign('id_participant').references('id_participant').inTable('participants').onDelete('CASCADE');
        table.integer('id_evenement').unsigned().notNullable();
        table.foreign('id_evenement').references('id_evenement').inTable('evenement').onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('equipes');
};

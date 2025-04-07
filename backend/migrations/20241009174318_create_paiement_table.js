/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('paiement', (table) => {
        table.increments('id_paiement').primary();
        table.integer('montant').notNullable();
        table.date('date_paiement').notNullable();
        table.string('methode_paiement', 255).notNullable();
        table.string('statu_paiement', 255).notNullable();
        table.integer('id_evenement').unsigned().notNullable();
        table.foreign('id_evenement').references('id_evenement').inTable('evenement');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('paiement');
};

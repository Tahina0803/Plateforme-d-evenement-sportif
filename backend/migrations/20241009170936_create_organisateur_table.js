/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('organisateur', (table) => {
        table.increments('id_organisateur').primary();
        table.string('nom_organisateur', 255).notNullable();
        table.string('prenom_organisateur', 255).notNullable();
        table.string('tel_organisateur', 20).notNullable(); 
        table.string('email_organisateur', 255).notNullable();
        table.string('mdp_organisateur', 255).notNullable();
        table.date('date_inscription').notNullable();

        table.string('reset_code', 255).nullable();
        table.dateTime('reset_code_expiry').nullable();

        // table.integer('id_admin').unsigned().notNullable();
        // table.foreign('id_admin').references('id_admin').inTable('admin');
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('organisateur');
};

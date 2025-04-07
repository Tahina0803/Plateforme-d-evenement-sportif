/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('admin', (table) => {
        table.increments('id_admin').primary();
        table.string('nom_admin', 255).notNullable();
        table.string('prenom_admin', 255).notNullable();
        table.integer('tel_admin').notNullable();
        table.string('email_admin', 255).notNullable();
        table.string('mdp_admin', 255).notNullable();
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('admin');
};

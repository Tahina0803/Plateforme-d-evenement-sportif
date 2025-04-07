/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('joueurs', (table) => {
        table.increments('id_joueur').primary();
        table.string('nom_joueur', 255).notNullable();
        table.string('prenom_joueur', 255).notNullable();
        table.string('date_naissance', 255).notNullable();
        table.string('sexe_joueur', 255).notNullable();
        table.string('email_joueur', 255).notNullable();
        table.integer('tel_joueur').notNullable();
        table.string('poste_joueur', 255).notNullable();
        table.integer('id_equipe').unsigned().notNullable();
        table.foreign('id_equipe').references('id_equipe').inTable('equipes');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('joueurs');
};

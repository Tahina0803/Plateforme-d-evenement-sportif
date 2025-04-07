// /**
//  * @param { import("knex").Knex } knex
//  * @returns { Promise<void> }
//  */
// exports.up = function (knex) {
//     return knex.schema.createTable('participants', (table) => {
//         table.increments('id_participant').primary();
//         table.string('nom_part', 255).notNullable();
//         table.string('email_part', 255).notNullable();
//         table.string('mdp_part', 255).notNullable();
//         table.date('date_naissance_part').notNullable();
//         table.string('genre_part', 50).notNullable();
//         table.integer('telephone_part').notNullable();
//         table.string('ville_part', 255).notNullable();
//         table.string('statut_part', 255).notNullable();
//         table.string('codepostal_part', 255).notNullable();
//         table.date('date_inscription').notNullable();
//         table.integer('id_paiement').unsigned().notNullable();
//         table.integer('id_organisateur').unsigned().notNullable();
//         table.integer('id_admin').unsigned().notNullable();
//         table.foreign('id_paiement').references('id_paiement').inTable('paiement');
//         table.foreign('id_organisateur').references('id_organisateur').inTable('organisateur');
//         table.foreign('id_admin').references('id_admin').inTable('admin');
//     });
// };

// /**
//  * @param { import("knex").Knex } knex
//  * @returns { Promise<void> }
//  */
// exports.down = function (knex) {
//     return knex.schema.dropTable('participants');
// };
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('participants', (table) => {
        table.increments('id_participant').primary();
        table.string('nom_part', 255).notNullable();
        table.string('email_part', 255).notNullable();
        table.string('mdp_part', 255).notNullable();
        table.date('date_naissance_part').nullable(); // Peut être NULL si pas renseigné
        table.string('genre_part', 50).notNullable();
        table.string('telephone_part', 20).notNullable(); // Stocké en string pour éviter les erreurs
        table.string('ville_part', 255).notNullable();
        table.string('statut_part', 255).notNullable();
        table.string('codepostal_part', 255).notNullable();
        table.date('date_inscription').notNullable();
        table.integer('id_paiement').unsigned().nullable(); // Peut être NULL si non payé
        table.integer('id_organisateur').unsigned().notNullable();
        table.integer('id_admin').unsigned().nullable(); // Autoriser NULL pour éviter l'erreur
        table.foreign('id_paiement').references('id_paiement').inTable('paiement').onDelete('SET NULL');
        table.foreign('id_organisateur').references('id_organisateur').inTable('organisateur').onDelete('CASCADE');
        table.foreign('id_admin').references('id_admin').inTable('admin').onDelete('SET NULL'); // Gérer la suppression d'un admin
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('participants');
};

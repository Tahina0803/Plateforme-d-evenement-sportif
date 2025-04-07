// /**
//  * @param { import("knex").Knex } knex
//  * @returns { Promise<void> }
//  */
// exports.up = function (knex) {
//     return knex.schema.createTable('rencontre', (table) => {
//         table.increments('id_rencontre').primary();
//         table.string('participant_a', 255).notNullable();
//         table.string('participant_b', 255).notNullable();
//         table.date('date_rencontre').notNullable();
//         table.time('heure_rencontre').notNullable();
//         table.string('tour_final').notNullable();
//         table.integer('journee', 255).notNullable();
//         table.string('phase', 255).notNullable();
//         table.string('lieu_rencontre', 255).notNullable();
//         table.integer('id_resultat').unsigned().notNullable();
//         table.integer('id_evenement').unsigned().notNullable();
//         table.string('id_calendrier', 50).notNullable();
//         table.foreign('id_resultat').references('id_resultat').inTable('resultat');
//         table.foreign('id_evenement').references('id_evenement').inTable('evenement');
//         table.foreign('id_rencontre').references('id_rencontre').inTable('rencontre');
//     });
// };

// /**
//  * @param { import("knex").Knex } knex
//  * @returns { Promise<void> }
//  */
// exports.down = function (knex) {
//     return knex.schema.dropTable('rencontre');
// };
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('rencontre', (table) => {
        table.increments('id_rencontre').primary();
        table.string('participant_a', 255).notNullable();
        table.string('participant_b', 255).notNullable();
        table.date('date_rencontre').notNullable();
        table.time('heure_rencontre').notNullable();
        table.string('tour_final').nullable();
        table.integer('journee', 255).nullable();
        table.string('phase', 255).notNullable();
        table.string('lieu_rencontre', 255).notNullable();
        table.integer('id_resultat').unsigned().notNullable();
        table.integer('id_evenement').unsigned().notNullable();
        table.integer('id_poule').unsigned().notNullable();
        table.foreign('id_resultat').references('id_resultat').inTable('resultat');
        table.foreign('id_evenement').references('id_evenement').inTable('evenement');
        table.foreign('id_poule').references('id_poule').inTable('poules');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('rencontre');
};

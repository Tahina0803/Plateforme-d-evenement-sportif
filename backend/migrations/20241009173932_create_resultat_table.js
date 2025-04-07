// /**
//  * @param { import("knex").Knex } knex
//  * @returns { Promise<void> }
//  */
// exports.up = function(knex) {
//   return knex.schema.createTable('resultat', (table) =>{
//     table.increments('id_resultat').primary();
//     table.integer('score_A').notNullable();
//     table.integer('score_B').notNullable();
//     table.integer('journee').notNullable();
//     table.integer('point_victoire').notNullable();
//     table.integer('point_matchnul').notNullable();
//     table.integer('point_defaite').notNullable();
//     table.integer('classement_general').notNullable();
//     table.datetime('date_resultat').notNullable();
//     table.integer('id_evenement').unsigned().notNullable();
//     table.string('id_calendrier', 50).notNullable().unique();
//     table.foreign('id_evenement').references('id_evenement').inTable('evenement');
//     table.foreign('id_calendrier').references('id_calendrier').inTable('calendrier');
//   });
// };

// /**
//  * @param { import("knex").Knex } knex
//  * @returns { Promise<void> }
//  */
// exports.down = function(knex) {
//   return knex.schema.dropTable('resultat');
// };
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('resultat', (table) =>{
    table.increments('id_resultat').primary();
    table.integer('score_A').notNullable();
    table.integer('score_B').notNullable();
    table.integer('point_victoire').nullable();
    table.integer('point_matchnul').nullable();
    table.integer('point_defaite').nullable();
    table.integer('classement_general').notNullable();
    table.datetime('date_resultat').notNullable();
    table.integer('id_evenement').unsigned().notNullable();
    table.string('id_calendrier', 50).notNullable();
    table.string('id_rencontre', 50).notNullable();
    table.foreign('id_evenement').references('id_evenement').inTable('evenement');
    table.foreign('id_rencontre').references('id_rencontre').inTable('rencontre');
    table.foreign('id_calendrier').references('id_calendrier').inTable('calendrier');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('resultat');
};

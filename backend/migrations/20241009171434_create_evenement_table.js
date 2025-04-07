// /**
//  * @param { import("knex").Knex } knex
//  * @returns { Promise<void> }
//  */
// exports.up = function(knex) {
//     return knex.schema.createTable('evenement', (table) => {
//         table.increments('id_evenement').primary();
//         table.string('logo_event', 255).notNullable();
//         table.string('nom_event', 255).notNullable();
//         table.string('type_event', 255).notNullable();
//         table.string('nom_sport', 50).notNullable();
//         table.string('lieu_event', 255).notNullable();
//         table.integer('nbr_participant').notNullable();
//         table.string('genre_participant', 50).notNullable();
//         table.date('date_debut').notNullable();
//         table.date('date_fin').notNullable();
//         table.date('date_creationEvent').notNullable();
//         table.string('description_accueil', 500).notNullable();
//         table.string('description_detail', 500).notNullable();
//         table.string('categorie_participant', 255).notNullable();
//         table.double('frais_inscription').notNullable();
//         table.string('statut_event', 11).notNullable();
//         table.integer('id_challenge').unsigned();
//         table.string('images_accueil', 255).notNullable();
//         table.string('images_contenu', 255).notNullable();
//         table.integer('id_organisateur').unsigned().notNullable();
//         table.foreign('id_challenge').references('id_challenge').inTable('challenge');
//         table.foreign('id_organisateur').references('id_organisateur').inTable('organisateur');
//       });
// };

// /**
//  * @param { import("knex").Knex } knex
//  * @returns { Promise<void> }
//  */
// exports.down = function(knex) {
//   return knex.schema.dropTable('evenement');
// };
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('evenement', (table) => {
      table.increments('id_evenement').primary();
      table.string('logo_event', 255).notNullable();
      table.string('nom_event', 255).notNullable();
      table.string('type_event', 255).notNullable();
      table.string('nom_sport', 50).notNullable();
      table.string('lieu_event', 255).notNullable();
      table.integer('nbr_participant').notNullable();
      table.string('genre_participant', 50).notNullable();
      table.date('date_debut').notNullable();
      table.date('date_fin').notNullable();
      table.date('date_creationEvent').notNullable();
      table.string('description_accueil', 500).notNullable();
      table.string('description_detail', 500).notNullable();
      table.string('categorie_participant', 255).notNullable();
      table.double('frais_inscription').notNullable();
      table.string('statut_event', 11).notNullable();
      table.integer('id_challenge').unsigned();
      table.string('images_accueil', 255).notNullable();
      table.string('images_contenu', 255).notNullable();
      table.integer('id_organisateur').unsigned().notNullable();
      
      // Ajout des champs pour les tickets
      table.json('types_tickets').notNullable(); // Stocke les types de tickets (JSON)
      table.integer('nbr_total_tickets').notNullable().defaultTo(0); // Nombre total de tickets

      // Clés étrangères
      table.foreign('id_challenge').references('id_challenge').inTable('challenge');
      table.foreign('id_organisateur').references('id_organisateur').inTable('organisateur');
  });
};

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.down = function(knex) {
return knex.schema.dropTable('evenement');
};

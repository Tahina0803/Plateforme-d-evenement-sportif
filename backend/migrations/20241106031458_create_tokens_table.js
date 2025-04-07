// /**
//  * @param { import("knex").Knex } knex
//  * @returns { Promise<void> }
//  */
// exports.up = function(knex) {
//     return knex.schema.createTable('tokens', (table) => {
//       table.increments('id').primary();
//       table.integer('user_id').unsigned().notNullable();
//       table.string('token').notNullable();
//       table.timestamp('expires_at').notNullable();
      
//       // Foreign key linking `user_id` in `tokens` to `id_organisateur` in `organisateur`
//       table.foreign('user_id').references('id_organisateur').inTable('organisateur').onDelete('CASCADE');
//     });
//   };
  
//   /**
//    * @param { import("knex").Knex } knex
//    * @returns { Promise<void> }
//    */
//   exports.down = function(knex) {
//     return knex.schema.dropTableIfExists('tokens');
//   };
  /**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('tokens', (table) => {
    table.increments('id').primary();
    table.string('token').notNullable();
    table.timestamp('expires_at').notNullable();

    // Colonnes pour stocker temporairement les informations de l'utilisateur
    table.string('email').notNullable();
    table.string('nom_organisateur').notNullable();
    table.string('prenom_organisateur').notNullable();
    table.string('tel_organisateur').notNullable();
    table.string('mdp_organisateur').notNullable();

    // Facultatif : si vous voulez lier à l'utilisateur une fois créé, sinon, vous pouvez enlever cette clé étrangère
    table.integer('user_id').unsigned().nullable();
    table.foreign('user_id').references('id_organisateur').inTable('organisateur').onDelete('CASCADE');
  });
};

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('tokens');
};

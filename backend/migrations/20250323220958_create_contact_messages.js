/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('contact_messages', function(table) {
      table.increments('id').primary(); // clé primaire auto-incrémentée
      table.string('name', 255).notNullable(); // nom de l'utilisateur
      table.string('email', 255).notNullable(); // email de l'utilisateur
      table.string('subject', 255).notNullable(); // sujet du message
      table.text('message').notNullable(); // contenu du message
      table.timestamp('created_at').defaultTo(knex.fn.now()); // date d'envoi
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('contact_messages');
  };
  

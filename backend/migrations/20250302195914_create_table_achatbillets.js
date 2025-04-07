/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('achatbillets', function(table) {
      table.increments('id').primary();
      table.string('nom_organisateur', 255).notNullable();
      table.string('nom_evenement', 255).notNullable();
      table.string('type_ticket', 255).notNullable();
      table.integer('quantite').notNullable();
      table.decimal('prix_unitaire', 10, 2).notNullable();
      table.integer('total_billets_vendus').defaultTo(0);
      table.decimal('montant_collecte', 10, 2).defaultTo(0);
      table.decimal('montant_a_transferer', 10, 2).defaultTo(0);
      table.enu('status_paiement', ['en_attente', 'payé', 'annulé']).defaultTo('en_attente');
      table.string('acheteur', 15).notNullable();
      table.timestamp('date_achat').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('achatbillets');
  };
  



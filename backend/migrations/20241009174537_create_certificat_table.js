/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("certificat", (table) => {
    table.increments("id_certificat").primary();
    table.string("type_certificat", 255).notNullable();
    table.string("nom_titulaire", 255).notNullable();
    table.date("date_certificat").notNullable();
    table.string("url_certificat", 255).notNullable();
    table.integer("id_admin").unsigned().notNullable();
    table.foreign("id_admin").references("id_admin").inTable("admin");
    // table.integer('id_evenement').unsigned().notNullable().after('id_participant');
    table.integer("id_evenement").unsigned().notNullable();
    table
      .foreign("id_evenement")
      .references("id_evenement")
      .inTable("evenement"); // Clé étrangère pour assurer l'intégrité

    // 🚀 Ajout des nouvelles colonnes nécessaires
    table.integer("id_participant").unsigned().notNullable(); // Ajout de la colonne manquante
    table
      .foreign("id_participant")
      .references("id_participant")
      .inTable("participant"); // Ajout de la clé étrangère

    table.timestamp("date_distribution").defaultTo(knex.fn.now()); // Date de distribution
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("certificat");
};

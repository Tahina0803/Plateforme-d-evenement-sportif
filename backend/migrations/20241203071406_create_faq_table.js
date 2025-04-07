/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('faq', function(table) {
        table.increments('id').primary();        // ID unique de la FAQ
        table.string('question').notNullable();  // La question de la FAQ
        table.text('answer').notNullable();      // La réponse à la FAQ
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('faq');
};

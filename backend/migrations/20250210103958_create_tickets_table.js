/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('tickets', function(table) {
        table.increments("id").primary();
        table.integer("event_id").unsigned().notNullable();
        table.string("ticket_type").notNullable();
        table.decimal("price", 10, 2).notNullable();
        table.integer("quantity").notNullable();
        table.timestamp("purchase_date").defaultTo(knex.fn.now());

        // Clés étrangères
        table.foreign("event_id").references("id").inTable("events").onDelete("CASCADE");
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('tickets');
};


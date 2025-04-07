/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('participer', (table) => {
        table.integer('id_participant').unsigned().notNullable();
        table.integer('id_evenement').unsigned().notNullable();
        table.primary(['id_participant', 'id_evenement']);

        // Ajout de ON DELETE CASCADE
        table.foreign('id_participant')
            .references('id_participant')
            .inTable('participants')
            .onDelete('CASCADE');

        table.foreign('id_evenement')
            .references('id_evenement')
            .inTable('evenement')
            .onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('participer');
};

exports.up = function (knex) {
    return knex.schema.createTable("tables", (table) => {
      table.increments("reservation_id").primary();
      table.string("table_name");
      table.integer("capacity");
      table.integer("reservation");
      table.foreign('reservation').references('reservations.reservation_id');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("tables");
  };
  
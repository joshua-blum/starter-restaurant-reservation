exports.up = function (knex) {
  return knex.schema.table("tables", (table) => {
    table.dropColumn("status");
  });
};

exports.down = function (knex) {
  return knex.schema.table("tables", (table) => {
    table.string("status");
  });
};

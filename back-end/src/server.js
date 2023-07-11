const { PORT = 5001 } = process.env;

const app = require("./app");
const knex = require("./db/connection");

knex.migrate
  .latest()
  .then((migrations) => {
    console.log("migrations", migrations);
    app.listen(5001, listener);
  })
  .catch((error) => {
    console.error(error);
    knex.destroy();
  });

function listener() {
  console.log(`Listening on Port 5001 !`);
}

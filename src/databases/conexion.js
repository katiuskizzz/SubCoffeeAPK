import { createPool } from "mysql2/promise";
/* import dotenv from "dotenv";
 */
/* dotenv.config({ path: "./src/env/.env" }); */

export const pool = createPool({
  host: 'viaduct.proxy.rlwy.net',
  user: 'root',
  password: 'wLyRnZkgvjYsBpkxqVoOzTXKdoyBMwwm',
  port: 26817,
  database: 'railway',
});

pool
  .getConnection()
  .then((connect) => {
    console.log("Conexión a la database coffeeoffer exitosa");
    connect.release();
  })
  .catch((error) => {
    console.log("Conexión a la database fallida " + error);
  });

// export const pool = createPool({
//     host: 'viaduct.proxy.rlwy.net',
//     user: 'root',
//     password: 'wLyRnZkgvjYsBpkxqVoOzTXKdoyBMwwm',
//     port: 26817,
//     database: 'railway'
// })
import mysql from 'mysql2/promise';

async function test() {
  const connection = await mysql.createConnection({
    host: 'tokaido.proxy.rlwy.net',
    user: 'root',
    password: 'JHIpeUOmljsRJidQucjqJNWmCrPAkcEd',
    database: 'railway',
    port: 40899
  });

  const [pago] = await connection.execute('DESCRIBE pago;');
  console.log("Columnas de pago:", pago);

  const [boleta] = await connection.execute('DESCRIBE boleta;');
  console.log("Columnas de boleta:", boleta);

  await connection.end();
}
test();

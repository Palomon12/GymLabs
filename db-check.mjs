import mysql from 'mysql2/promise';

async function test() {
  const connection = await mysql.createConnection({
    host: 'tokaido.proxy.rlwy.net',
    user: 'root',
    password: 'JHIpeUOmljsRJidQucjqJNWmCrPAkcEd',
    database: 'railway',
    port: 40899
  });

  const [personal] = await connection.execute('DESCRIBE personal;');
  console.log("Columnas de personal:", personal);

  const [rol] = await connection.execute('DESCRIBE rol;');
  console.log("Columnas de rol:", rol);

  const [empresa] = await connection.execute('DESCRIBE empresa;');
  console.log("Columnas de empresa:", empresa);
  
  await connection.end();
}
test();

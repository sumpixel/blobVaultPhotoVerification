let postgreSQL_host = '127.0.0.1';
let postgreSQL_database = 'blobvault';
let mongoSQL_host = '192.168.100.93';
let mongoSQL_port = 27017;

if (process.env.NODE_ENV === 'production') {
  postgreSQL_host = '192.168.100.93';
  mongoSQL_host = '192.168.100.93';
} else if (process.env.NODE_ENV === 'staging') {
  postgreSQL_host = '192.168.100.93';
  postgreSQL_database += '_staging';
  mongoSQL_host = '192.168.100.93';
}

export default {
  postgres : {
    host     : postgreSQL_host,
    user     : 'postgres',
    password : 'password',
    database : postgreSQL_database,
    charset  : 'utf8'
  },
  mongo: {
    host: mongoSQL_host,
    port: mongoSQL_port,
    database: 'blobvaultfile',
    user: 'blobvault',
    password: 'password',
    authDatabase: 'blobvaultfile',
  },
  port: 3001,
};

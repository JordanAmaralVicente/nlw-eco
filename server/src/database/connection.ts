import knex from 'knex';

const connection = knex({
    client:'mysql',
    connection:{
        host: 'localhost',
        user:'teste',
        password:'',
        database:'nlw_eco'
    },
    useNullAsDefault: true,
});

export default connection;
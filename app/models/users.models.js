const db = require('../../db/connection');
const comments = require('../../db/data/test-data/comments');

exports.fetchUsers = () => {
    return db.query(`SELECT * FROM users;`).then(({rows}) => {
        return rows;
    })
}
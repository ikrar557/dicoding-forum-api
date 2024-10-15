/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadTableTestHelper = {
    async cleanTable() {
        await pool.query('DELETE FROM threads WHERE 1=1');
    },

    async findThreadById(id) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);

        return result.rows;
    },

    async addThread({
        id = 'thread-557',
        title = 'random thread title',
        body = 'random thread body',
        date = '2024-10-15T11:59:57.000Z',
        owner = 'user-123',
    }){
        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: [id, title, body, date, owner],
        };

        await pool.query(query)

    }
}

module.exports = ThreadTableTestHelper;
/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentTableTestHelper = {
    async cleanTable() {
        await pool.query('DELETE FROM comments WHERE 1=1');
    },

    async getAllCommentsByThreadId(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE thread_id = $1',
            values: [id]
        }

        const result = await pool.query(query);

        return result.rows;
    },

    async findCommentById(id){
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id]
        }

        const result = await pool.query(query);

        return result.rows;
    },

    async NewComment({
        id = 'comment-test2024',
        date = new Date().toISOString(),
        content = 'lorem ipsum dolor sit amet',
        threadId = 'thread-557',
        userId = 'user-123',
        isDeleted = false,
    }){
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
            values: [id, date, content, threadId, userId, isDeleted]
        }

        await pool.query(query);
    },

    async deleteCommentById(id) {
        const query = {
            text: 'UPDATE comments SET is_deleted = true WHERE id = $1',
            values: [id]
        }

        await pool.query(query)
    }
}

module.exports = CommentTableTestHelper;

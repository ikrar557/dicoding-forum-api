/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ReplaysTestTableHelper = {
  async cleanTable() {
    await pool.query('DELETE FROM replays WHERE 1=1');
  },

  async findReplayById(id) {
    const query = {
      text: 'SELECT * FROM replays WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async fetchAllReplaysByThreadId(id) {
    const query = {
      text: `SELECT replays.id, replays.content, replays.date, users.username, replays.is_deleted
      FROM replays
      INNER JOIN comments ON replays.comment_id = comments.id
      INNER JOIN users ON replays.user_id = users.id
      WHERE comments.thread_id = $1
      ORDER BY comments.date, replays.date`,
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async addReplay({
    id = 'replay-data999',
    content = 'random replay',
    date = '2024-10-17T97:49:43.000Z',
    commentId = 'comment-test2024',
    userId = 'user-123',
    isDeleted = false,
  }) {
    const query = {
      text: 'INSERT INTO replays VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, date, commentId, userId, isDeleted],
    };

    await pool.query(query);
  },

  async deleteReplayById(id) {
    const query = {
      text: 'UPDATE replays SET is_deleted = TRUE WHERE id = $1',
      values: [id],
    };

    await pool.query(query);
  },
};

module.exports = ReplaysTestTableHelper;

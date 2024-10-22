/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentLikesTableTestHelper = {
  async addCommentLike({
    id = 'commentlike-123',
    commentId = 'comment-test2024',
    userId = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO commentlikes VALUES($1, $2, $3)',
      values: [id, commentId, userId],
    };

    await pool.query(query);
  },

  async getCommentLikeById(id) {
    const query = {
      text: 'SELECT * FROM commentlikes WHERE id = $1',
      values: [id],
    };

    const { rows } = await pool.query(query);
    return rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM commentlikes WHERE 1=1');
  },
};

module.exports = CommentLikesTableTestHelper;

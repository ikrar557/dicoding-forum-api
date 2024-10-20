const LikesRepository = require('../../Domains/likes/LikesRepository');

class LikesRepositoryPostgres extends LikesRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLikeComment({ userId, commentId }) {
    const id = `commentlike-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO commentlikes VALUES($1, $2, $3) RETURNING id',
      values: [id, commentId, userId],
    };

    await this._pool.query(query);
  }

  async unlikeComment(userId, commentId) {
    const query = {
      text: 'DELETE FROM commentlikes WHERE user_id = $1 AND comment_id = $2',
      values: [userId, commentId],
    };

    return this._pool.query(query);
  }

  async getLikeCommentByCommentId(commentId) {
    const query = {
      text: 'SELECT * FROM commentlikes WHERE comment_id = $1',
      values: [commentId],
    };

    const { rowCount } = await this._pool.query(query);

    return rowCount;
  }

  async verifyCommentIsLiked(userId, commentId) {
    const query = {
      text: 'SELECT * FROM commentlikes WHERE user_id = $1 AND comment_id = $2',
      values: [userId, commentId],
    };

    const { rowCount } = await this._pool.query(query);
    if (rowCount) {
      return true;
    }

    return false;
  }

  async getCommentLikesForEveryComment(comments) {
    const updatedComments = await Promise.all(
      comments.map(async (comment) => {
        const likeCount = await this.getLikeCommentByCommentId(comment.id);
        return { ...comment, likeCount };
      }),
    );

    return updatedComments;
  }
}

module.exports = LikesRepositoryPostgres;

const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentsRepository');
const ThreadRepositoryPostgres = require('./ThreadRepositoryPostgres');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async getAllCommentsByThreadId(id) {
        const query = {
            text: `SELECT comments.id, users.username, comments.date, comments.content, comments.is_deleted
      FROM comments
      INNER JOIN users ON comments.user_id = users.id
      WHERE comments.thread_id = $1
      ORDER BY comments.date ASC`,
            values: [id],
        };

        const result = await this._pool.query(query);

        return result.rows;
    }

    async addComment(newComment) {
        const { content, threadId: thread_id, userId: user_id } = newComment;

        const id = `comment-${this._idGenerator()}`;
        const date = new Date().toISOString();

        const threadRepositoryPostgres = new ThreadRepositoryPostgres(this._pool, this._idGenerator);
        await threadRepositoryPostgres.checkThreadAvailability(thread_id);

        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, user_id',
            values: [id, date, content, thread_id, user_id],
        };

        const result = await this._pool.query(query);

        return new AddedComment({
            id: result.rows[0].id,
            content: result.rows[0].content,
            owner: result.rows[0].user_id,
        });
    }

    async checkCommentOwner(id, userId) {
        const query = {
            text: 'SELECT user_id FROM comments WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        const {user_id: owner} = result.rows[0];

        if (owner !== userId) {
            throw new AuthorizationError('COMMENT_REPOSITORY_POSTGRES.NOT_THE_COMMENT_OWNER');
        }
    }

    async checkCommentIsAvailableInThread(id, threadId) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1 AND thread_id= $2 AND is_deleted = FALSE',
            values: [id, threadId],
        };

        const {rowCount} = await this._pool.query(query);

        if (!rowCount) {
            throw new NotFoundError('COMMENT_REPOSITORY_POSTGRES.COMMENT_NOT_FOUND');
        }
    }

    async deleteCommentById(id) {
        const query = {
            text: 'UPDATE comments SET is_deleted = TRUE WHERE id = $1',
            values: [id],
        }

        const {rowCount} = await this._pool.query(query);
        if (!rowCount) {
            throw new NotFoundError('COMMENT_REPOSITORY_POSTGRES.COMMENT_NOT_FOUND');
        }
    }

}

module.exports = CommentRepositoryPostgres;

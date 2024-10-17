const AddedReplay = require('../../Domains/replays/entities/AddedReplay');
const ReplyRepository = require('../../Domains/replays/ReplayRepository');

const ThreadRepositoryPostgres = require('./ThreadRepositoryPostgres');
const CommentRepositoryPostgres = require('./CommentRepositoryPostgres');

const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplayRepositoryPostgres extends ReplyRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addReplay(newReplay) {
        const { content, commentId: comment_id, userId: user_id, threadId: thread_id } = newReplay;

        const id = `replay-${this._idGenerator()}`
        const date = new Date().toISOString();

        const threadRepositoryPostgres = new ThreadRepositoryPostgres(this._pool, this._idGenerator)
        await threadRepositoryPostgres.checkThreadAvailability(thread_id)

        const commentRepositoryPostgres = new CommentRepositoryPostgres(this._pool, this._idGenerator)
        await commentRepositoryPostgres.checkCommentIsAvailableInThread(comment_id, thread_id)

        const query = {
            text: 'INSERT INTO replays VALUES($1, $2, $3, $4, $5) RETURNING id, content, user_id',
            values: [id, content, date, comment_id, user_id],
        }

        const result = await this._pool.query(query);

        return new AddedReplay({
            id: result.rows[0].id,
            content: result.rows[0].content,
            owner: result.rows[0].user_id,
        });
    }

    async fetchAllReplaysByThreadId(id) {
        const query = {
            text: `SELECT replays.id, replays.content, replays.date, users.username, replays.is_deleted, replays.comment_id
      FROM replays
      INNER JOIN comments ON replays.comment_id = comments.id
      INNER JOIN users ON replays.user_id = users.id
      WHERE comments.thread_id = $1
      ORDER BY comments.date, replays.date`,
            values: [id],
        };

        const result = await this._pool.query(query);

        return result.rows;
    }

    async checkReplayIsExistInComment(replyId, commentId, threadId) {
        const query = {
            text: `SELECT *
      FROM threads
      WHERE id = $1
      `,
            values: [threadId],
        }

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('REPLAY_REPOSITORY_POSTGRES.REPLAY_NOT_FOUND');
        }

        const query2 = {
            text: `SELECT *
      FROM replays
      WHERE id = $1 AND comment_id = $2 AND is_deleted = FALSE
      `,
            values: [replyId, commentId],
        };

        const result2 = await this._pool.query(query2);

        if (!result2.rowCount) {
            throw new NotFoundError('REPLAY_REPOSITORY_POSTGRES.REPLAY_NOT_FOUND');
        }
    }

    async checkReplayOwner(id, userId) {
        const query = {
            text: 'SELECT user_id FROM replays WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        const { user_id: owner } = result.rows[0];

        if( owner !== userId) {
            throw new AuthorizationError('REPLAY_REPOSITORY_POSTGRES.NOT_THE_REPLAY_OWNER');
        }
    }

    async deleteReplayById(id) {
        const query = {
            text: 'UPDATE replays SET is_deleted = TRUE WHERE id = $1',
            values: [id],
        };

        const {rowCount} = await this._pool.query(query);
        if (!rowCount) {
            throw new NotFoundError('REPLAY_REPOSITORY_POSTGRES.REPLAY_NOT_FOUND');
        }
    }
}

module.exports = ReplayRepositoryPostgres;
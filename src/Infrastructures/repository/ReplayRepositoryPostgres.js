const AddedReplay = require('../../Domains/replays/entities/AddedReplay');
const ReplyRepository = require('../../Domains/replays/ReplayRepository');

const ThreadRepositoryPostgres = require('./ThreadRepositoryPostgres');
const CommentRepositoryPostgres = require('./CommentRepositoryPostgres');

const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
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
}

module.exports = ReplyRepositoryPostgres;
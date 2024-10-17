const pool = require('../../database/postgres/pool');

const ReplayRepositoryPostgres = require('../ReplayRepositoryPostgres');

const AddReplay = require('../../../Domains/replays/entities/AddReplay');
const AddedReplay = require('../../../Domains/replays/entities/AddedReplay');

const ReplaysTableTestHelper = require('../../../../tests/ReplaysTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');

const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
    afterEach(async () => {
        await ReplaysTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    beforeEach(async () => {
        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.NewComment({});
    });

    afterAll(async () => {
        await pool.end();
    })

    describe('addReply function', () => {
        it('should save new replays', async () => {
            const newReplay = new AddReplay({
                content: 'random replay',
                commentId: 'comment-test2024',
                userId: 'user-123',
                threadId: 'thread-557',
            })

            const fakeIdGenerator = () => 'data999';
            const replayRepositoryPostgres = new ReplayRepositoryPostgres(pool, fakeIdGenerator);

            await replayRepositoryPostgres.addReplay(newReplay);

            const replays = await ReplaysTableTestHelper.findReplayById('replay-data999');
            expect(replays).toHaveLength(1);
        })

        it('should return added replay correctly', async () => {
            const newReplay = new AddReplay({
                content: 'random replay',
                commentId: 'comment-test2024',
                userId: 'user-123',
                threadId: 'thread-557',
            });

            const fakeIdGenerator = () => 'data999';
            const replyRepositoryPostgres = new ReplayRepositoryPostgres(pool, fakeIdGenerator);

            const addedReply = await replyRepositoryPostgres.addReplay(newReplay);

            expect(addedReply).toStrictEqual(new AddedReplay({
                id: 'replay-data999',
                content: newReplay.content,
                owner: 'user-123',
            }));
        });
    })
})

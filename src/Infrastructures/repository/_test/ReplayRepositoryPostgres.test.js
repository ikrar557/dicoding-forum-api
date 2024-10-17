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

    describe('fetchAllReplaysByThreadId function', () => {
        it('return an empty array when comments had no any replay', async () => {

            const replyRepositoryPostgres = new ReplayRepositoryPostgres(pool, {});
            const result = await replyRepositoryPostgres
                .fetchAllReplaysByThreadId('thread-557');

            expect(result).toStrictEqual([]);
        });

        it('should return an array of replies when comment has replies', async () => {
            const replayRepositoryPostgres = new ReplayRepositoryPostgres(pool, {});

            await ReplaysTableTestHelper.addReplay({
                id: 'reply-test1',
                content: 'random first replay',
                date: '2024-10-17T19:12:43.000Z',
                is_deleted: false,
            });

            await ReplaysTableTestHelper.addReplay({
                id: 'reply-test2',
                content: 'random second replay',
                date: '2024-10-17T19:22:43.000Z',
                is_deleted: false,
            });

            await ReplaysTableTestHelper.addReplay({
                id: 'reply-test3',
                content: 'random third replay',
                date: '2024-10-17T19:32:43.000Z',
                is_deleted: false,
            });

            const result = await replayRepositoryPostgres
                .fetchAllReplaysByThreadId('thread-557');

            expect(result).toStrictEqual([
                {
                    id: 'reply-test1',
                    content: 'random first replay',
                    date: '2024-10-17T19:12:43.000Z',
                    username: 'dicoding',
                    is_deleted: false,
                    comment_id: 'comment-test2024',
                },

                {
                    id: 'reply-test2',
                    content: 'random second replay',
                    date: '2024-10-17T19:22:43.000Z',
                    username: 'dicoding',
                    is_deleted: false,
                    comment_id: 'comment-test2024',
                },
                {
                    id: 'reply-test3',
                    content: 'random third replay',
                    date: '2024-10-17T19:32:43.000Z',
                    username: 'dicoding',
                    is_deleted: false,
                    comment_id: 'comment-test2024',
                },

            ]);
        });
    });
})

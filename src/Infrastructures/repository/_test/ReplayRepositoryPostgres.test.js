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

describe('ReplayRepositoryPostgres', () => {
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

    describe('addReplay function', () => {
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
            const replayRepositoryPostgres = new ReplayRepositoryPostgres(pool, fakeIdGenerator);

            const addedReplay = await replayRepositoryPostgres.addReplay(newReplay);

            expect(addedReplay).toStrictEqual(new AddedReplay({
                id: 'replay-data999',
                content: newReplay.content,
                owner: 'user-123',
            }));
        });
    })

    describe('fetchAllReplaysByThreadId function', () => {
        it('return an empty array when comments had no any replay', async () => {

            const replayRepositoryPostgres = new ReplayRepositoryPostgres(pool, {});
            const result = await replayRepositoryPostgres
                .fetchAllReplaysByThreadId('thread-557');

            expect(result).toStrictEqual([]);
        });

        it('should return an array of replies when comment has replies', async () => {
            const replayRepositoryPostgres = new ReplayRepositoryPostgres(pool, {});

            await ReplaysTableTestHelper.addReplay({
                id: 'replay-test1',
                content: 'random first replay',
                date: '2024-10-17T19:12:43.000Z',
                is_deleted: false,
            });

            await ReplaysTableTestHelper.addReplay({
                id: 'replay-test2',
                content: 'random second replay',
                date: '2024-10-17T19:22:43.000Z',
                is_deleted: false,
            });

            await ReplaysTableTestHelper.addReplay({
                id: 'replay-test3',
                content: 'random third replay',
                date: '2024-10-17T19:32:43.000Z',
                is_deleted: false,
            });

            const result = await replayRepositoryPostgres
                .fetchAllReplaysByThreadId('thread-557');

            expect(result).toStrictEqual([
                {
                    id: 'replay-test1',
                    content: 'random first replay',
                    date: '2024-10-17T19:12:43.000Z',
                    username: 'dicoding',
                    is_deleted: false,
                    comment_id: 'comment-test2024',
                },

                {
                    id: 'replay-test2',
                    content: 'random second replay',
                    date: '2024-10-17T19:22:43.000Z',
                    username: 'dicoding',
                    is_deleted: false,
                    comment_id: 'comment-test2024',
                },
                {
                    id: 'replay-test3',
                    content: 'random third replay',
                    date: '2024-10-17T19:32:43.000Z',
                    username: 'dicoding',
                    is_deleted: false,
                    comment_id: 'comment-test2024',
                },

            ]);
        });
    });

    describe('checkReplayIsExistInComment function', () => {
        it('throw NotFoundError when thread is not found', async () => {
            const replayRepositoryPostgres = new ReplayRepositoryPostgres(pool, {});

            await expect(replayRepositoryPostgres.checkReplayIsExistInComment('replay-data999', 'comment-test2024', 'thread-random123'))
                .rejects.toThrowError(NotFoundError);
        });

        it('throw NotFoundError when comment is not available on found thread', async () => {
            const replayRepositoryPostgres = new ReplayRepositoryPostgres(pool, {});

            await expect(replayRepositoryPostgres.checkReplayIsExistInComment('replay-data999', 'comment-557', 'thread-557'))
                .rejects.toThrowError(NotFoundError);
        });

        it('throw NotFoundError when replay is not available on found comment and thread', async () => {
            await ReplaysTableTestHelper.addReplay({});

            const replayRepositoryPostgres = new ReplayRepositoryPostgres(pool, {});

            await expect(replayRepositoryPostgres.checkReplayIsExistInComment('replay-random123', 'comment-test2024', 'thread-557'))
                .rejects.toThrowError(NotFoundError);
        });

        it('throw NotFoundError when replay is deleted', async () => {
            await ReplaysTableTestHelper.addReplay({ isDeleted: true });
            const replayRepositoryPostgres = new ReplayRepositoryPostgres(pool, {});

            await expect(replayRepositoryPostgres.checkReplayIsExistInComment('replay-data999', 'comment-test2024', 'thread-557'))
                .rejects.toThrowError(NotFoundError);
        });

        it('not throw NotFoundError when replay, thread, and comment are found', async () => {
            await ReplaysTableTestHelper.addReplay({});
            const replayRepositoryPostgres = new ReplayRepositoryPostgres(pool, {});

            await expect(replayRepositoryPostgres.checkReplayIsExistInComment('replay-data999', 'comment-test2024', 'thread-557'))
                .resolves.not.toThrowError(NotFoundError);
        });
    });

    describe('checkReplayOwner function', () => {
        it('throw AuthorizationError when user is not owner of replay', async () => {
            await ReplaysTableTestHelper.addReplay({});

            const replayRepositoryPostgres = new ReplayRepositoryPostgres(pool, {});

            await expect(replayRepositoryPostgres.checkReplayOwner('replay-data999', 'user-random123'))
                .rejects.toThrowError(AuthorizationError);
        });

        it('not throw AuthorizationError when user is owner of replay', async () => {
            await ReplaysTableTestHelper.addReplay({});

            const replayRepositoryPostgres = new ReplayRepositoryPostgres(pool, {});

            await expect(replayRepositoryPostgres.checkReplayOwner('replay-data999', 'user-123'))
                .resolves.not.toThrowError(AuthorizationError);
        });
    });

    describe('deleteReplayById function', () => {
        it('should throw error when replay is not available', async () => {
            const replayRepositoryPostgres = new ReplayRepositoryPostgres(pool, {});

            await expect(replayRepositoryPostgres.deleteReplayById('xxxxx'))
                .rejects.toThrow(NotFoundError);
        });

        it('should delete replay correctly', async () => {
            await ReplaysTableTestHelper.addReplay({});

            const replayRepositoryPostgres = new ReplayRepositoryPostgres(pool, {});

            await expect(replayRepositoryPostgres.deleteReplayById('replay-data999'))
                .resolves.not.toThrowError(NotFoundError);

            const deletedReplay = await ReplaysTableTestHelper.findReplayById('replay-data999');
            expect(deletedReplay).toHaveLength(1);
            expect(deletedReplay[0].is_deleted).toEqual(true);
        });
    });
})

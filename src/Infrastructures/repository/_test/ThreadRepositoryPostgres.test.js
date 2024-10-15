const pool = require('../../database/postgres/pool');

const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');

const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');

const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
    beforeEach(async () => {
        await UsersTableTestHelper.addUser({})
    })

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
    })

    afterAll(async () => {
        await pool.end();
    })

    describe('addThread function', () => {
        it('should persist add thread correctly', async () => {
            const addThread = new AddThread({
                title: 'random thread',
                body: 'random body thread',
                owner: 'user-123'
            })

            const fakeIdGenerator = () => '557';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            await threadRepositoryPostgres.addThread(addThread);

            const threads = await ThreadsTableTestHelper.findThreadById('thread-557')
            expect(threads).toHaveLength(1);
        })

        it('should return added thread correctly', async () => {
            const addThread = new AddThread({
                title: 'random thread',
                body: 'random body thread',
                owner: 'user-123'
            })

            const fakeIdGenerator = () => '557';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            const addedThread = await threadRepositoryPostgres.addThread(addThread);

            expect(addedThread).toStrictEqual(new AddedThread({
                id: 'thread-557',
                title: addThread.title,
                owner: addThread.owner,
            }));
        })
    })

    describe('checkThreadAvailability function', () => {
        it('should throw error NotFoundError when thread is not available', async () => {
            const threadId = 'xxxxxx';

            const fakeIdGenerator = () => '557';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            await expect(threadRepositoryPostgres.checkThreadAvailability(threadId)).rejects.toThrowError(NotFoundError);
        })

        it('should not throw NotFoundError when thread is available', async () => {
            await ThreadsTableTestHelper.addThread({});

            const fakeIdGenerator = () => '557';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            await expect(threadRepositoryPostgres.checkThreadAvailability('thread-557')).resolves.not.toThrowError(NotFoundError);
        });
    })

    describe('getThreadById function', () => {
        it('should throw NotFoundError when thread is not available', async () => {
            await ThreadsTableTestHelper.addThread({});
            const threadId = 'xxxxxx';

            const fakeIdGenerator = () => '557';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            await expect(threadRepositoryPostgres.getThreadById(threadId))
                .rejects.toThrowError(NotFoundError);
        });

        it('should return detail thread correctly when thread is available', async () => {
            await ThreadsTableTestHelper.addThread({});
            // Arrange
            const threadId = 'thread-557';

            // Action
            const fakeIdGenerator = () => '557';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            const thread = await threadRepositoryPostgres.getThreadById(threadId);

            // Action & Assert
            await expect(threadRepositoryPostgres.getThreadById(threadId))
                .resolves.not.toThrowError(NotFoundError);
            expect(thread).toStrictEqual(new DetailThread({
                id: 'thread-557',
                title: 'random thread title',
                body: 'random thread body',
                date: '2024-10-15T11:59:57.000Z',
                username: 'dicoding',
            }));
        });
    })
})
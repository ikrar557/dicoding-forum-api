const pool = require('../../database/postgres/pool');

const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');

const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');

describe('CommentRepositoryPostgres', () => {
    beforeEach(async () => {
        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});
    })

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
    })

    afterAll(async () => {
        await pool.end();
    })

    describe('getAllCommentsByThreadId function', () => {
        it('should return empty array when thread have zero comments', async () => {

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
            const result = await commentRepositoryPostgres
                .getAllCommentsByThreadId('thread-557');

            expect(result).toStrictEqual([]);
        });

        it('should return array of comments when thread have comments', async () => {

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            await CommentsTableTestHelper.NewComment({
                id: 'comment-test2024',
                date: '2024-10-15T07:11:20.125Z',
                content: 'first comment',
                is_deleted: false,
            });

            await CommentsTableTestHelper.NewComment({
                id: 'comment-test2025',
                date: '2024-10-15T07:11:21.125Z',
                content: 'another comment',
                is_deleted: false,
            });

            await CommentsTableTestHelper.NewComment({
                id: 'comment-test2026',
                date: '2024-10-15T07:11:22.125Z',
                content: 'just another comment',
                is_deleted: false,
            });

            const result = await commentRepositoryPostgres
                .getAllCommentsByThreadId('thread-557');

            expect(result).toStrictEqual([
                {
                    id: 'comment-test2024',
                    date: '2024-10-15T07:11:20.125Z',
                    content: 'first comment',
                    username: 'dicoding',
                    is_deleted: false,
                },
                {
                    id: 'comment-test2025',
                    date: '2024-10-15T07:11:21.125Z',
                    content: 'another comment',
                    username: 'dicoding',
                    is_deleted: false,
                },
                {
                    id: 'comment-test2026',
                    date: '2024-10-15T07:11:22.125Z',
                    content: 'just another comment',
                    username: 'dicoding',
                    is_deleted: false,
                },
            ]);
        })
    })

    describe('addComment function', () => {
        it('should persist add comment', async () => {
            const useCasePayload = new AddComment ({
                content: 'lorem ipsum dolor sit amet',
                threadId: 'thread-557',
                userId: 'user-123'
            })

            const fakeIdGenerator = () => 'test2024';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

            await commentRepositoryPostgres.addComment(useCasePayload);

            const comments = await CommentsTableTestHelper.findCommentById('comment-test2024');

            expect(comments).toHaveLength(1);
        })

        it('should return added comment correctly', async () => {
            const newComment = new AddComment({
                content: 'lorem ipsum dolor sit amet',
                threadId: 'thread-557',
                userId: 'user-123'
            })

            const fakeIdGenerator = () => 'test2024';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

            const addedComment = await commentRepositoryPostgres.addComment(newComment);

            expect(addedComment).toStrictEqual(new AddedComment({
                id: 'comment-test2024',
                content: newComment.content,
                owner: newComment.userId
            }))
        })
    })

    describe('checkCommentOwner function', () => {
        it('should throw AuthorizationError when user is not the owner of comment', async () => {
            await CommentsTableTestHelper.NewComment({});

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            await expect(commentRepositoryPostgres.checkCommentOwner('comment-test2024', 'random-user-123'))
                .rejects.toThrowError(AuthorizationError);
        });

        it('should not throw AuthorizationError when user is the owner of comment', async () => {
            await CommentsTableTestHelper.NewComment({});

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            await expect(commentRepositoryPostgres.checkCommentOwner('comment-test2024', 'user-123'))
                .resolves.not.toThrowError(AuthorizationError);
        })
    });

    describe('checkCommentIsAvailableInThread function', () => {
        it('should throw NotFoundError when thread is not available', async () => {
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            await expect(commentRepositoryPostgres.checkCommentIsAvailableInThread('comment-test2024', 'random-thread-123'))
                .rejects.toThrowError(NotFoundError);
        });

        it('should throw NotFoundError when comment is not available in an available thread', async () => {
            await CommentsTableTestHelper.NewComment({});
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            await expect(commentRepositoryPostgres.checkCommentIsAvailableInThread('random-comment-123', 'thread-557'))
                .rejects.toThrowError(NotFoundError);
        });

        it('should throw NotFoundError when comment is deleted', async () => {
            await CommentsTableTestHelper.NewComment({ isDeleted: true });
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            await expect(commentRepositoryPostgres.checkCommentIsAvailableInThread('comment-test2024', 'thread-557'))
                .rejects.toThrowError(NotFoundError);
        });

        it('should not throw NotFoundError when thread and comment are available and is not deleted yet', async () => {
            await CommentsTableTestHelper.NewComment({});
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            await expect(commentRepositoryPostgres.checkCommentIsAvailableInThread('comment-test2024', 'thread-557'))
                .resolves.not.toThrowError(NotFoundError);
        });
    })

    describe('deleteCommentById function', () => {
        it('should throw NotFoundError when comment is not available', async () => {
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            await expect(commentRepositoryPostgres.deleteCommentById('random-comment-123'))
                .rejects.toThrowError(NotFoundError);
        });

        it('should delete comment correctly', async () => {
            await CommentsTableTestHelper.NewComment({});

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            await expect(commentRepositoryPostgres.deleteCommentById('comment-test2024'))
                .resolves.not.toThrowError(NotFoundError)

            const deletedComment = await CommentsTableTestHelper.findCommentById('comment-test2024');
            expect(deletedComment).toHaveLength(1);
            expect(deletedComment[0].is_deleted).toEqual(true);
        });
    });

})

const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');

const LikesRepositoryPostgres = require('../LikesRepositoryPostgres');

const pool = require('../../database/postgres/pool');

describe('LikesRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentTableTestHelper.NewComment({});
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLikeComment', () => {
    it('should add like correctly', async () => {
      const payload = {
        userId: 'user-123',
        threadId: 'thread-557',
        commentId: 'comment-test2024',
      };

      const fakeIdGenerator = () => '123';
      const likesRepositoryPostgres = new LikesRepositoryPostgres(pool, fakeIdGenerator);

      await likesRepositoryPostgres.addLikeComment(payload);

      const likes = await LikesTableTestHelper.getCommentLikeById('commentlike-123');
      expect(likes).toHaveLength(1);
      expect(likes[0].user_id).toBe(payload.userId);
      expect(likes[0].comment_id).toBe(payload.commentId);
    });
  });

  describe('unlikeComment', () => {
    it('should unlike correctly', async () => {
      await LikesTableTestHelper.addCommentLike({});

      const payload = {
        userId: 'user-123',
        commentId: 'comment-test2024',
      };

      const likesRepositoryPostgres = new LikesRepositoryPostgres(pool, {});

      await likesRepositoryPostgres.unlikeComment(payload.userId, payload.commentId);

      const likes = await LikesTableTestHelper.getCommentLikeById('commentlike-123');

      expect(likes).toHaveLength(0);
    });
  });

  describe('verifyCommentIsLiked', () => {
    it('should return true if comment is liked', async () => {
      await LikesTableTestHelper.addCommentLike({});

      const payload = {
        userId: 'user-123',
        commentId: 'comment-test2024',
      };

      const likesRepositoryPostgres = new LikesRepositoryPostgres(pool, {});

      await expect(likesRepositoryPostgres.verifyCommentIsLiked(payload.userId, payload.commentId)).resolves.toEqual(true);
    });

    it('should return false if comment is not liked', async () => {
      const payload = {
        userId: 'user-123',
        commentId: 'comment-test2024',
      };

      const likesRepositoryPostgres = new LikesRepositoryPostgres(pool, {});

      await expect(likesRepositoryPostgres.verifyCommentIsLiked(payload.userId, payload.commentId)).resolves.toEqual(false);
    });
  });

  describe('getLikeCommentByCommentId', () => {
    it('return the number of likes correctly', async () => {
      await LikesTableTestHelper.addCommentLike({});

      const commentId = 'comment-test2024';

      const likesRepositoryPostgres = new LikesRepositoryPostgres(pool, {});

      await expect(likesRepositoryPostgres.getLikeCommentByCommentId(commentId)).resolves.toEqual(1);
    });
  });

  describe('getCommentLikesForEveryComment', () => {
    it('return the number of likes for every comment', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-xxx123', username: 'random-user' });
      await CommentTableTestHelper.NewComment({ id: 'comment-random123' });

      await LikesTableTestHelper.addCommentLike({});
      await LikesTableTestHelper.addCommentLike({ id: 'commentlike-456', userId: 'user-xxx123' });

      const comments = [
        {
          id: 'comment-test2024',
        },
        {
          id: 'comment-random123',
        },
      ];

      const likesRepositoryPostgres = new LikesRepositoryPostgres(pool, {});

      const results = await likesRepositoryPostgres.getCommentLikesForEveryComment(comments);

      expect(results[0].likeCount).toEqual(2);
      expect(results[1].likeCount).toEqual(0);
    });
  });
});

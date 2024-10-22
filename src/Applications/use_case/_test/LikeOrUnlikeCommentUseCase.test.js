const LikesRepository = require('../../../Domains/likes/LikesRepository');
const AddLike = require('../../../Domains/likes/entity/AddLike');

const LikeAndUnlikeCommentUseCase = require('../LikeOrUnlikeCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentsRepository');

describe('LikeCommentUseCase', () => {
  it('should orchestrating the like action correctly', async () => {
    const useCasePayload = {
      userId: 'user-123',
      commentId: 'comment-test2024',
      threadId: 'thread-557',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikesRepository = new LikesRepository();

    mockThreadRepository.checkThreadAvailability = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkCommentIsAvailableInThread = jest.fn(() => Promise.resolve());
    mockLikesRepository.verifyCommentIsLiked = jest.fn(() => Promise.resolve(false));
    mockLikesRepository.addLikeComment = jest.fn(() => Promise.resolve());

    const likeCommentUseCase = new LikeAndUnlikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likesRepository: mockLikesRepository,
    });

    await likeCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.checkThreadAvailability).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkCommentIsAvailableInThread).toBeCalledWith(useCasePayload.commentId, useCasePayload.threadId);

    expect(mockLikesRepository.verifyCommentIsLiked).toBeCalledWith(useCasePayload.userId, useCasePayload.commentId);
    expect(mockLikesRepository.addLikeComment).toBeCalledWith(new AddLike(useCasePayload));
  });

  it('should orchestrating the unlike action correctly', async () => {
    const useCasePayload = {
      userId: 'user-123',
      commentId: 'comment-test2024',
      threadId: 'thread-557',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikesRepository = new LikesRepository();

    mockThreadRepository.checkThreadAvailability = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkCommentIsAvailableInThread = jest.fn(() => Promise.resolve());
    mockLikesRepository.verifyCommentIsLiked = jest.fn(() => Promise.resolve(true));
    mockLikesRepository.unlikeComment = jest.fn(() => Promise.resolve());

    const unlikeCommentUseCase = new LikeAndUnlikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likesRepository: mockLikesRepository,
    });

    await unlikeCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.checkThreadAvailability).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkCommentIsAvailableInThread).toBeCalledWith(useCasePayload.commentId, useCasePayload.threadId);

    expect(mockLikesRepository.verifyCommentIsLiked).toBeCalledWith(useCasePayload.userId, useCasePayload.commentId);
    expect(mockLikesRepository.unlikeComment).toBeCalledWith(useCasePayload.userId, useCasePayload.commentId);
  });
});

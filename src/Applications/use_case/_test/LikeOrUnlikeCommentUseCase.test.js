const LikesRepository = require('../../../Domains/likes/LikesRepository');
const AddLike = require('../../../Domains/likes/entity/AddLike');

const LikeAndUnlikeCommentUseCase = require('../LikeOrUnlikeCommentUseCase');

describe('LikeCommentUseCase', () => {
  it('should orchestrating the like action correctly', async () => {
    const useCasePayload = {
      userId: 'user-123',
      commentId: 'comment-test2024',
      threadId: 'thread-557',
    };

    const mockLikesRepository = new LikesRepository();

    mockLikesRepository.verifyCommentIsLiked = jest.fn(() => Promise.resolve(false));
    mockLikesRepository.addLikeComment = jest.fn(() => Promise.resolve());

    const likeCommentUseCase = new LikeAndUnlikeCommentUseCase({
      likesRepository: mockLikesRepository,
    });

    await likeCommentUseCase.execute(useCasePayload);

    expect(mockLikesRepository.verifyCommentIsLiked).toBeCalledWith(useCasePayload.userId, useCasePayload.commentId);
    expect(mockLikesRepository.addLikeComment).toBeCalledWith(new AddLike(useCasePayload));
  });

  it('should orchestrating the unlike action correctly', async () => {
    const useCasePayload = {
      userId: 'user-123',
      commentId: 'comment-test2024',
      threadId: 'thread-557',
    };

    const mockLikesRepository = new LikesRepository();

    mockLikesRepository.verifyCommentIsLiked = jest.fn(() => Promise.resolve(true));
    mockLikesRepository.unlikeComment = jest.fn(() => Promise.resolve());

    const unlikeCommentUseCase = new LikeAndUnlikeCommentUseCase({
      likesRepository: mockLikesRepository,
    });

    await unlikeCommentUseCase.execute(useCasePayload);

    expect(mockLikesRepository.verifyCommentIsLiked).toBeCalledWith(useCasePayload.userId, useCasePayload.commentId);
    expect(mockLikesRepository.unlikeComment).toBeCalledWith(useCasePayload.userId, useCasePayload.commentId);
  });
});

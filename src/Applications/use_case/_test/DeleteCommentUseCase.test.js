const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentsRepository');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const payload = {
      id: 'comment-test2024',
      threadId: 'thread-557',
      userId: 'user-123',
    };

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.checkCommentOwner = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkCommentIsAvailableInThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    await expect(deleteCommentUseCase.execute(payload))
      .resolves.not.toThrowError();
    expect(mockCommentRepository.checkCommentOwner)
      .toBeCalledWith(payload.id, 'user-123');
    expect(mockCommentRepository.checkCommentIsAvailableInThread)
      .toBeCalledWith(payload.id, 'thread-557');
    expect(mockCommentRepository.deleteCommentById)
      .toBeCalledWith(payload.id);
  });
});

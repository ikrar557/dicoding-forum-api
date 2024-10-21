const DeleteReplayUseCase = require('../DeleteReplayUseCase');

const ReplayRepository = require('../../../Domains/replays/ReplayRepository');

describe('DeleteReplayUseCase', () => {
  it('should orchestrating the delete replay action correctly', async () => {
    const useCasePayload = {
      id: 'replay-data999',
      commentId: 'comment-test2024',
      threadId: 'thread-557',
      userId: 'user-123',
    };

    const mockReplayRepository = new ReplayRepository();

    mockReplayRepository.checkReplayIsExistInComment = jest.fn(() => Promise.resolve());
    mockReplayRepository.checkReplayOwner = jest.fn(() => Promise.resolve());
    mockReplayRepository.deleteReplayById = jest.fn(() => Promise.resolve());


    const deleteReplayUseCase = new DeleteReplayUseCase({
      replayRepository: mockReplayRepository,
    });

    await expect(deleteReplayUseCase.execute(useCasePayload))
      .resolves.not.toThrowError();
    expect(mockReplayRepository.checkReplayIsExistInComment)
      .toBeCalledWith(useCasePayload.id, useCasePayload.commentId, useCasePayload.threadId);
    expect(mockReplayRepository.checkReplayOwner)
      .toBeCalledWith(useCasePayload.id, useCasePayload.userId);
    expect(mockReplayRepository.deleteReplayById)
      .toBeCalledWith(useCasePayload.id);
  });
});

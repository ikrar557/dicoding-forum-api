const AddReplay = require('../../../Domains/replays/entities/AddReplay');
const AddedReplay = require('../../../Domains/replays/entities/AddedReplay');
const ReplayRepository = require('../../../Domains/replays/ReplayRepository');

const AddReplayUseCase = require('../AddReplayUseCase');

describe('AddReplayUseCase', () => {
  it('should orchestrating the add replay action correctly', async () => {
    const useCasePayload = {
      content: 'random replay',
      commentId: 'comment-test2024',
      userId: 'user-123',
      threadId: 'thread-557',
    };

    const mockAddedReplay = new AddedReplay({
      id: 'replay-data999',
      content: 'random replay',
      owner: 'user-123',
    });

    const mockReplayRepository = new ReplayRepository();

    mockReplayRepository.addReplay = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReplay));

    const addReplayUseCase = new AddReplayUseCase({
      replayRepository: mockReplayRepository,
    });

    const addedReplay = await addReplayUseCase.execute(useCasePayload);

    expect(addedReplay).toStrictEqual(new AddedReplay({
      id: 'replay-data999',
      content: useCasePayload.content,
      owner: useCasePayload.userId,
    }));
    expect(mockReplayRepository.addReplay).toBeCalledWith(new AddReplay({
      content: useCasePayload.content,
      commentId: useCasePayload.commentId,
      userId: useCasePayload.userId,
      threadId: useCasePayload.threadId,
    }));
  });
});

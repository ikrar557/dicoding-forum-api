const AddReplay = require('../../../Domains/replays/entities/AddReplay');
const AddedReplay = require('../../../Domains/replays/entities/AddedReplay');
const AddReplayUseCase = require('../AddReplayUseCase');

const ReplayRepository = require('../../../Domains/replays/ReplayRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentsRepository');

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

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplayRepository = new ReplayRepository();

    mockThreadRepository.checkThreadAvailability = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkCommentIsAvailableInThread = jest.fn(() => Promise.resolve());
    mockReplayRepository.addReplay = jest.fn(() => Promise.resolve(mockAddedReplay));


    const addReplayUseCase = new AddReplayUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replayRepository: mockReplayRepository,
    });

    const addedReplay = await addReplayUseCase.execute(useCasePayload);

    expect(addedReplay).toStrictEqual(new AddedReplay({
      id: 'replay-data999',
      content: useCasePayload.content,
      owner: useCasePayload.userId,
    }));

    expect(mockThreadRepository.checkThreadAvailability).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkCommentIsAvailableInThread).toBeCalledWith(useCasePayload.commentId, useCasePayload.threadId);

    expect(mockReplayRepository.addReplay).toBeCalledWith(new AddReplay({
      content: useCasePayload.content,
      commentId: useCasePayload.commentId,
      userId: useCasePayload.userId,
      threadId: useCasePayload.threadId,
    }));
  });
});

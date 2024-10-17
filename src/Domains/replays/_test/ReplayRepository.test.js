const ReplayRepository = require('../ReplayRepository');

describe('ReplayRepository interface', () => {
  it('should throw error when invoke abstract behaviour', async () => {
    const replayRepository = new ReplayRepository();

    await expect(replayRepository.addReplay({}))
      .rejects
      .toThrowError('REPLAY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replayRepository.fetchAllReplaysByThreadId(''))
      .rejects
      .toThrowError('REPLAY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});

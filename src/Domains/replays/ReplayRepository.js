class ReplayRepository {
  async addReplay(newReplay) {
    throw new Error('REPLAY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async fetchAllReplaysByThreadId(id) {
    throw new Error('REPLAY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteReplayById(id) {
    throw new Error('REPLAY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async checkReplayIsExistInComment(replayId, commentId, threadId) {
    throw new Error('REPLAY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async checkReplayOwner(id, userId) {
    throw new Error('REPLAY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ReplayRepository;

class ReplayRepository {
  async addReplay(newReplay) {
    throw new Error('REPLAY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async fetchAllReplaysByThreadId(id) {
    throw new Error('REPLAY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ReplayRepository;

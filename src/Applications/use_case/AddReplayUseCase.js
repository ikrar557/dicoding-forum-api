const AddReplay = require('../../Domains/replays/entities/AddReplay');

class AddReplayUseCase {
  constructor({ replayRepository, threadRepository, commentRepository }) {
    this._replayRepository = replayRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(payload) {
    const { threadId, commentId } = payload;
    await this._threadRepository.checkThreadAvailability(threadId);
    await this._commentRepository.checkCommentIsAvailableInThread(commentId, threadId);

    const newReplay = new AddReplay(payload);
    return this._replayRepository.addReplay(newReplay);
  }
}

module.exports = AddReplayUseCase;

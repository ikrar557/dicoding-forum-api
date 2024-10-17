const DeleteReplay = require('../../Domains/replays/entities/DeleteReplay');

class DeleteReplayUseCase {
  constructor({ replayRepository }) {
    this._replayRepository = replayRepository;
  }

  async execute(payload) {
    const deleteReplay = new DeleteReplay(payload);
    await this._replayRepository.checkReplayIsExistInComment(deleteReplay.id, deleteReplay.commentId, deleteReplay.threadId);
    await this._replayRepository.checkReplayOwner(deleteReplay.id, deleteReplay.userId);
    await this._replayRepository.deleteReplayById(deleteReplay.id);
  }
}

module.exports = DeleteReplayUseCase;

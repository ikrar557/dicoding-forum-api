const AddReplay = require('../../Domains/replays/entities/AddReplay');

class AddReplayUseCase {
  constructor({ replayRepository }) {
    this._replayRepository = replayRepository;
  }

  async execute(payload) {
    const newReplay = new AddReplay(payload);
    return this._replayRepository.addReplay(newReplay);
  }
}

module.exports = AddReplayUseCase;

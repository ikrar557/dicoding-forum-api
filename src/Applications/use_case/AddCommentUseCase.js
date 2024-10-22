const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    const { threadId } = payload;
    await this._threadRepository.checkThreadAvailability(threadId);

    const addComment = new AddComment(payload);
    return this._commentRepository.addComment(addComment);
  }
}

module.exports = AddCommentUseCase;

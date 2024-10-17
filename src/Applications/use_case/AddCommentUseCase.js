const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(payload) {
    const addComment = new AddComment(payload);
    return this._commentRepository.addComment(addComment);
  }
}

module.exports = AddCommentUseCase;

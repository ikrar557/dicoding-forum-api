class DetailThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(id) {
    const thread = await this._threadRepository.getThreadById(id);
    const comments = await this._commentRepository.getAllCommentsByThreadId(id);

    const modifiedComments = comments.map((comment) => {
      if (comment.is_deleted) {
        return {
          ...comment,
          content: '**komentar telah dihapus**',
        };
      }
      return comment;
    });

    return { ...thread, comments: modifiedComments };
  }
}

module.exports = DetailThreadUseCase;

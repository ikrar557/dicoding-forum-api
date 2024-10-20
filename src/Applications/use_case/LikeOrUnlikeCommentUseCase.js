const AddLike = require('../../Domains/likes/entity/AddLike');

class LikeOrUnlikeCommentUseCase {
  constructor({ likesRepository, threadRepository, commentRepository }) {
    this._likesRepository = likesRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(payload) {
    const { threadId, commentId } = payload;

    await this._threadRepository.checkThreadAvailability(threadId);
    await this._commentRepository.checkCommentIsAvailableInThread(commentId, threadId);

    const addCommentLike = new AddLike(payload);

    const isLiked = await this._likesRepository.verifyCommentIsLiked(
      addCommentLike.userId,
      addCommentLike.commentId,
    );

    if (isLiked) {
      return this._likesRepository.unlikeComment(addCommentLike.userId, addCommentLike.commentId);
    }

    return this._likesRepository.addLikeComment(addCommentLike);
  }
}

module.exports = LikeOrUnlikeCommentUseCase;

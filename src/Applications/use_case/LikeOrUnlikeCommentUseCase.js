const AddLike = require('../../Domains/likes/entity/AddLike');

class LikeOrUnlikeCommentUseCase {
  constructor({ likesRepository }) {
    this._likesRepository = likesRepository;
  }

  async execute(payload) {
    const addCommentLike = new AddLike(payload);

    const isLiked = await this._likesRepository.verifyCommentIsLiked(
      addCommentLike.userId,
      addCommentLike.commentId,
    );

    if (isLiked) {
      return await this._likesRepository.unlikeComment(addCommentLike.userId, addCommentLike.commentId);
    }

    return await this._likesRepository.addLikeComment(addCommentLike);
  }
}

module.exports = LikeOrUnlikeCommentUseCase;

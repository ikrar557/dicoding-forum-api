const autoBind = require('auto-bind');
const LikeOrUnlikeCommentUseCase = require('../../../../Applications/use_case/LikeOrUnlikeCommentUseCase');

class CommentLikesHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async putCommentLikeHandler(request, h) {
    const { threadId, commentId } = request.params;
    const payload = {
      userId: request.auth.credentials.id,
      threadId,
      commentId,
    };

    const likeUnlikeCommentUseCase = this._container
      .getInstance(LikeOrUnlikeCommentUseCase.name);

    await likeUnlikeCommentUseCase.execute(payload);

    const response = h.response({
      status: 'success',
    });

    return response;
  }
}

module.exports = CommentLikesHandler;

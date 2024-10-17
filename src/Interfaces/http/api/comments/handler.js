const autoBind = require('auto-bind');

const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postCommentHandler(request, h) {
    const payload = {
      ...request.payload,
      threadId: request.params.threadId,
      userId: request.auth.credentials.id,
    };

    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute(payload);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });

    response.code(201);
    return response;
  }

  async deleteCommentByIdHandler(request, h) {
    const { commentId: id, threadId } = request.params;
    const payload = {
      id,
      threadId,
      userId: request.auth.credentials.id,
    };

    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute(payload);

    const response = h.response({
      status: 'success',
    });

    return response;
  }
}

module.exports = CommentsHandler;

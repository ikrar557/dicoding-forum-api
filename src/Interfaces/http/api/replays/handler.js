const autoBind = require('auto-bind');

const AddReplayUseCase = require('../../../../Applications/use_case/AddReplayUseCase');
const DeleteReplayUseCase = require('../../../../Applications/use_case/DeleteReplayUseCase');

class ReplaysHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postReplayHandler(request, h) {
    const payload = {
      ...request.payload,
      threadId: request.params.threadId,
      commentId: request.params.commentId,
      userId: request.auth.credentials.id,
    };

    const addReplayUseCase = this._container.getInstance(AddReplayUseCase.name);
    const addedReplay = await addReplayUseCase.execute(payload);

    const response = h.response({
      status: 'success',
      data: {
        addedReply: addedReplay,
      },
    });

    response.code(201);
    return response;
  }

  async deleteReplayHandler(request, h) {
    const { replyId: id, commentId, threadId } = request.params;
    const userId = request.auth.credentials.id;
    const payload = {
      id,
      commentId,
      threadId,
      userId,
    };

    const deleteReplayUseCase = this._container.getInstance(DeleteReplayUseCase.name);
    await deleteReplayUseCase.execute(payload);

    const response = h.response({
      status: 'success',
    });

    return response;
  }
}

module.exports = ReplaysHandler;

const autoBind = require('auto-bind');
const AddReplayUseCase = require('../../../../Applications/use_case/AddReplayUseCase');

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
}

module.exports = ReplaysHandler;

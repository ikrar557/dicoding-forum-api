const autoBind = require('auto-bind');
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');

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
}

module.exports = CommentsHandler;

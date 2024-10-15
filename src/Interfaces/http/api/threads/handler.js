const autoBind = require('auto-bind');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');

class ThreadsHandler {
    constructor(container) {
        this._container = container;

        autoBind(this)
    }

    async postThreadHandler(request, h) {
        const payload = {
            ...request.payload,
            owner: request.auth.credentials.id
        }

        const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name)
        const addedThread =  await addThreadUseCase.execute(payload)

        const response = h.response({
            status: 'success',
            data: {
                addedThread
            }
        })

        response.code(201)
        return response;
    }
}

module.exports = ThreadsHandler;
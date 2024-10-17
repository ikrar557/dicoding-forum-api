const {payload} = require("@hapi/hapi/lib/validation");

class DeleteReplay {
    constructor(payload) {
        this._verifyPayload(payload)

        const { id, commentId, threadId, userId } = payload;

        this.id = id;
        this.commentId = commentId;
        this.threadId = threadId;
        this.userId = userId;
    }

    _verifyPayload(payload) {
        const { id, commentId, threadId, userId } = payload;

        if (!id || !commentId || !threadId || !userId) {
            throw new Error('DELETE_REPLAY.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof id !== 'string' || typeof commentId !== 'string' || typeof threadId !== 'string' || typeof userId !== 'string') {
            throw new Error('DELETE_REPLAY.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }


}

module.exports = DeleteReplay;
const DeleteComment  = require('../DeleteComment')

describe('DeleteComment domain entity', () => {

    it('should throw error when payload not contain needed property', () => {
        const payload = {
        }

        expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error when payload not meet data type specification', () => {
        const payload = {
            id: 1291239139,
            threadId: true,
            userId: 'user-123'
        }

        expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should create DeleteComment object correctly', () => {
        const payload = {
            id: 'comment-test2024',
            threadId: 'thread-557',
            userId: 'user-123'
        }

        const deleteComment = new DeleteComment(payload);

        expect(deleteComment.id).toEqual(payload.id);
        expect(deleteComment.threadId).toEqual(payload.threadId);
        expect(deleteComment.userId).toEqual(payload.userId);
    })
})
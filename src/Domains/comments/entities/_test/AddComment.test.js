const AddComment = require('../AddComment')

describe('AddComment domain entity',() => {
    it('should throw error when payload not contain needed property',() => {
        const payload = {
            content: 'lorem ipsum dolor sit amet',
            userId: 'user-123'
        }

        expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error when payload not meet data type specification',() => {
        const payload = {
            content: 'lorem ipsum dolor sit amet',
            threadId: 1291239139,
            userId: true
        }

        expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should create AddComment object correctly',() => {
        const payload = {
            content: 'lorem ipsum dolor sit amet',
            threadId: 'thread-557',
            userId: 'user-123'
        }

        const { content, threadId, userId } = new AddComment(payload);

        // Assert
        expect(content).toEqual(payload.content);
        expect(threadId).toEqual(payload.threadId);
        expect(userId).toEqual(payload.userId);
    })
})
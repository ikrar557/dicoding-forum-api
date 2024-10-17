const DeleteReplay = require('../DeleteReplay');

describe('DeleteReplay entity', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            id: 'replay-data999',
            commentId: 'comment-test2024',
            threadId: 'thread-557',

        };

        expect(() => new DeleteReplay(payload)).toThrowError('DELETE_REPLAY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 3.1423123,
            commentId: 13123,
            threadId: true,
            userId: true,
        };

        expect(() => new DeleteReplay(payload)).toThrowError('DELETE_REPLAY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create deleteReplay object correctly', () => {
        const payload = {
            id: 'replay-data999',
            commentId: 'comment-test2024',
            threadId: 'thread-557',
            userId: 'user-123',
        };

        const deleteReplay = new DeleteReplay(payload);

        expect(deleteReplay.id).toEqual(payload.id);
        expect(deleteReplay.threadId).toEqual(payload.threadId);
        expect(deleteReplay.commentId).toEqual(payload.commentId);
    });
});
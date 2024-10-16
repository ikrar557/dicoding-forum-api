const DetailComment = require('../DetailComment');

describe('detail comment domain entity', () => {
    it('throw error when payload not contain needed property', () => {
        const payload = {
            id: 'comment-test2024',
            username: 'ikrar',
        };

        expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    })

    it('throw error when payload not meet data type specification', () => {
        const payload = {
            id: 'comment-test2024',
            username: 1291239139,
            date: true,
            content: 'lorem ipsum dolor sit amet',
            is_deleted: 'yes'
        };

        expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    })

    it('create DetailComment object correctly', () => {
        const payload = {
            id: 'comment-test2024',
            username: 'ikrar',
            date: '2024-10-15T12:00:00.000Z',
            content: 'lorem ipsum dolor sit amet',
            is_deleted: false
        };

        const detailComment = new DetailComment(payload);

        expect(detailComment.id).toEqual(payload.id);
        expect(detailComment.content).toEqual(payload.content);
        expect(detailComment.username).toEqual(payload.username);
        expect(detailComment.date).toEqual(payload.date);
    })

    it('create DetailComment object and not show content already deleted', () => {
        const payload = {
            id: 'comment-test2024',
            username: 'ikrar',
            date: '2024-10-15T12:00:00.000Z',
            content: 'lorem ipsum dolor sit amet',
            is_deleted: true,
        }

        const detailComment = new DetailComment(payload);

        expect(detailComment.id).toEqual(payload.id)
        expect(detailComment.content).toEqual('**komentar telah dihapus**');
        expect(detailComment.username).toEqual(payload.username);
        expect(detailComment.date).toEqual(payload.date);
    })

})
const DetailReplay = require('../DetailReplay');

describe('DetailReplay entity', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            id: 'replay-test999',
            content: 'random replay',
        };

        expect(() => new DetailReplay(payload)).toThrowError('DETAIL_REPLAY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 'replay-123',
            content: 'random replay',
            date: true,
            username: [],
            is_deleted: 'yes',
        };

        expect(() => new DetailReplay(payload)).toThrowError('DETAIL_REPLAY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create detailReplay object correctly', () => {
        const payload = {
            id: 'replay-data999',
            content: 'random replay',
            date: '2021-08-08T07:59:57.000Z',
            username: 'dicoding',
            is_deleted: false,
        };

        const detailReplay = new DetailReplay(payload);

        expect(detailReplay.id).toEqual(payload.id);
        expect(detailReplay.content).toEqual(payload.content);
        expect(detailReplay.date).toEqual(payload.date);
        expect(detailReplay.username).toEqual(payload.username);
    });

    it('should create detailReplay object correctly and not show deleted content', () => {
        const payload = {
            id: 'replay-test999',
            content: 'random replay',
            date: '2024-10-17T19:54:43.000Z',
            username: 'dicoding',
            is_deleted: true,
        };

        const { id, content, date, username } = new DetailReplay(payload);

        expect(id).toEqual(payload.id);
        expect(content).toEqual('**balasan telah dihapus**');
        expect(date).toEqual(payload.date);
        expect(username).toEqual(payload.username);
    });
});
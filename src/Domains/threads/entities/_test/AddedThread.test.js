const AddedThread = require('../AddedThread')

describe('AddedThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            id: 'random-thread-id',
            title: 'random thread title',
        };

        // Action & Assert
        expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 'random-thread-id',
            title: 12345656,
            owner: true
        }

        expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should create addedThread Object correctly', () => {
        const payload = {
            id: 'random-thread-id',
            title: 'random thread title',
            owner: 'ikrar'
        }

        const addedThread = new AddedThread(payload);

        expect(addedThread.id).toEqual(payload.id)
        expect(addedThread.title).toEqual(payload.title)
        expect(addedThread.owner).toEqual(payload.owner)
    })

})
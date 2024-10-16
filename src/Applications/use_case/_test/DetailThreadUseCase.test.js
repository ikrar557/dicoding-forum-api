const DetailThreadUseCase = require('../DetailThreadUseCase');

const DetailThread = require('../../../Domains/threads/entities/DetailThread')

const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentsRepository');

describe('DetailThreadUseCase', () => {
    it('should orchestrating the detail action correctly', async () => {

        const id = 'thread-557'

        const mockResult = {
            id: 'thread-557',
            title: 'random thread title',
            body: 'random thread body',
            date: '2024-10-16T11:11:15.555Z',
            username: 'dicoding',
            comments: [
                {
                    id: 'comment-test2024',
                    username: 'dicoding',
                    date: '2024-10-16T11:25:30.555Z',
                    content: 'lorem ipsum dolor sit amet',
                },
            ],
        };

        const mockDetailThread = new DetailThread({
            id: 'thread-557',
            title: 'random thread title',
            body: 'random thread body',
            date: '2024-10-16T11:11:15.555Z',
            username: 'dicoding',
        });

        const mockDetailComment = [
            {
                id: 'comment-test2024',
                username: 'dicoding',
                date: '2024-10-16T11:25:30.555Z',
                content: 'lorem ipsum dolor sit amet',
                // is_deleted: false,
            },
        ];

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();


        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve(mockDetailThread));
        mockCommentRepository.getAllCommentsByThreadId = jest.fn()
            .mockImplementation(() => Promise.resolve(mockDetailComment));

        const getThreadUseCase = new DetailThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        })

        const detailThread = await getThreadUseCase.execute(id);

        expect(detailThread).toStrictEqual(mockResult);
        expect(mockThreadRepository.getThreadById)
            .toBeCalledWith(id);
        expect(mockCommentRepository.getAllCommentsByThreadId)
            .toBeCalledWith(id);
    })
})
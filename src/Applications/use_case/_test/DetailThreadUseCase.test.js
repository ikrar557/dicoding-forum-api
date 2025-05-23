const DetailThreadUseCase = require('../DetailThreadUseCase');

const DetailThread = require('../../../Domains/threads/entities/DetailThread');

const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentsRepository');
const ReplayRepository = require('../../../Domains/replays/ReplayRepository');

const AddLike = require('../../../Domains/likes/entity/AddLike');
const LikesRepository = require('../../../Domains/likes/LikesRepository');

describe('DetailThreadUseCase', () => {
  it('orchestrating detail thread action correctly', async () => {
    const id = 'thread-557';

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
          likeCount: 1,
          replies: [
            {
              id: 'reply-data999',
              content: 'random replay',
              date: '2024-10-17T19:14:30.555Z',
              username: 'dicoding',
            },
          ],
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
        is_deleted: false,
      },
    ];

    const mockDetailReplay = [
      {
        id: 'reply-data999',
        content: 'random replay',
        date: '2024-10-17T19:14:30.555Z',
        username: 'dicoding',
        is_deleted: false,
        comment_id: 'comment-test2024',
      },
    ];

    const addLike = new AddLike({
      userId: 'user-123',
      commentId: 'comment-test2024',
      threadId: 'thread-557',
    });

    const mockAddLike = [
      {
        id: 'comment-test2024',
        username: 'dicoding',
        date: '2024-10-16T11:25:30.555Z',
        content: 'lorem ipsum dolor sit amet',
        is_deleted: false,
        likeCount: 1,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplayRepository = new ReplayRepository();
    const mockLikesRepository = new LikesRepository();

    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(mockDetailThread));
    mockCommentRepository.getAllCommentsByThreadId = jest.fn(() => Promise.resolve(mockDetailComment));
    mockLikesRepository.addLikeComment = jest.fn(() => Promise.resolve(addLike));
    mockLikesRepository.getCommentLikesForEveryComment = jest.fn(() => Promise.resolve(mockAddLike));
    mockReplayRepository.fetchAllReplaysByThreadId = jest.fn(() => Promise.resolve(mockDetailReplay));

    const getThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replayRepository: mockReplayRepository,
      likesRepository: mockLikesRepository,
    });

    const detailThread = await getThreadUseCase.execute(id);

    expect(detailThread).toStrictEqual(mockResult);
    expect(mockThreadRepository.getThreadById)
      .toBeCalledWith(id);
    expect(mockCommentRepository.getAllCommentsByThreadId)
      .toBeCalledWith(id);
    expect(mockReplayRepository.fetchAllReplaysByThreadId)
      .toBeCalledWith(id);
  });

  it('not showing comment or replay if deleted and orchestrating detail thread correctly', async () => {
    const id = 'thread-557';

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
          content: '**komentar telah dihapus**',
          likeCount: 1,
          replies: [
            {
              id: 'reply-data999',
              content: '**balasan telah dihapus**',
              date: '2024-10-17T19:14:30.555Z',
              username: 'dicoding',
            },
          ],
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
        is_deleted: true,
      },
    ];

    const mockDetailReplay = [
      {
        id: 'reply-data999',
        content: 'random replay',
        date: '2024-10-17T19:14:30.555Z',
        username: 'dicoding',
        is_deleted: true,
        comment_id: 'comment-test2024',
      },
    ];

    const addLike = new AddLike({
      userId: 'user-123',
      commentId: 'comment-test2024',
      threadId: 'thread-557',
    });

    const mockAddLike = [
      {
        id: 'comment-test2024',
        username: 'dicoding',
        date: '2024-10-16T11:25:30.555Z',
        content: 'lorem ipsum dolor sit amet',
        is_deleted: true,
        likeCount: 1,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplayRepository = new ReplayRepository();
    const mockLikesRepository = new LikesRepository();

    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(mockDetailThread));
    mockCommentRepository.getAllCommentsByThreadId = jest.fn(() => Promise.resolve(mockDetailComment));
    mockLikesRepository.addLikeComment = jest.fn(() => Promise.resolve(addLike));
    mockLikesRepository.getCommentLikesForEveryComment = jest.fn(() => Promise.resolve(mockAddLike));
    mockReplayRepository.fetchAllReplaysByThreadId = jest.fn(() => Promise.resolve(mockDetailReplay));

    const getThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replayRepository: mockReplayRepository,
      likesRepository: mockLikesRepository,
    });

    const detailThread = await getThreadUseCase.execute(id);

    expect(detailThread).toStrictEqual(mockResult);
    expect(mockThreadRepository.getThreadById)
      .toBeCalledWith(id);
    expect(mockCommentRepository.getAllCommentsByThreadId)
      .toBeCalledWith(id);
    expect(mockReplayRepository.fetchAllReplaysByThreadId)
      .toBeCalledWith(id);
  });
});

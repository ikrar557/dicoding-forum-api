const DetailComment = require("../../Domains/comments/entities/DetailComment");
const DetailReplay = require("../../Domains/replays/entities/DetailReplay");

class DetailThreadUseCase {
    constructor({ threadRepository, commentRepository, replayRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replayRepository = replayRepository;
    }

    async execute(id) {
        const thread = await this._threadRepository.getThreadById(id);
        const comments = await this._commentRepository.getAllCommentsByThreadId(id);
        const replays = await this._replayRepository.fetchAllReplaysByThreadId(id);

        const modifiedComments = this._modifyCommentsWithReplies(comments, replays);

        return { ...thread, comments: modifiedComments };
    }

    _modifyCommentsWithReplies(comments, replays) {
        return comments.map(comment => ({
            ...new DetailComment(comment),
            content: this._getModifiedContent(comment, 'comment'),
            replies: this._getModifiedReplies(comment.id, replays),
        }));
    }

    _getModifiedReplies(commentId, replays) {
        return replays
            .filter(replay => replay.comment_id === commentId)
            .map(replay => ({
                ...new DetailReplay(replay),
                content: this._getModifiedContent(replay, 'replay'),
            }));
    }

    _getModifiedContent(item, type) {
        if (item.is_deleted) {
            return type === 'comment' ? '**komentar telah dihapus**' : '**balasan telah dihapus**';
        }
        return item.content;
    }
}

module.exports = DetailThreadUseCase;

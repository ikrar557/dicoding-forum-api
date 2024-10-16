class DetailThreadUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;

    }

    async execute(id) {
        const thread = await this._threadRepository.getThreadById(id);
        const comments = await this._commentRepository.getAllCommentsByThreadId(id);

        return { ...thread, comments};
        // return thread;
    }
}

module.exports = DetailThreadUseCase;
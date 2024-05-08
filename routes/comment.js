const { Router } = require("express");
const { Board, Comment } = require("../models");
const {
    BadRequest,
    Unauthorized,
    Forbidden,
    NotFound,
} = require("../middlewares");

const router = Router({ mergeParams: true });

// 댓글 조회
router.get("/", async (req, res, next) => {
    try {
        const { boardId } = req.params;
        const board = await Board.findOne({ boardId }).lean();
        const comment = await Comment.find({ boardId }).lean();

        if (!board) {
            throw new NotFound("등록된 게시글이 없습니다."); // 404 에러
        }
        if (!comment.length) {
            throw new NotFound("등록된 댓글이 없습니다."); // 404 에러
        }

        res.status(200).json({
            error: null,
            data: comment,
        });
    } catch (e) {
        next(e);
    }
});

// 댓글 작성
router.post("/", async (req, res, next) => {
    try {
        if (!req.session.passport) {
            throw new Unauthorized("로그인 후 이용 가능합니다."); // 401 error
        }

        const nickname = req.session.passport.user.nickname;
        const { boardId } = req.params;
        const { contents } = req.body;

        if (contents.trim().length === 0) {
            throw new BadRequest("내용을 입력하세요."); // 400 에러
        }

        const comment = await Comment.create({
            nickname,
            boardId,
            contents,
        });

        res.status(201).json({
            error: null,
            message: `${nickname}님의 댓글이 작성되었습니다.`,
            data: {
            nickname: comment.nickname,
            boardId: comment.boardId,
            commentId: comment.commentId,
            contents: comment.contents,
            createdAt: comment.createdAt,
            },
        });
    } catch (e) {
        next(e);
    }
});

// 댓글 수정
router.put("/:commentId", async (req, res, next) => {
  try {
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다."); // 401 error
    }

    const nickname = req.session.passport.user.nickname;
    const { boardId, commentId } = req.params;
    const { contents } = req.body;
    const findBoard = await Board.findOne({ boardId }).lean();
    const findComment = await Comment.findOne({ commentId }).lean();

    if (!findBoard) {
        throw new NotFound("등록된 게시글이 없습니다."); // 404 에러
    }
    if (!findComment) {
        throw new NotFound("등록된 댓글이 없습니다."); // 404 에러
    }
    if (nickname !== findComment.nickname) {
      throw new Forbidden("접근할 수 없습니다."); // 403 에러
    }
    if (contents.trim().length === 0) {
      throw new BadRequest("내용을 입력하세요."); // 400 에러
    }

    const comment = await Comment.findOneAndUpdate(
      { boardId, commentId },
      { contents },
      { runValidators: true, new: true }
    ).lean();

    res.status(200).json({
      err: null,
      message: `${nickname}님의 ${commentId}번 댓글이 수정되었습니다.`,
      data: {
        nickname: comment.nickname,
        boardId: comment.boardId,
        commentId: comment.commentId,
        contents: comment.contents,
        createdAt: comment.createdAt,
      },
    });
  } catch (e) {
    next(e);
  }
});

// 댓글 삭제
router.delete("/:commentId", async (req, res, next) => {
  try {
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다."); // 401 error
    }

    const nickname = req.session.passport.user.nickname;
    const { boardId, commentId } = req.params;

    const findBoard = await Board.findOne({ boardId }).lean();
    const findComment = await Comment.findOne({ commentId }).lean();

    if (!findBoard) {
        throw new NotFound("등록된 게시글이 없습니다."); // 404 에러
    }
    if (!findComment) {
        throw new NotFound("등록된 댓글이 없습니다."); // 404 에러
    }
    if (nickname !== findComment.nickname) {
      throw new Forbidden("접근할 수 없습니다."); // 403 에러
    }

    const comment = await Comment.deleteOne({
        nickname,
        boardId,
        commentId,
    }).lean();

    res.status(200).json({
      err: null,
      message: `${nickname}님의 ${commentId}번 댓글을 삭제했습니다.`,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
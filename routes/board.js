const { Router } = require("express");
const { Board, User } = require("../models");
const {
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
} = require("../middlewares");

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const board = await Board.find({}).lean();

    if (!board) {
      throw new NotFound("등록된 게시글을 찾을 수 없습니다."); // 404 에러
    }

    res.status(200).json({
      error: null,
      data: board,
    });
  } catch (e) {
    next(e);
  }
});

router.get("/:boardId", async (req, res) => {
  try {
    const { boardId } = req.params;
    const board = await Board.findOne({ boardId }).lean();

    if (!board) {
      throw new NotFound("해당 게시글이 존재하지 않습니다."); // 404 에러
    }

    res.status(200).json({
      error: null,
      data: board,
    });
  } catch (e) {
    next(e);
  }
});

// 게시글 작성
router.post("/", async (req, res, next) => {
  try {
    
    // 세션 확인(401 error)
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const nickname = req.session.passport.user.nickname;
    const { title, contents } = req.body;

    if (!title || !contents ) {
      throw new BadRequest("입력되지 않은 내용이 있습니다."); // 400 에러
    }
    if (title.replace(/ /g, "") == "") {
      throw new BadRequest("공백은 제목으로 사용 불가능합니다."); // 400 에러
    }
    if (contents.replace(/ /g, "") == "") {
      throw new BadRequest("공백은 내용으로 사용 불가능합니다."); // 400 에러
    }

    const board = await Board.create({
      nickname,
      title,
      contents,
    });

    res.status(201).json({
      error: null,
      message: "게시글이 작성되었습니다.",
      data: {
        nickname: board.nickname,
        boardId: board.boardId,
        title: board.title,
        contents: board.contents,
        createdAt: board.createdAt,
      },
    });

  } catch (e) {
      next(e);
  }
});


// 게시판 수정
router.put("/:boardId", async (req, res, next) => {
  try {
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const boardId = req.params.boardId;
    const { title, contents } = req.body;
    const nickname = req.session.passport.user.nickname;

    if (!title || !contents) {
      throw new BadRequest("입력되지 않은 내용이 있습니다."); // 400 에러
    }
    if (title.replace(/ /g, "") == "") {
      throw new BadRequest("공백은 제목으로 사용 불가능합니다."); // 400 에러
    }
    if (contents.replace(/ /g, "") == "") {
      throw new BadRequest("공백은 내용으로 사용 불가능합니다."); // 400 에러
    }

    const board = await Board.findOneAndUpdate(
      { nickname, boardId },
      { title, contents },
      { runValidators: true, new: true }
    ).lean();

    if (board === null) {
      throw new NotFound(
        "요청하신 유저의 게시글 ID에 자료가 존재하지 않습니다."
      );
    }

    res.status(200).json({
      err: null,
      message: "게시글이 수정되었습니다.",
      data: {
        nickname: board.nickname,
        boardId: board.boardId,
        title: board.title,
        contents: board.contents,
        createdAt: board.createdAt,
      },
    });
  } catch (e) {
    next(e);
  }
});

// 게시글 삭제
router.delete("/:boardId", async (req, res, next) => {
  try {
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const boardId = req.params.boardId;
    const nickname = req.session.passport.user.nickname;

    const board = await Board.findOneAndDelete({
      nickname,
      boardId,
    }).lean();
    if (board === null) {
      throw new NotFound("요청하신 유저의 학력 ID에 자료가 존재하지 않습니다.");
    }

    res.status(200).json({
      err: null,
      message: `${nickname}님의 ${boardId}번 게시글을 삭제했습니다.`,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;

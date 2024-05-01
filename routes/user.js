const { Router } = require("express");
const { User } = require("../models");
const { Unauthorized, NotFound } = require("../middlewares");

const router = Router();

// 네트워크 페이지(사용자 목록)
router.get("/", async (req, res, next) => {
  try {
    // 세션 확인
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }
    // console.log(req.session.passport);

    const users = await User.find({});

    res.status(200).json(users);
  } catch (e) {
    next(e);
  }
});

// 사용자 한 명의 정보 조회
router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    // 세션 확인(401 error)
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const user = await User.findOne({ id });

    // id 확인(404 error)
    if (!user) {
      throw new NotFound("존재하지 않는 id입니다.");
    }

    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
});

// 사용자 정보 수정
router.put("/:id", async (req, res, next) => {
  const id = req.params.id;
  const { name, description } = req.body;
  try {
    // 세션 확인(401 error)
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    // id 확인(404 error)
    const user = await User.findOne({ id });
    if (!user) {
      throw new NotFound("존재하지 않는 id입니다.");
    }

    await User.updateOne({ id }, { name, description });

    res.status(200).send();
  } catch (e) {
    next(e);
  }
});

module.exports = router;

const { Router } = require("express");
const { User, Education } = require("../models");
const {
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  Identification,
} = require("../middlewares");

const router = Router();

// 네트워크 페이지(사용자 목록)
router.get("/", async (req, res, next) => {
  const page = Number(req.query.page || 1); // 현재 페이지
  const perPage = Number(req.query.perPage || 10); // 페이지 당 게시글 수

  try {
    // 세션 확인
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    // 페이지네이션
    const users = await User.find({})
      .sort({ createAt: -1 }) // 최근 순으로 정렬
      .skip(perPage * (page - 1))
      .limit(perPage);
    const total = await User.countDocuments({}); // 총 User 수 세기
    const totalPage = Math.ceil(total / perPage);

    if (!users) {
      res.status(200).json({ message: "사용자가 없습니다." });
      return;
    }

    // password는 빼고 보내기
    let usersData = [];
    for (const user of users) {
      usersData.push({
        id: user.id,
        email: user.email,
        name: user.name,
        description: user.description,
      });
    }

    res.status(200).json({
      error: null,
      totalPage,
      data: usersData,
    });
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
    const education = await Education.find({ id });

    // id 확인(404 error)
    if (!user) {
      throw new NotFound("존재하지 않는 id입니다.");
    }

    if (Identification(req.session, user) === true) {
      // res.redirect("/mypage"); // 본인 id 검색하면 /mypage라는 곳으로 가기
      console.log("내 페이지로 이동");
    }

    // password는 빼고 보내기
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      description: user.description,
    };

    res.status(200).json({
      error: null,
      user: userData,
      education: education,
      certificates: null,
      projects: null,
      awards: null,
    });
  } catch (e) {
    next(e);
  }
});

// 사용자 정보 수정
router.put("/mypage", async (req, res, next) => {
  // const id = req.params.id;
  const { name, description } = req.body;

  try {
    // body validation
    if (!name || !description) {
      throw new BadRequest("입력되지 않은 내용이 있습니다."); // 400 에러
    }
    if (name.replace(/ /g, "") == "") {
      throw new BadRequest("공백은 이름으로 사용 불가능합니다."); // 400 에러
    }
    if (name.trim() !== name) {
      throw new BadRequest("이름 앞뒤에는 띄어쓰기를 사용할 수 없습니다."); // 400 에러
    }

    // 세션 확인(401 error)
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const id = req.session.passport.user.id; // id를 session에 있는 id 값으로

    // id 확인(404 error)
    const user = await User.findOne({ id });
    if (!user) {
      throw new NotFound("존재하지 않는 id입니다.");
    }

    // 본인 확인
    const identification = Identification(req.session, user);
    if (!identification) {
      throw new Forbidden("접근할 수 없습니다.");
    }

    await User.updateOne(
      { id },
      {
        name: name,
        description: description.trim(),
      }
    );

    const newUser = await User.findOne({ id });

    // password는 빼고 보내기
    const userData = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      description: newUser.description,
    };

    res.status(200).json({
      error: null,
      data: userData,
    });
  } catch (e) {
    next(e);
  }
});

router.get("/identification/:id", async (req, res, next) => {
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

    // 본인 확인
    const identification = Identification(req.session, user);
    if (identification === true) {
      res.status(200).json({
        status: identification,
        message: "본인입니다.",
      });
    } else {
      res.status(200).json({
        status: identification,
        message: "본인이 아닙니다.",
      });
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;

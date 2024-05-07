const { Router } = require("express");
const { User, Education, Project, Certificate, Award } = require("../models");
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
    // if (!req.session.passport) {
    //   throw new Unauthorized("로그인 후 이용 가능합니다.");
    // }

    // 페이지네이션
    const users = await User.find({})
      .lean()
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
        userId: user.userId,
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
router.get("/:userId", async (req, res, next) => {
  const userId = req.params.userId;

  try {
    // 세션 확인(401 error)
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const user = await User.findOne({ userId }).lean();
    const education = await Education.find({ userId }).lean();
    const project = await Project.find({ userId }).lean();
    const certificate = await Certificate.find({ userId }).lean();
    const award = await Award.find({ userId }).lean();

    // id 확인(404 error)
    if (!user) {
      throw new NotFound("존재하지 않는 id입니다.");
    }

    const isIdentical = Identification(req.session, user);
    if (isIdentical) {
      // res.redirect("/mypage"); // 본인 id 검색하면 /mypage라는 곳으로 가기
      console.log("내 페이지로 이동");
    }

    // password는 빼고 보내기
    const userData = {
      userId: user.userId,
      email: user.email,
      name: user.name,
      description: user.description,
    };

    res.status(200).json({
      error: null,
      user: userData,
      education: education,
      certificates: certificate,
      projects: project,
      awards: award,
    });
  } catch (e) {
    next(e);
  }
});

// 사용자 정보 수정
router.put("/mypage", async (req, res, next) => {
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

    const userId = req.session.passport.user.userId; // id를 session에 있는 id 값으로

    // 본인 확인
    const user = await User.findOne({ userId }).lean();
    const isIdentical = Identification(req.session, user);
    if (!isIdentical) {
      throw new Forbidden("접근할 수 없습니다.");
    }

    const updateUser = await User.findOneAndUpdate(
      { userId },
      {
        name: name,
        description: description.trim(),
      },
      { runValidators: true, new: true }
    ).lean();

    // password는 빼고 보내기
    const userData = {
      userId: updateUser.userId,
      email: updateUser.email,
      name: updateUser.name,
      description: updateUser.description,
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
  const userId = req.params.userId;

  try {
    // 세션 확인(401 error)
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const user = await User.findOne({ userId }).lean();

    // 본인 확인
    const isIdentical = Identification(req.session, user);
    if (isIdentical) {
      res.status(200).json({
        status: isIdentical,
        message: "본인입니다.",
      });
    } else {
      res.status(200).json({
        status: isIdentical,
        message: "본인이 아닙니다.",
      });
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;

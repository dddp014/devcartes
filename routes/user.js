const { Router } = require("express");
const {
  User,
  Education,
  Project,
  Certificate,
  Award,
  Board,
  Like,
  Skill,
  Comment,
} = require("../models");
const {
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  Conflict,
} = require("../errors");
const { identification } = require("../utils/identification");
const { userSchema } = require("../utils/validation");
const multer = require("multer");
const path = require("path");
const { nanoid } = require("nanoid");

const router = Router();

// 네트워크 페이지(사용자 목록)
router.get("/", async (req, res, next) => {
  const page = Number(req.query.page || 1); // 현재 페이지
  const perPage = Number(req.query.perPage || 10); // 페이지 당 게시글 수
  const { sortName } = req.body; // 정렬할 이름
  let sortProcess = { createdAt: -1 }; // 기본은 최신 순

  try {
    if (sortName === "이름순") {
      sortProcess = { name: 1 };
    } else if (sortName === "이메일순") {
      sortProcess = { email: 1 };
    }

    // 페이지네이션
    const users = await User.find({})
      .lean()
      .sort(sortProcess)
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
        nickname: user.nickname,
        email: user.email,
        name: user.name,
        description: user.description,
        profileImg: user.profileImg,
        position: user.position,
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
    const skill = await Skill.find({ userId }).lean();

    // id 확인(404 error)
    if (!user) {
      throw new NotFound("존재하지 않는 id입니다.");
    }

    const isIdentical = identification(req.session, user);
    if (isIdentical) {
      // res.redirect("/mypage"); // 본인 id 검색하면 /mypage라는 곳으로 가기
      console.log("내 페이지로 이동");
    }

    // password는 빼고 보내기
    const userData = {
      userId: user.userId,
      nickname: user.nickname,
      email: user.email,
      name: user.name,
      description: user.description,
      profileImg: user.profileImg,
      position: user.position,
    };

    res.status(200).json({
      error: null,
      user: userData,
      education: education,
      certificates: certificate,
      projects: project,
      awards: award,
      skills: skill,
    });
  } catch (e) {
    next(e);
  }
});

// 사용자 정보 수정
router.put("/mypage", async (req, res, next) => {
  const { name, nickname, description } = req.body;

  try {
    // 세션 확인(401 error)
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    // Joi validation
    const { error } = userSchema.validate({ name, nickname, description });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      throw new BadRequest(errorMessages[0]); // 400 에러
    }

    const existsNickname = await User.findOne({ nickname }).lean();
    if (
      existsNickname &&
      existsNickname.userId !== req.session.passport.user.userId
    ) {
      throw new Conflict("이미 사용 중인 닉네임입니다.");
    }

    const userId = req.session.passport.user.userId; // id를 session에 있는 id 값으로

    // 본인 확인
    const user = await User.findOne({ userId }).lean();
    const isIdentical = identification(req.session, user);
    if (!isIdentical) {
      throw new Forbidden("접근할 수 없습니다.");
    }

    const updateUser = await User.findOneAndUpdate(
      { userId },
      {
        name: name,
        description: description.trim(),
        nickname: nickname,
      },
      { runValidators: true, new: true }
    ).lean();

    // name session 값 변경
    if (name !== req.session.passport.user.name) {
      req.session.passport.user.name = name;
    }
    // nickname session 값 변경 & Board nickname 변경
    if (nickname !== req.session.passport.user.nickname) {
      const findBoard = await Board.find({
        nickname: req.session.passport.user.nickname,
      }).lean();

      if (findBoard.length !== 0) {
        const updateBoard = await Board.updateMany(
          { nickname: req.session.passport.user.nickname },
          { nickname }
        ).lean();
      }
      // Like nickname 변경
      const findLike = await Like.find({
        fromUser: req.session.passport.user.nickname,
      }).lean();
      if (findLike.length !== 0) {
        await Like.updateMany(
          {
            fromUser: req.session.passport.user.nickname,
          },
          { fromUser: nickname }
        ).lean();
      }
      // comment nickname 변경
      const findComment = await Comment.find({
        nickname: req.session.passport.user.nickname,
      }).lean();
      if (findComment.length !== 0) {
        await Comment.updateMany(
          {
            nickname: req.session.passport.user.nickname,
          },
          { nickname }
        ).lean();
      }

      req.session.passport.user.nickname = nickname; // session 변경
    }

    // password는 빼고 보내기
    const userData = {
      userId: updateUser.userId,
      nickname: updateUser.nickname,
      email: updateUser.email,
      name: updateUser.name,
      description: updateUser.description,
      profileImg: user.profileImg,
      position: user.position,
    };

    res.status(200).json({
      error: null,
      data: userData,
    });
  } catch (e) {
    next(e);
  }
});

router.get("/identification/:userId", async (req, res, next) => {
  const userId = req.params.userId;

  try {
    // 세션 확인(401 error)
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const user = await User.findOne({ userId }).lean();

    // 본인 확인
    const isIdentical = identification(req.session, user);
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

// 프로필 이미지 업로드 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profileImg/");
  },
  filename: function (req, file, cb) {
    cb(null, nanoid() + path.extname(file.originalname));
  },
});

// 파일 형식 검사
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new BadRequest("이미지 파일만 업로드할 수 있습니다."), false);
  }

  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// 프로필 이미지 업로드
router.put(
  "/mypage/profileImg",
  upload.single("profileImg"),
  async (req, res, next) => {
    try {
      // 세션 확인(401 error)
      if (!req.session.passport) {
        throw new Unauthorized("로그인 후 이용 가능합니다.");
      }

      const userId = req.session.passport.user.userId;

      if (!req.file) {
        throw new BadRequest("프로필 이미지가 등록되지 않았습니다."); // 400 에러
      }

      const profileImg = `/${req.file.path}`;

      const user = await User.findOneAndUpdate(
        { userId },
        { profileImg },
        { runValidators: true, new: true }
      ).lean();

      res.status(200).json({
        error: null,
        message: "프로필 이미지가 업로드되었습니다.",
        data: {
          userId: user.userId,
          profileImg: user.profileImg,
        },
      });
    } catch (e) {
      next(e);
    }
  }
);

// position 변경
router.put("/position", async (req, res, next) => {
  try {
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const userId = req.session.passport.user.userId;
    const { changeUserId, changePosition } = req.body;

    if (!changeUserId || !changePosition) {
      throw new BadRequest("입력되지 않은 내용이 있습니다."); // 400 에러
    }

    const findMe = await User.findOne({ userId });
    if (findMe.position !== "admin") {
      throw new Forbidden("권한이 없습니다."); // admin인 사람만 변경 가능함
    }

    const updatePosition = await User.findOneAndUpdate(
      { userId: changeUserId },
      { position: changePosition },
      { runValidators: true, new: true }
    ).lean();

    if (updatePosition === null) {
      throw new NotFound("존재하지 않는 userId 입니다."); // 400 에러
    }

    res.status(200).json({
      error: null,
      message: `${changeUserId}님의 position을 ${changePosition}으로 변경했습니다.`,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;

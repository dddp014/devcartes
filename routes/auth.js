const { Router } = require("express");
const {
  User,
  Education,
  Project,
  Certificate,
  Award,
  Counter,
} = require("../models");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const passport = require("passport");
const { Unauthorized, BadRequest, Conflict } = require("../middlewares");

const router = Router();

// 회원 가입
router.post("/join", async (req, res, next) => {
  try {
    const { email, nickname, name, password, description } = req.body;

    if (!email || !nickname || !name || !password) {
      throw new BadRequest("입력되지 않은 내용이 있습니다."); // 400 에러
    }

    // 같은 이메일로 이미 가입이 되어 있는지 확인
    const existsEmail = await User.findOne({ email }).lean();
    const existsNickname = await User.findOne({ nickname }).lean();

    // 이미 가입된 이메일이나 닉네임이 있으면 상태코드 409, 에러 메시지를 보냄
    if (existsEmail) {
      throw new Conflict("이미 가입된 이메일입니다.");
    }

    if (existsNickname) {
      throw new Conflict("다른 사용자가 닉네임을 사용중입니다.");
    }

    // bcrypt를 사용해서 salting
    const hashedPassword = await bcrypt.hash(password, 10);

    // User를 create하고 결과값을 user에 저장
    const user = await User.create({
      userId: nanoid(10),
      email,
      nickname,
      name,
      password: hashedPassword,
      description,
    });

    res.status(201).json({
      error: null,
      data: {
        userId: user.userId,
        email: user.email,
        nickname: user.nickname,
        name: user.name,
        description: user.description,
      },
    });
  } catch (err) {
    next(err);
  }
});

// 로그인
router.post("/login", passport.authenticate("local"), async (req, res) => {
  res.status(200).json({
    error: null,
    message: "로그인 성공",
    data: req.user,
  });
});

// 로그아웃
router.post("/logout", (req, res, next) => {
  if (!req.isAuthenticated()) {
    throw new Unauthorized("로그인 후 이용 가능합니다.");
  }

  req.logout((err) => {
    if (err) {
      next(err);
    }
    res.status(200).json({
      error: null,
      message: "로그아웃 성공",
    });
  });
});

// 로그인이 되어있는지 확인
router.get("/status", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.json({
      status: false,
      message: "로그인이 되지 않았습니다.",
    });
    return;
  }
  const { email } = req.session.passport.user;
  const user = await User.findOne({ email }).lean();
  res.json({
    status: true,
    message: "로그인이 된 상태입니다.",
    data: {
      userId: user.userId,
      email: user.email,
      nickname: user.nickname,
      name: user.name,
      nickname: user.nickname,
    },
  });
});

// 비밀번호 변경
router.put("/", async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const { userId } = req.session.passport.user;
    const { password, newPassword } = req.body;

    if (!password || !newPassword) {
      throw new BadRequest("입력되지 않은 내용이 있습니다."); // 400 에러
    }

    // 입력받은 비밀번호와 새 비밀번호가 같으면 에러 처리
    if (password === newPassword) {
      throw new Conflict(
        "변경하려는 비밀번호가 지금 사용하고 있는 비밀번호와 같습니다."
      ); // 409 에러
    }

    const user = await User.findOne({ userId }).lean();
    const hashedPassword = user.password;

    // 입력받은 기존 비밀번호가 DB의 암호화된 비밀번호와 일치하는지 확인
    const passwordCorrect = await bcrypt.compare(password, hashedPassword);

    if (!passwordCorrect) {
      throw new Unauthorized("기존 비밀번호가 일치하지 않습니다."); // 401 에러
    }

    // 새 비밀번호를 bcrypt를 사용해서 salting
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // 새 비밀번호를 DB에 저장
    const newUser = await User.findOneAndUpdate(
      { userId },
      { password: newHashedPassword },
      { runValidators: true, new: true }
    ).lean();

    res.status(200).json({
      error: null,
      message: "비밀번호 변경 성공",
    });
  } catch (err) {
    next(err);
  }
});

// 회원 탈퇴
router.delete("/", async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const { userId } = req.session.passport.user;
    const { password } = req.body;

    if (!password) {
      throw new BadRequest("입력되지 않은 내용이 있습니다."); // 400 에러
    }

    const user = await User.findOne({ userId }).lean();
    const hashedPassword = user.password;

    // 입력받은 비밀번호가 DB의 암호화된 비밀번호와 일치하는지 확인
    const passwordCorrect = await bcrypt.compare(password, hashedPassword);

    if (!passwordCorrect) {
      throw new Unauthorized("비밀번호가 일치하지 않습니다."); // 401 에러
    }

    // DB에서 userId가 일치하는 각 MVP 자료들을 찾아서 삭제
    const deleteEducation = await Education.deleteMany({ userId }).lean();
    const deleteProject = await Project.deleteMany({ userId }).lean();
    const deleteCertificate = await Certificate.deleteMany({ userId }).lean();
    const deleteAward = await Award.deleteMany({ userId }).lean();
    const deleteCounter = await Counter.deleteMany({
      "reference_value.userId": userId,
    }).lean();
    const deleteUser = await User.deleteOne({ userId }).lean();

    // DB에서 모든 자료를 다 삭제한 후에 로그아웃해서 세션까지 삭제 완료
    req.logout((err) => {
      if (err) {
        next(err);
      }
      res.status(200).json({
        error: null,
        message: `회원 탈퇴 성공. 총 ${deleteUser.deletedCount}개의 user, ${deleteEducation.deletedCount}개의 학력, ${deleteAward.deletedCount}개의 수상 이력, ${deleteProject.deletedCount}개의 프로젝트, ${deleteCertificate.deletedCount}개의 자격증, ${deleteCounter.deletedCount}개의 카운터 데이터가 삭제되었습니다.`,
      });
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

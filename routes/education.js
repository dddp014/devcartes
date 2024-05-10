const { Router } = require("express");
const { User, Education } = require("../models");
const { BadRequest, Unauthorized, Forbidden, NotFound } = require("../errors");
const { educationSchema } = require("../utils/validation");

const router = Router();

// 학력 정보 조회
router.get("/", async (req, res, next) => {
  try {
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const { userId, name } = req.session.passport.user;
    const education = await Education.find({ userId }).lean();

    if (education.length < 1) {
      throw new NotFound("등록된 학력 정보를 찾을 수 없습니다.");
    }

    res.status(200).json({
      error: null,
      message: `${name}님의 전체 학력 정보 수는 ${education.length}개 입니다.`,
      data: education,
    });
  } catch (e) {
    next(e);
  }
});

// 학력 추가
router.post("/", async (req, res, next) => {
  try {
    // 세션 확인(401 error)
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const userId = req.session.passport.user.userId;
    const { schoolName, major, schoolStatus } = req.body;

    // Joi validation
    const { error } = educationSchema.validate({
      schoolName,
      major,
      schoolStatus,
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      throw new BadRequest(errorMessages[0]); // 400 에러
    }

    const education = await Education.create({
      userId,
      schoolName,
      major,
      schoolStatus,
    });

    res.status(201).json({
      error: null,
      message: "학력 정보가 추가되었습니다.",
      data: {
        userId: education.userId,
        educationId: education.educationId,
        schoolName: education.schoolName,
        major: education.major,
        schoolStatus: education.schoolStatus,
      },
    });
  } catch (e) {
    next(e);
  }
});

// 학력 수정
router.put("/:educationId", async (req, res, next) => {
  try {
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const userId = req.session.passport.user.userId;
    const educationId = req.params.educationId;
    const { schoolName, major, schoolStatus } = req.body;

    // Joi validation
    const { error } = educationSchema.validate({
      schoolName,
      major,
      schoolStatus,
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      throw new BadRequest(errorMessages[0]); // 400 에러
    }

    const validSchoolStatus = ["재학중", "학사졸업", "석사졸업", "박사졸업"];

    if (!validSchoolStatus.includes(schoolStatus)) {
      throw new BadRequest("유효하지 않은 학력입니다.");
    }

    const education = await Education.findOneAndUpdate(
      { userId, educationId },
      { schoolName, major, schoolStatus },
      { runValidators: true, new: true }
    ).lean();

    res.status(200).json({
      error: null,
      message: "학력 정보를 수정했습니다.",
      data: {
        userId: education.userId,
        educationId: education.educationId,
        schoolName: education.schoolName,
        major: education.major,
        schoolStatus: education.schoolStatus,
      },
    });
  } catch (e) {
    next(e);
  }
});

// 학력 삭제
router.delete("/:educationId", async (req, res, next) => {
  try {
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const { userId, name } = req.session.passport.user;
    const educationId = req.params.educationId;

    const education = await Education.findOneAndDelete({
      userId,
      educationId,
    }).lean();
    if (education === null) {
      throw new NotFound("요청하신 유저의 학력 ID에 자료가 존재하지 않습니다.");
    }

    res.status(200).json({
      error: null,
      message: `${name}님의 ${educationId}번 학력 내역을 삭제했습니다.`,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;

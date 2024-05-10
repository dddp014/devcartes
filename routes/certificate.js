const { Router } = require("express");
const { User, Certificate } = require("../models");
const { BadRequest, Unauthorized, Forbidden, NotFound } = require("../errors");
const { certificateSchema } = require("../utils/validation");

const router = Router();

// 자격증 정보 조회
router.get("/", async (req, res, next) => {
  try {
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const { userId, name } = req.session.passport.user;
    const certificate = await Certificate.find({ userId }).lean();

    if (certificate.length < 1) {
      throw new NotFound("등록된 자격증 정보를 찾을 수 없습니다.");
    }

    res.status(200).json({
      error: null,
      message: `${name}님의 전체 자격증 정보 수는 ${certificate.length}개 입니다.`,
      data: certificate,
    });
  } catch (e) {
    next(e);
  }
});

// 자격증 추가
router.post("/", async (req, res, next) => {
  try {
    // 세션 확인(401 error)
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const userId = req.session.passport.user.userId;
    const { title, acqDate } = req.body;

    // Joi validation
    const { error } = certificateSchema.validate({
      title,
      acqDate,
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      throw new BadRequest(errorMessages[0]); // 400 에러
    }

    const certificate = await Certificate.create({
      userId,
      title,
      acqDate,
    });

    res.status(201).json({
      error: null,
      message: "자격증이 추가되었습니다.",
      data: {
        userId: certificate.userId,
        certificateId: certificate.certificateId,
        title: certificate.title,
        acqDate: certificate.acqDate,
      },
    });
  } catch (e) {
    next(e);
  }
});

// 자격증 수정
router.put("/:certificateId", async (req, res, next) => {
  try {
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const userId = req.session.passport.user.userId;
    const certificateId = req.params.certificateId;
    const { title, acqDate } = req.body;

    // Joi validation
    const { error } = certificateSchema.validate({
      title,
      acqDate,
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      throw new BadRequest(errorMessages[0]); // 400 에러
    }

    const certificate = await Certificate.findOneAndUpdate(
      { userId, certificateId },
      { title, acqDate },
      { runValidators: true, new: true }
    ).lean();

    res.status(200).json({
      error: null,
      message: "자격증 정보를 수정했습니다.",
      data: {
        userId: certificate.userId,
        certificateId: certificate.certificateId,
        title: certificate.title,
        acqDate: certificate.acqDate,
      },
    });
  } catch (e) {
    next(e);
  }
});

// 자격증 삭제
router.delete("/:certificateId", async (req, res, next) => {
  try {
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const { userId, name } = req.session.passport.user;
    const certificateId = req.params.certificateId;

    const certificate = await Certificate.findOneAndDelete({
      userId,
      certificateId,
    }).lean();
    if (certificate === null) {
      throw new NotFound(
        "요청하신 유저의 자격증 ID에 자료가 존재하지 않습니다."
      );
    }

    res.status(200).json({
      error: null,
      message: `${name}님의 ${certificateId}번 자격증 내역을 삭제했습니다.`,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;

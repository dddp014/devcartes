const { Router } = require("express");
const { User, Award } = require("../models");
const { BadRequest, Unauthorized, Forbidden, NotFound } = require("../errors");
const { awardSchema } = require("../utils/validation");

const router = Router();

// 수상 조회
router.get("/", async (req, res, next) => {
  try {
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const { userId, name } = req.session.passport.user;
    const award = await Award.find({ userId }).lean();

    if (award.length < 1) {
      throw new NotFound("등록된 수상 내역을 찾을 수 없습니다.");
    }

    res.status(200).json({
      error: null,
      message: `${name}님의 전체 수상 수는 ${award.length}개 입니다.`,
      data: award,
    });
  } catch (e) {
    next(e);
  }
});

// 수상 추가
router.post("/", async (req, res, next) => {
  try {
    // 세션 확인(401 error)
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const { userId } = req.session.passport.user;
    const { title, details, acqDate } = req.body;

    // Joi validation
    const { error } = awardSchema.validate({
      title,
      details,
      acqDate,
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      throw new BadRequest(errorMessages[0]); // 400 에러
    }

    const award = await Award.create({
      userId,
      title,
      details,
      acqDate,
    });

    res.status(201).json({
      error: null,
      message: "수상 내역이 추가되었습니다.",
      data: {
        userId: award.userId,
        awardId: award.awardId,
        title: award.title,
        details: award.details,
        acqDate: award.acqDate,
      },
    });
  } catch (e) {
    next(e);
  }
});

// 수상 수정
router.put("/:awardId", async (req, res, next) => {
  try {
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const userId = req.session.passport.user.userId;
    const awardId = req.params.awardId;
    const { title, details, acqDate } = req.body;

    // Joi validation
    const { error } = awardSchema.validate({
      title,
      details,
      acqDate,
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      throw new BadRequest(errorMessages[0]); // 400 에러
    }

    const award = await Award.findOneAndUpdate(
      { userId, awardId },
      {
        title,
        details,
        acqDate,
      },
      { runValidators: true, new: true }
    ).lean();

    res.status(200).json({
      error: null,
      message: "수상 내역 정보를 수정했습니다.",
      data: {
        userId: award.userId,
        awardId: award.awardId,
        title: award.title,
        details: award.details,
        acqDate: award.acqDate,
      },
    });
  } catch (e) {
    next(e);
  }
});

// 수상 삭제
router.delete("/:awardId", async (req, res, next) => {
  try {
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const { userId, name } = req.session.passport.user;
    const awardId = req.params.awardId;

    const award = await Award.findOneAndDelete({ userId, awardId }).lean();
    if (award === null) {
      throw new NotFound(
        "요청하신 유저의 수상 내역 ID에 자료가 존재하지 않습니다."
      );
    }

    res.status(200).json({
      error: null,
      message: `${name}님의 ${awardId}번 수상 내역을 삭제했습니다.`,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;

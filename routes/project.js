const { Router } = require("express");
const { User, Project } = require("../models");
const { BadRequest } = require("../middlewares");

const router = Router();

//프로젝트 추가
router.post("/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;

    const idCheck = await User.findOne({ id: userId });

    if (!idCheck) {
      throw new BadRequest(
        "주소 요청이 잘못되었습니다. ID 값을 다시 확인해주세요."
      );
    }

    const id = 9999;
    const { title, startDate, endDate, details } = req.body;
    const project = await Project.create({
      userId,
      id,
      title,
      startDate,
      endDate,
      details,
    });

    res.status(200).json({
      error: null,
      data: project,
    });

    //DB 카운터 추가
  } catch (err) {
    next(err);
  }
});

module.exports = router;

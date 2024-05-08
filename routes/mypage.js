const { Router } = require("express");
const educationRouter = require("./education");
const awardRouter = require("./award");
const projectRouter = require("./project");
const certificateRouter = require("./certificate");
const skillRouter = require("./skill");

const router = Router();

router.use("/education", educationRouter);
router.use("/award", awardRouter);
router.use("/project", projectRouter);
router.use("/certificate", certificateRouter);
router.use("/skill", skillRouter);

module.exports = router;

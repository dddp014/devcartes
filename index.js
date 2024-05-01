const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config(); // env 관련
const bodyParser = require("body-parser");
const passport = require("passport");
require("./passport")();
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const ejs = require("ejs");

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const educationRouter = require("./routes/education");

// DB 연결 관련
mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on("error", (error) => {
  console.error("MongoDB 연결 에러: ", error);
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB 연결 성공");
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB와의 연결이 끊겼습니다.");
});

const app = express();

// view 경로 설정
app.set("views", __dirname + "/views");

// 화면 engine을 ejs로 설정
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

app.get("/", (req, res) => {
  res.render("index.html");
});

// 서버 설정
app.use(express.json());
app.use(bodyParser.json());

// 세션 설정
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, //session 정보가 변경되었을 때만 저장
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);

// Request가 들어오면 passport가 구동됨
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/education", educationRouter);

// 오류 처리
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({
    error: err.message || "서버 내부에서 오류가 발생했습니다.",
    data: err.data,
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`서버가 ${process.env.PORT}번 포트에서 시작되었습니다.`);
});

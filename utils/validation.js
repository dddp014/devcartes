const Joi = require("joi");

// 입력값 앞뒤 공백 확인용
const isTrimFrontBack = (value, helpers) => {
  if (value.trim() !== value) {
    return helpers.error("any.invalid1");
  }
  return value;
};

// 입력값 중간 공백 확인용
const isTrimMiddle = (value, helpers) => {
  if (value.split(" ").length > 1) {
    return helpers.error("any.invalid2");
  }
  return value;
};

const authSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.empty": "이메일 주소를 입력하세요.",
      "string.email":
        "올바른 이메일 주소 형식이 아닙니다. 이메일 입력 시 .com과 .net만 가능합니다.",
      "any.required": "이메일 주소를 입력하세요.",
    }),
  name: Joi.string()
    .custom(isTrimFrontBack, "custom validation")
    .min(2)
    .max(30)
    .required()
    .messages({
      "string.empty": "공백은 이름으로 사용 불가능합니다.",
      "string.min": "이름은 최소 2글자 이상이어야 합니다.",
      "string.max": "이름은 최대 30글자까지만 허용됩니다.",
      "any.required": "입력하지 않은 값이 있습니다.",
      "any.invalid1": "이름 앞뒤에는 띄어쓰기를 사용할 수 없습니다.",
    }),
  nickname: Joi.string()
    .min(2)
    .max(30)
    .required()
    .custom(isTrimFrontBack, "custom validation")
    .custom(isTrimMiddle, "custom validation")
    .messages({
      "string.empty": "공백은 닉네임으로 사용 불가능합니다.",
      "string.min": "닉네임은 최소 2글자 이상이어야 합니다.",
      "string.max": "닉네임은 최대 30글자까지만 허용됩니다.",
      "any.required": "입력하지 않은 값이 있습니다.",
      "any.invalid1": "닉네임 앞뒤에는 띄어쓰기를 사용할 수 없습니다.",
      "any.invalid2": "닉네임에는 띄어쓰기를 사용할 수 없습니다.",
    }),
  password: Joi.string().min(4).required().messages({
    "string.empty": "비밀번호를 입력하세요.",
    "string.min": "비밀번호는 최소 4글자 이상이어야 합니다.",
    "any.required": "입력하지 않은 값이 있습니다.",
  }),
});

const userSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(30)
    .required()
    .custom(isTrimFrontBack, "custom validation")
    .messages({
      "string.empty": "공백은 이름으로 사용 불가능합니다.",
      "string.min": "이름은 최소 2글자 이상이어야 합니다.",
      "string.max": "이름은 최대 30글자까지만 허용됩니다.",
      "any.required": "입력하지 않은 값이 있습니다.",
      "any.invalid1": "이름 앞뒤에는 띄어쓰기를 사용할 수 없습니다.",
    }),
  nickname: Joi.string()
    .min(2)
    .max(30)
    .required()
    .custom(isTrimFrontBack, "custom validation")
    .custom(isTrimMiddle, "custom validation")
    .messages({
      "string.empty": "공백은 닉네임으로 사용 불가능합니다.",
      "string.min": "닉네임은 최소 2글자 이상이어야 합니다.",
      "string.max": "닉네임은 최대 30글자까지만 허용됩니다.",
      "any.required": "입력하지 않은 값이 있습니다.",
      "any.invalid1": "닉네임 앞뒤에는 띄어쓰기를 사용할 수 없습니다.",
      "any.invalid2": "닉네임에는 띄어쓰기를 사용할 수 없습니다.",
    }),
  description: Joi.string().required().messages({
    "any.required": "입력하지 않은 값이 있습니다.",
  }),
});

const educationSchema = Joi.object({
  schoolName: Joi.string()
    .required()
    .custom(isTrimFrontBack, "custom validation")
    .messages({
      "string.empty": "공백은 학교명으로 사용 불가능합니다.",
      "any.required": "입력하지 않은 값이 있습니다.",
      "any.invalid1": "학교명 앞뒤에는 띄어쓰기를 사용할 수 없습니다.",
    }),
  major: Joi.string()
    .required()
    .custom(isTrimFrontBack, "custom validation")
    .messages({
      "string.empty": "공백은 학과명으로 사용 불가능합니다.",
      "any.required": "입력하지 않은 값이 있습니다.",
      "any.invalid1": "학과명 앞뒤에는 띄어쓰기를 사용할 수 없습니다.",
    }),
  schoolStatus: Joi.string()
    .required()
    .custom(isTrimFrontBack, "custom validation")
    .messages({
      "string.empty": "공백은 학력 상태명으로 사용 불가능합니다.",
      "any.required": "입력하지 않은 값이 있습니다.",
      "any.invalid1": "학력 상태명 앞뒤에는 띄어쓰기를 사용할 수 없습니다.",
    }),
});

const awardSchema = Joi.object({
  title: Joi.string()
    .required()
    .custom(isTrimFrontBack, "custom validation")
    .messages({
      "string.empty": "공백은 수상 이름으로 사용 불가능합니다.",
      "any.required": "입력하지 않은 값이 있습니다.",
      "any.invalid1": "수상 이름 앞뒤에는 띄어쓰기를 사용할 수 없습니다.",
    }),
  details: Joi.string().trim().required().messages({
    "string.empty": "공백은 수상 설명으로 사용 불가능합니다.",
    "any.required": "입력하지 않은 값이 있습니다.",
  }),
  acqDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.empty": "공백은 수상일로 사용 불가능합니다.",
      "string.pattern.base": "수상일은 YYYY-MM-DD 형식이어야 합니다.",
      "any.required": "입력하지 않은 값이 있습니다.",
    }),
});

const projectSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    "string.empty": "공백은 프로젝트 제목으로 사용 불가능합니다.",
    "any.required": "입력하지 않은 값이 있습니다.",
  }),
  startDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.empty": "공백은 프로젝트 시작일로 사용 불가능합니다.",
      "string.pattern.base": "프로젝트 시작일은 YYYY-MM-DD 형식이어야 합니다.",
      "any.required": "입력하지 않은 값이 있습니다.",
    }),
  endDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.empty": "공백은 프로젝트 종료일로 사용 불가능합니다.",
      "string.pattern.base": "프로젝트 종료일은 YYYY-MM-DD 형식이어야 합니다.",
      "any.required": "입력하지 않은 값이 있습니다.",
    }),
  details: Joi.string().trim().required().messages({
    "string.empty": "공백은 프로젝트 상세 설명으로 사용 불가능합니다.",
    "any.required": "입력하지 않은 값이 있습니다.",
  }),
});

const certificateSchema = Joi.object({
  title: Joi.string()
    .required()
    .custom(isTrimFrontBack, "custom validation")
    .messages({
      "string.empty": "공백은 자격증 이름으로 사용 불가능합니다.",
      "any.required": "입력하지 않은 값이 있습니다.",
      "any.invalid1": "자격증 이름 앞뒤에는 띄어쓰기를 사용할 수 없습니다.",
    }),
  acqDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.empty": "공백은 자격증 획득일로 사용 불가능합니다.",
      "string.pattern.base": "자격증 획득일은 YYYY-MM-DD 형식이어야 합니다.",
      "any.required": "입력하지 않은 값이 있습니다.",
    }),
});

const boardSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    "string.empty": "게시글 제목을 입력하세요.",
    "any.required": "입력하지 않은 값이 있습니다.",
  }),
  contents: Joi.string().trim().required().messages({
    "string.empty": "게시글 내용을 입력하세요.",
    "any.required": "입력하지 않은 값이 있습니다.",
  }),
});

const commentSchema = Joi.object({
  contents: Joi.string().trim().required().messages({
    "string.empty": "댓글 내용을 입력하세요.",
    "any.required": "입력하지 않은 값이 있습니다.",
  }),
});

const skillSchema = Joi.object({
  stack: Joi.string()
    .required()
    .custom(isTrimFrontBack, "custom validation")
    .messages({
      "string.empty": "공백은 스킬명으로 사용 불가능합니다.",
      "any.required": "입력하지 않은 값이 있습니다.",
      "any.invalid1": "스킬명 앞뒤에는 띄어쓰기를 사용할 수 없습니다.",
    }),
});

module.exports = {
  authSchema,
  userSchema,
  educationSchema,
  awardSchema,
  projectSchema,
  certificateSchema,
  boardSchema,
  commentSchema,
  skillSchema,
};

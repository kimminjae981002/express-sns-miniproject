const mailer = require("nodemailer");
const welcome = require("./welcome_template");
const goodbye = require("./goodbye_template");

require("dotenv").config();

// html template를 이용한 로직
const getEmailData = (to, template) => {
  let data = null;

  switch (template) {
    case "welcome":
      data = {
        from: "보내는 사람 이름",
        to,
        subject: `hello`,
        html: welcome(),
      };
      break;
    case "goodbye":
      data = {
        from: "보내는 사람 이름",
        to,
        subject: `Goodbye`,
        html: goodbye(),
      };
      break;
    default:
      data;
  }
  return data;
};

// nodemailer를 이용한 메일 보내기 로직
const sendMail = (to, type) => {
  const transporter = mailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GOOGLE_USER,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });

  // 템플릿 함수를 mail 변수에 담음
  const mail = getEmailData(to, type);

  // nodemailer를 이용해서 mail 보내기
  transporter.sendMail(mail, (error, response) => {
    if (error) {
      console.log(error);
    } else {
      console.log("email sent successfully");
    }

    transporter.close();
  });
};

// 회원가입 시 메일 보내기 위해 export - user.router.js
module.exports = sendMail;

const nodemailer = require("nodemailer");

const sendWelcomeEmail = async (email, code) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.net",
      port: process.env.PORT_VALUE,
      secure: true,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
    });

    const info = {
      from: {
        name: "OMIO Welcome Mail ",
        address: process.env.USER_EMAIL,
      }, // sender address
      to: email, // list of receivers
      subject: "Account Created Successfully", // Subject line
      text: "We're delighted to have you join us.", // plain text body
      html: `
          <div
              style="
                width: 100vw;
                height: 100vh;
              "
            >
              <div style="font-size: 1.4rem">
                Welcome to OMIO, where every meal matters!🌱🌱🌱🌱<br />
                <p>
                  We're thrilled to have you join our community dedicated to preventing
                  food wastage. Together, we can make a significant impact by rescuing
                  and sharing delicious, surplus food.
                </p>
                <p>
                  To Continue, use the registration code embedded in this message:
                  <p>${code}</p>
                  Enter it activate your account and enjoy the full
                  potential of the OMIO. Thank you for being a part of the
                  solution. Let's embark on this journey together and create a world
                  where no meal goes to waste. Happy rescuing!"
                </p>
              </div>
            </div>
        
          `,
    };
    await transporter.sendMail(info);
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
};

const resendMail = async (email, code) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.net",
      port: process.env.PORT_VALUE,
      secure: true,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
    });

    const info = {
      from: {
        name: "OMIO Welcome Mail ",
        address: process.env.USER_EMAIL,
      }, // sender address
      to: email, // list of receivers
      subject: "Account Verification Code", // Subject line
      text: "You requested for a verification code", // plain text body
      html: `
              <div
                  style="
                    width: 100vw;
                    height: 100vh;
                  "
                >
                  <div style="font-size: 1.4rem">
                    You requested a new code,
                    <p>
                      To Continue, use the registration code embedded in this message:
                      <p>${code}</p>
                      Enter it activate your account and enjoy the full
                      potential of the OMIO. Thank you for being a part of the
                      solution. Let's embark on this journey together and create a world
                      where no meal goes to waste. Happy rescuing!"
                    </p>
                  </div>
                </div>
            
              `,
    };
    await transporter.sendMail(info);
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
};
module.exports = { sendEmail: sendWelcomeEmail, resendMail };

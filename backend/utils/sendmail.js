import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const sendMail = async (email, subject, text) => {
  const info = {
    from: `EatWell+ ${process.env.EMAIL}`,
    to: email,
    subject: subject,
    text: text,
  };
  try {
    const response = await transporter.sendMail(info);
  } catch (err) {
    console.log(err);
  }
};

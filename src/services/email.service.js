const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `http://localhost:3000/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verifikasi Email - Chill App",
    html: `
      <h2>Verifikasi Email</h2>

      <p>
        Terima kasih sudah melakukan registrasi.
      </p>

      <p>
        Silakan klik tombol berikut untuk
        memverifikasi email kamu:
      </p>

      <a href="${verificationUrl}">
        Verifikasi Email
      </a>

      <p>
        Jika kamu tidak melakukan registrasi,
        abaikan email ini.
      </p>
    `,
  });
};

const testSendEmail = async () => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "Test Email - Chill App",
    text: "Nodemailer berhasil digunakan.",
  });
};

module.exports = {
  sendVerificationEmail,
  testSendEmail,
};

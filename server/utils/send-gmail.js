const nodemailer = require("nodemailer");
module.exports = async (req, bcryptPassword) => {
  console.log(req.body, bcryptPassword);
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "abuzcoder@gmail.com",
      pass: "mannon_2710",
    },
  });
  const html = `<div class="container mx-auto px-4">
                  <h1 class="text-3xl mb-4">Your Secret key</h1>
                  <div class="card p-5 shadow-md border-2 rounded-md max-w-5xl flex itemas-center">
                    <p style="font-size:20px;">
                      ${bcryptPassword}
                    </p>
                    <button onClick="navigator.clipboard.writeText(${bcryptPassword})"></button>
                  </div>
                </div>`;
  let info = await transporter.sendMail({
    from: "Abdumannon Tojiboev <abuzcoder@gmail.com>", // sender address
    to: req.body.email, // list of receivers
    subject: "Chat Auth", // Subject line
    text: "Client name : ", // plain text body
    html: html, // html body
  });
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

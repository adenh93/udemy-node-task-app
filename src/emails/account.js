const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendWelcomeEmail = ({ email, name }) => {
  sgMail.send({
    to: email,
    from: process.env.EMAIL_FROM,
    subject: "Welcome to the Task Manager API!",
    text: `Welcome to the app, ${name}.`
  });
};

exports.sendAccountTerminationEmail = ({ email, name }) => {
  sgMail.send({
    to: email,
    from: process.env.EMAIL_FROM,
    subject: "We're sorry to see you go!",
    text: `Hi, ${name}. We're sorry that you're leaving. Is there something that we can do better next time?`
  });
};

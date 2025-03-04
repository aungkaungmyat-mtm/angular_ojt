<<<<<<< Updated upstream
export default ({ env }) => ({
  // email: {
  //   config: {
  //     provider: "sendgrid",
  //     providerOptions: {
  //       apiKey: env("SENDGRID_API_KEY"),
  //     },
  //     settings: {
  //       defaultFrom: env("SENDGRID_DEFAULT_FROM"),
  //       defaultReplyTo: env("SENDGRID_DEFAULT_TO"),
  //     },
  //   },
  // },
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: env("SMTP_HOST", "smtp.example.com"),
        port: env("SMTP_PORT", 587),
        auth: {
          user: env("SMTP_USERNAME"),
          pass: env("SMTP_PASSWORD"),
        },
      },
      settings: {
        defaultFrom: "scm.aungkaungmyat@gmail.com",
        defaultReplyTo: "scm.aungkaungmyat@gmail.com",
      },
    },
  },
  plugins: {
    "users-permissions": {
      enabled: true,
    },
  },
});
=======
module.exports = ({ env }) => ({
    // ...
    email: {
      config: {
        provider: "sendgrid",
        providerOptions: {
          apiKey: env("SENDGRID_API_KEY"),
        },
        settings: {
          defaultFrom: env("SENDGRID_DEFAULT_FROM"),
          defaultReplyTo: env("SENDGRID_DEFAULT_TO"),
        },
      },
    },
    // ...
  });
>>>>>>> Stashed changes

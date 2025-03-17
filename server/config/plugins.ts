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
        defaultFrom: env("EMAIL_DEFAULT_FROM", "mtmkaungkhant12@gmail.com"),
        defaultReplyTo: env("EMAIL_DEFAULT_REPLY_TO", "mtmkaungkhant12@gmail.com"),
      },
    },
  },
  plugins: {
    "users-permissions": {
      enabled: true,
    },
  },
});

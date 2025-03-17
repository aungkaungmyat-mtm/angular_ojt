export default ({ env }) => ({
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
        defaultFrom: env("SMTP_DEFAULT_FROM", "mtmkaungkhant12@gmail.com"),
        defaultReplyTo: env(
          "SMTP_DEFAULT_REPLY_TO",
          "mtmkaungkhant12@gmail.com"
        ),
      },
    },
  },
  plugins: {
    "users-permissions": {
      enabled: true,
    },
  },
});

export default ({ env }) => ({
  email: {
    config: {
      provider: 'sendgrid',
      providerOptions: {
        apiKey: env('SENDGRID_API_KEY'),
      },
      settings: {
        defaultFrom: env('SMT_USER'),
        defaultReplyTo: env('SMT_USER'),
        testAddress: env('SMT_USER'),
      },
    },
  },
});

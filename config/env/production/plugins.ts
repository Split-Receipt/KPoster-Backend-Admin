export default ({ env }) => ({
  email: {
    config: {
      provider: 'strapi-provider-email-resend',
      providerOptions: {
        apiKey: env('RESEND_API_KEY'),
      },
      settings: {
        defaultFrom: env('SMT_USER'),
        defaultReplyTo: env('SMT_USER'),
      },
    }
  },
});

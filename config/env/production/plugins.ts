export default ({ env }) => ({
	email: {
		config: {
		  provider: 'nodemailer',
		  providerOptions: {
			host: env('SMT_SERVER'),
            port: env('SMT_PORT'),
            secure: env.bool('SMT_SECURE'),
			auth: {
			  user: env('SMT_USER'),
			  pass: env('SMT_PASS'),
			},
		  },
		  settings: {
			defaultFrom: env('SMT_USER'),
            defaultReplyTo: env('SMT_USER'),
		  },
		},
	  },
});

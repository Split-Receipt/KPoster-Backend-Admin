const hooks = {
  async afterUpdate(event) {
    const { params, result } = event;

    if (params?.data?.role) {
      const newRoleId = params.data.role;

      // Можно загрузить роль (например, чтобы узнать её имя):
      const newRole = await strapi
        .query("plugin::users-permissions.role")
        .findOne({ where: { id: newRoleId } });

      // Теперь у нас есть user (result) и newRole
      const recipient = result?.email;
      const roleName = newRole?.name || "неизвестная роль";


    try {
      await strapi.plugins['email'].services.email.send({
        to: recipient,
        from: process.env.EMAIL_FROM, // Отправитель из .env
        subject: 'Cambio de rol en Portal Cultural Cusco',
        text: `Tu nuevo rol: ${roleName}`,
        html: `<p>¡Hola! Tu nuevo rol es: <strong>${roleName}</strong>.</p>`,
      });

      strapi.log.info('Notification about role change sended via email');
    } catch (error) {
      strapi.log.error('Error while sending email:', error);
    }
  }
}
}

export default hooks

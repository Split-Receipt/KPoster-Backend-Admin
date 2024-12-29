export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  // файл: src/strapi-server.js
  async bootstrap({ strapi }) {
    // Подписка на любые изменения в БД (create/update/delete) по всем моделям
    strapi.db.lifecycles.subscribe(async (event) => {
      const { model, action, params, result } = event;

      // 1) Проверяем, что это - после обновления (afterUpdate)
      // 2) Проверяем, что модель - это плагин users-permissions.user
      if (
        action === 'afterUpdate' &&
        model.uid === 'plugin::users-permissions.user'
      ) {
        // Проверяем, действительно ли менялась роль
        // - Обычно, при обновлении роли в запросе присутствует params.data.role
        // - Т.к. это "после" (after), в result.role хранится новая роль

        // Если в запросе менялась роль:
        if (params?.data?.role) {
          const newRoleId = params.data.role; // ID новой роли
          try {
            // Загрузим роль, чтобы узнать её имя
            const newRole = await strapi
              .query('plugin::users-permissions.role')
              .findOne({ where: { id: newRoleId } });
            const roleName = newRole?.name || 'Desconocido';

            // Достаём e-mail пользователя (после обновления)
            const userEmail = result?.email;
            if (!userEmail) {
              strapi.log.warn(
                '[role-change-lifecycle] No user email, skipping email send.'
              );
              return;
            }

            // Отправляем письмо через Email plugin
            await strapi
              .plugin('email')
              .service('email')
              .send({
                to: userEmail,
                subject: 'Cambio de rol en el sitio',
                text: `¡Hola! Tu nuevo rol es: ${roleName}`,
                html: `<p>¡Hola! Tu nuevo rol es: <strong>${roleName}</strong>.</p>`,
              });

            strapi.log.info(
              `[role-change-lifecycle] Se envió correo a ${userEmail} sobre cambio de rol a ${roleName}.`
            );
          } catch (err) {
            strapi.log.error(
              '[role-change-lifecycle] Error enviando correo sobre el cambio de rol:',
              err
            );
          }
        }
      }
    });
  },
};

export default {
  /**
   * Функция регистрирации (register) — вызывается до инициализации приложения
   */
  register(/* { strapi } */) {},

  /**
   * Функция bootstrap — вызывается перед стартом приложения.
   */
  async bootstrap({ strapi }) {
    // Подписываемся на любые изменения в БД (create/update/delete) по всем моделям
    strapi.db.lifecycles.subscribe(async (event) => {
      const { model, action, params, result } = event;

      // Проверяем, что это 'afterUpdate' для модели пользователя плагина users-permissions
      if (
        action === 'afterUpdate' &&
        model.uid === 'plugin::users-permissions.user'
      ) {
        // Проверяем, действительно ли менялась роль (например, params.data.role)
        if (params?.data?.role) {
          try {
            // Делаем повторный запрос, чтобы получить полные данные о пользователе,
            // включая связанную роль (populate: ['role'])
            const userWithRole = await strapi.entityService.findOne(
              'plugin::users-permissions.user',
              result.id,
              {
                populate: ['role'],
              }
            );

            // Если по какой-то причине роль отсутствует, прерываем
            if (!userWithRole?.role) {
              strapi.log.warn(
                '[role-change-lifecycle] El usuario no tiene rol después de la actualización.'
              );
              return;
            }

            // Берём имя роли
            const roleName = userWithRole.role.name || 'Desconocido';
            // Берём e-mail пользователя
            const userEmail = userWithRole.email;

            if (!userEmail) {
              strapi.log.warn(
                '[role-change-lifecycle] No user email, skipping email send.'
              );
              return;
            }

            // Отправляем письмо через плагин Email
            await strapi.plugin('email').service('email').send({
              to: userEmail,
              subject: 'Cambio de rol en el sitio',
              text: `¡Hola!
Te saluda el Portal Cultural. Hemos cambiado tu rol dentro del portal y ahora tu rol es:  ${roleName}.

Un poco sobre los roles:
• Cliente: Puede ver los eventos.
• Organizador de eventos: Puede crear y modificar eventos. Además, tiene acceso a un panel personal donde puede dar seguimiento a sus eventos y cambiar su información personal.`,
              html: `<p>¡Hola!</p>
<p>
  Te saluda el Portal Cultural. Hemos cambiado tu rol dentro del portal y ahora tu rol es:
  <strong>${roleName}</strong>.
</p>
<p>Un poco sobre los roles:</p>
<ul>
  <li><strong>Cliente</strong> – Puede ver los eventos.</li>
  <li><strong>Organizador de eventos</strong> – Puede crear y modificar eventos. Además, tiene acceso a un panel personal donde puede dar seguimiento a sus eventos y cambiar su información personal.</li>
</ul>`,
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
 const hooks = {
    async afterCreate(event) {
      const { result } = event;
  
      // Используем данные из .env
      const recipient = 'adm.portalcusco@gmail.com';

      const partnerName = result.commercialName ? result.commercialName : result.personalName
  
      try {
        await strapi.plugins['email'].services.email.send({
          to: recipient, // Получатель из .env
          from: process.env.SMT_USER, // Отправитель из .env
          subject: 'Solicitud de registro de un nuevo organizador',
          text: `Se ha creado un nuevo organizador de eventos:\n\nNombre: ${partnerName}`,
          html: `<p>Se ha creado un nuevo organizador de eventos:</p><ul><li>Nombre: ${partnerName}</li></ul>`,
        });
  
        strapi.log.info('New partner notification sended via email');
      } catch (error) {
        strapi.log.error('Error while sending email:', error);
      }
    },
  };

  export default hooks
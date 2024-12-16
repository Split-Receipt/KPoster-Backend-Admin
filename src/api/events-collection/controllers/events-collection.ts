/**
 * events-collection controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::events-collection.events-collection', (strapi) => ({
  // Переопределяем стандартный метод find
  async find(ctx) {
    // Вызываем стандартное поведение find
    const { data, meta } = await super.find(ctx);

    // Добавляем свою логику
    const filteredData = data.map(collection => ({
      ...collection.attributes,
      attributes: {
        events: collection.attributes.events.filter(event =>
          new Date(event.data.attributes.eventDate) >= new Date(ctx.query.filters.eventDate.$gte)
        ),
      }
    }));

    // Возвращаем изменённые данные
    return { data: filteredData, meta };
  },
}));


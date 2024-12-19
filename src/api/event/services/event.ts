/**
 * event service
 */

import { factories } from '@strapi/strapi';
import { errors }from "@strapi/utils"

export default factories.createCoreService('api::event.event', ({ strapi })=> ({
    async update(entityId, params) {
        const requestUser = strapi.requestContext.get().state.user;
        const eventToUpdate = await strapi.entityService.findOne('api::event.event', entityId, {
            populate: {
                eventHost: {
                    populate: {
                        user: true
                    }
                }
            }
        })

        if (eventToUpdate.eventHost.user.id !== requestUser.id) {
            throw new errors.ForbiddenError();
        }

        const entry = await strapi.entityService.update('api::event.event', entityId, params);

        return entry
    },

    async delete(entityId) {
        const requestUser = strapi.requestContext.get().state.user;
        const eventToUpdate = await strapi.entityService.findOne('api::event.event', entityId, {
            populate: {
                eventHost: {
                    populate: {
                        user: true
                    }
                }
            }
        })

        if (eventToUpdate.eventHost.user.id !== requestUser.id) {
            throw new errors.ForbiddenError();
        }

        const result  = await strapi.entityService.delete('api::event.event', entityId);

        return result 
    },

    async create(params) {
        const requestUser = strapi.requestContext.get().state.user;

        // Пользователи, которые зареганы
        const registeredUser = await strapi.entityService.findOne('plugin::users-permissions.user', requestUser.id, {
            populate: {
                eventHostData: true,
            }
        })

        if (!registeredUser || registeredUser.eventHostData.id !== params.data.eventHost) {
            throw new errors.ForbiddenError();
        }

        const result = await super.create(params);

        return result;
    }

}));

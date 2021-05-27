import express from 'express';
import {LogService} from '../services/LogService';

/**
 * Register all routes.
 * @param app
 */
export const register = (app: express.Application) => {
    
    /**
     * Gets all groups
     */
    app.get('/v1/aws/cloudwatch/groups', async (request: any, response: any) => {
        const logs = new LogService();
        await logs.getLogGroups(request, response);
    });

    /**
     * Gets all logs in the selected group by range of time
     */
    app.get('/v1/aws/cloudwatch/logs', async (request: any, response: any) => {
        const logs = new LogService;
        await logs.getLogEvents(request, response);
    });

}
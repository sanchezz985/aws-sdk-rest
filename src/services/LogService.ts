import {CloudWatchLogsService} from './CloudWatchLogsService';
import CloudWatchLogs from 'aws-sdk/clients/cloudwatchlogs';
import * as utils from '../utils/Utilities';
import * as CONSTANTS from '../utils/Constants';
import { GroupLogResponse, DescribeLogStreamResponse } from "../utils/Types";

/**
 * Services for logs
 */
export class LogService {

    private cloudWatchLogs: CloudWatchLogsService;

    /**
     * Init cloudWatchLogs instance
     */
    constructor() {
        this.cloudWatchLogs = new CloudWatchLogsService();
    };

    /**
     * Get log groups from configured account (see .env configuration in README)
     * @param req - request
     * @param res - response
     */
    async getLogGroups(req:any, res:any) {
        let logGroups: Array<GroupLogResponse> = [];
        let groups: CloudWatchLogs.Types.DescribeLogGroupsResponse = {};
        try {
            do {
                try {
                    groups = await this.cloudWatchLogs.describeLogGroups(groups.nextToken);
                    if(groups.logGroups != undefined)
                        logGroups = [...logGroups, ...this.getLogGroupsResponse(groups)];
                } catch (e) {
                    console.log(e);
                    break;
                }
            } while (groups.nextToken);
            res.status(200).send(logGroups);
        } catch (error) {
            res.status(503).send(error);
        }
    };

    /**
     * Get log streams from configured account (see .env configuration in README)
     * @deprecated
     * @param req - request
     * @param res - response
     */
    async getLogStreams(req:any, res:any) {
        let logStreams: Array<DescribeLogStreamResponse> = [];
        let streams: CloudWatchLogs.Types.DescribeLogStreamsResponse = {};
        const groupName: string = req.query.groupName;
        try {
            do {
                try {
                    streams = await this.cloudWatchLogs.describeLogStreams(groupName, streams.nextToken);
                    if(streams.logStreams != undefined)
                        logStreams = [...logStreams, ...this.getLogStreamsResponse(streams)];
                } catch (e) {
                    console.log(e);
                    break;
                }
            } while (streams.nextToken);
            res.status(200).send(logStreams);
        } catch (error) {
            res.status(503).send(error);
        }
    };

    /**
     * Gets the logs for selected group
     * @param req - request
     * @param res - response
     */
    async getLogEvents(req: any, res: any) {
        let logs: CloudWatchLogs.FilterLogEventsResponse = {};
        const groupName: string = req.query.groupName;
        const startTime: number = utils.dateToMilliseconds(req.query.startTime);
        const endTime: number = utils.dateToMilliseconds(req.query.endTime);
        const FILE_NAME = groupName.slice(12, groupName.length);
        const FILE_PATH = `${CONSTANTS.BASE_PATH}${FILE_NAME}${CONSTANTS.EXTENSION}`;
        try {
            /* creates the log file */
            utils.writeFile(FILE_PATH, CONSTANTS.EMPTY_STRING);
            do {
                try {
                    logs = await this.cloudWatchLogs.filterLogEvents(groupName, startTime, endTime, logs.nextToken);
                    if(logs.events != undefined)
                        this.writeLogFile(FILE_PATH, logs.events);
                } catch (e) {
                    console.log(e);
                    break;
                }
                console.log(`NextToken ::: ${logs.nextToken}`);
            } while (logs.nextToken);
            res.status(200).send({});
        } catch (error) {
            console.error(error);
            res.status(503).send(error);
        }
    };

    /**
     * Write in log file with the following format : [# yyyy-MM-dd hh:mm:ss] /some text/ [#]
     * @param path - file path
     * @param data - data to be written
     */
    private writeLogFile(path:string, data: CloudWatchLogs.FilteredLogEvents) {
        data.forEach(e => {
            const message = String(e.message).replace(/\s\s+/g, ' ').trim();
            const line: string = `[# ${utils.millisecondsToDate(Number(e.timestamp))}] ${message} [#]\n`;
            utils.appendFile(path, line);
        });
    }

    /**
     * Gets the final object with formatted data
     * @param groups - AWS groups object
     */
    private getLogGroupsResponse(groups: CloudWatchLogs.Types.DescribeLogGroupsResponse): Array<GroupLogResponse> {
        let response: Array<GroupLogResponse> = [];
        groups.logGroups?.forEach(group => {
            let item: GroupLogResponse = {
                logGroupName: String(group.logGroupName),
                creationTime: String(utils.millisecondsToDate(Number(group.creationTime))),
                arn: String(group.arn),
                storedBytes: String(utils.formatBytes(Number(group.storedBytes)))
            };            
            response.push(item);
        });
        return response;
    };

    /**
     * Gets the final object with formatted data
     * @param streams - AWS stream object
     */
    private getLogStreamsResponse(streams: CloudWatchLogs.Types.DescribeLogStreamsResponse): Array<DescribeLogStreamResponse> {
        let response: Array<DescribeLogStreamResponse> = [];
        streams.logStreams?.forEach(stream => {
            let item: DescribeLogStreamResponse = {
                logStreamName: String(stream.logStreamName),
                creationTime: String(utils.millisecondsToDate(Number(stream.creationTime))),
                arn: String(stream.arn),
                storedBytes: String(utils.formatBytes(Number(stream.storedBytes)))
            };
            response.push(item);
        });
        return response;
    };

}
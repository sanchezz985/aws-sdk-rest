import CloudWatchLogs from 'aws-sdk/clients/cloudwatchlogs';
import AWSError from 'aws-sdk/lib/error';


/**
 * Class to manage AWS CloudWatch Logs
 */
export class CloudWatchLogsService {

    private cloudWatchLogs : CloudWatchLogs;

    /**
     * Init the instance
     */
    constructor() {
        this.cloudWatchLogs = new CloudWatchLogs({
            apiVersion: process.env.CLOUDWATCH_LOGS_VERSION,
            accessKeyId: process.env.ACCESS_KEY_AWS,
            secretAccessKey: process.env.SECRET_KEY_AWS,
            region: process.env.REGION
        });
    };

    /**
     * Return a list of the specified log groups.
     * See documentation for describeLogGroups method in https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#describeLogGroups-property
     * @param nextToken - The token for the next set of items to return. (You received this token from a previous call.)
     */
    describeLogGroups(nextToken?: string):Promise<CloudWatchLogs.Types.DescribeLogGroupsResponse> {
        return new Promise((resolve, reject) => {
            this.cloudWatchLogs.describeLogGroups({
                nextToken: nextToken
            })
            .promise()
            .then((res: CloudWatchLogs.Types.DescribeLogGroupsResponse) => resolve(res))
            .catch((err: AWSError.AWSError) => reject(err));
        });
    };

    /**
     * Lists the log streams for the specified log group.
     * See documentation for describeLogStreams method in https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#describeLogStreams-property
     * @param logGroupName - The name of the log group.
     * @param nextToken - The token for the next set of items to return. (You received this token from a previous call.)
     */
    describeLogStreams(logGroupName: string, nextToken?: string): Promise<CloudWatchLogs.Types.DescribeLogStreamsResponse>{
        return new Promise((resolve, reject) => {
            this.cloudWatchLogs.describeLogStreams({
                logGroupName: logGroupName,
                descending: true,
                orderBy: "LastEventTime",
                nextToken: nextToken
            })
            .promise()
            .then((res: CloudWatchLogs.Types.DescribeLogStreamsResponse) => resolve(res))
            .catch((err: AWSError.AWSError) => reject(err));
        });
    };

    /**
     * Lists log events from the specified log group.
     * See documentation for filterLogEvents method in https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#filterLogEvents-property
     * @param logGroupName - The name of the log group.
     * @param startTime - The start of the time range, expressed as the number of milliseconds after Jan 1, 1970 00:00:00 UTC. Events with a timestamp before this time are not returned.
     * @param endTime - The end of the time range, expressed as the number of milliseconds after Jan 1, 1970 00:00:00 UTC. Events with a timestamp later than this time are not returned.
     * @param nextToken - The token for the next set of events to return. (You received this token from a previous call.)
     */
    filterLogEvents(logGroupName: string, startTime?: number, endTime?: number, nextToken?: string): Promise<CloudWatchLogs.FilterLogEventsResponse> {
        return new Promise((resolve, reject) => {
            this.cloudWatchLogs.filterLogEvents({
                logGroupName: logGroupName,
                nextToken: nextToken,
                startTime: startTime,
                endTime: endTime
            })
            .promise()
            .then((res: CloudWatchLogs.FilterLogEventsResponse) => resolve(res))
            .catch((err: AWSError.AWSError) => reject(err));
        });
    }


}
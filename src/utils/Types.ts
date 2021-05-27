export type GroupLogResponse = {
    logGroupName: string,
    creationTime: string,
    arn: string,
    storedBytes: string
};

export type DescribeLogStreamResponse = {
    logStreamName: string,
    creationTime: string,
    arn: string,
    storedBytes: string
};
import * as CONSTANTS from "./Constants";
import fs from "fs";

/**
 * Take a date in milliseconds and return a formatted date yyyy-MM-dd hh:mm:ss
 * @param milliseconds - date in milliseconds after Jan 1, 1970 00:00:00 UTC.
 */
export const millisecondsToDate = (milliseconds: number):String => {
    const currentDate:Date = new Date(milliseconds);
    const options: Intl.DateTimeFormatOptions = {year: 'numeric', month: 'numeric', day: 'numeric'};
    return currentDate.toLocaleTimeString('es', options);
};

/**
 * Take a date in string format and return its representation in milliseconds after Jan 1, 1970 00:00:00 UTC.
 * @param date - date in string format yyyy/MM/dd hh:mm:ss
 */
export const dateToMilliseconds = (date: string):number => {
    return new Date(date).getTime();
};

/**
 * Gets the number of bytes and return a more readable string like "25.00 KB", "2.50 GB", etc.
 * @param bytes - number of bytes
 * @param decimals - positions to be show
 */
export const formatBytes = (bytes: number, decimals: number = 2):String => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Creates a new file in the selected path
 * @param path - path of the file
 * @param data - data to be written in the file
 */
export const writeFile = (path: string, data: string) => {
    try {
        logFolder();
        fs.writeFileSync(path, data);
    } catch (e){
        throw new Error(`Could not write the file ${path}`);
    }
};

/**
 * Append an existing file in the selected path
 * @param path - path of the file
 * @param data - data to be appended in the file
 */
export const appendFile = (path: string, data: string) => {
    try{
        fs.appendFileSync(path, data);
    }catch(e){
        throw new Error(`Could not append the file ${path}`);
    }
};

/**
 * Creates the log folder if doesn't exist
 */
const logFolder = () => {
    if(!fs.existsSync(CONSTANTS.LOG_FOLDER))
        fs.mkdirSync(CONSTANTS.LOG_FOLDER);
}
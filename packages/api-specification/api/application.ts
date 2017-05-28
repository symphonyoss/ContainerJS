export interface ApplicationAPI {
    config: ApplicationConfig;

    /** Sets the counter badge for current app. Setting the count to 0 will hide the badge.*/
    setBadgeCount(count: number);

    /** The current value displayed in the counter badge.*/
    getBadgeCount(): number;

    /** Returns an array containing the command line arguments passed when application was launched */
    argv: string[];
}

export interface ApplicationConfig {
    name: string;
    url: string;
    uuid: string;
    autoShow: boolean;
}
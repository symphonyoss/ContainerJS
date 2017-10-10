export interface ApplicationAPI {
    /**
     * Returns an array containing the command line arguments passed when application was launched
     */
    argv: string[];

    /**
     * Application configuration object (as defined in app.json file)
     */
    config: ApplicationConfig;

    /**
     * The current value displayed in the counter badge.
     */
    getBadgeCount(): number;

    /**
     * Sets the counter badge for current app. Setting the count to 0 will hide the badge.
     */
    setBadgeCount(count: number);

    /**
     * Shutdown the application
     */
    shutdown: () => void;
}

export interface ApplicationConfig {
    name: string;
    url: string;
    uuid: string;
    autoShow: boolean;
}
import {SystemAPI} from "./system";
import {WindowsAPI} from "./windows";
import {MessagesAPI} from "./messages";
import {NotificationsAPI} from "./notifications";
import {ApplicationAPI} from "./application";
import {SSFInfo} from "./info";

/**
 * Describes the ssf object as exposed to clients applications
 *
 * SSF object groups different APIs, where specific API methods can be access using the corresponding sub-object, e.g.
 * to access window manage API :
 *
 * ssf.windows.open({name:'search', url: 'http://google.com'});
 */
export interface SSF {
    /**
     * Window management API - create, discover and manage windows
     */
    windows: WindowsAPI;

    /**
     * Messaging API - communicate with other windows
     */
    messages: MessagesAPI;

    /**
     * Notifications API - publish notifications to the user
     */
    notifications: NotificationsAPI;

    /**
     * Application API - access application specific information
     */
    application: ApplicationAPI;

    /**
     * System API - access system specific stuff, like displays, user activity, os information, etc.
     */
    system : SystemAPI;

    /**
     * Info API - general info about the API and the host container
     */
    info: SSFInfo;
}

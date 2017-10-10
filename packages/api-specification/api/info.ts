export interface SSFInfo{
    /** Version of the API **/
    apiVersion: string;

    /** Container information **/
    container: ContainerInfo;
}

export interface ContainerInfo {
    /** Name of the container */
    name: string;

    /** Version of the container */
    version: string;

    /**
     * Capabilities supported by the container.
     * Expressed as object where each property is a capability and the value
     * is the level of support in the container
     */
    capabilities: {[key:string]: string};
}
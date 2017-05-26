export interface SSFInfo{
    /** Version of the API **/
    apiVersion: string;

    /** Container information **/
    container: ContainerInfo;
}

export interface ContainerInfo {
    name: string;
    version: string;
    capabilities: string[];
}
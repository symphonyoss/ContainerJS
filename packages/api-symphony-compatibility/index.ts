import { map } from './src/mapping';

const ssf = (window as any).ssf;
const api = (ssf && ssf.registerBoundsChange)
    ? ssf
    : map.ssf;

// The current Symphony UI reuqires that the API is present within the SYM_API namespace, although SymphonyElecrtong supports both
// Https://github.com/symphonyoss/SymphonyElectron/blob/299e75eca328375468cc3d0bf34ae9ca73e445f6/js/preload/preloadMain.js#L229
(window as any).SYM_API = api;

/* tslint:disable:no-default-export */
export default api;
/* tslint:enable:no-default-export */

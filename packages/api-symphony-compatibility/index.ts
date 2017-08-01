import { map } from './src/mapping';

const ssf = (window as any).ssf;
const api = (ssf && ssf.registerBoundsChange)
    ? ssf
    : map.ssf;

/* tslint:disable:no-default-export */
export default api;
/* tslint:enable:no-default-export */

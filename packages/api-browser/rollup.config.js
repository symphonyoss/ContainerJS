import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'build/es/index.js',
  format: 'umd',
  moduleName: 'ssf',
  plugins: [resolve()],
  dest: 'build/dist/containerjs-api.js'
};

import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'index.js',
  format: 'umd',
  moduleName: 'ssf',
  plugins: [resolve()],
  dest: 'dist/ssf-desktop-api.js'
};

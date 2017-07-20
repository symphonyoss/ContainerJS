import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'build/es/index.js',
  format: 'umd',
  moduleName: 'ssf',
  dest: 'build/dist/containerjs-api.js',
  plugins: [
    resolve({
      jsnext: true,
      main: true
    })
  ]
};

import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'lib/preload.js',
  format: 'umd',
  moduleName: 'ssf',
  dest: 'dist/containerjs-api.js',
  plugins: [
    commonjs({
      ignore: ['electron']
    })
  ]
};

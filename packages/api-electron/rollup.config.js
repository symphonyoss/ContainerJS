import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'preload.js',
  format: 'umd',
  moduleName: 'ssf',
  dest: 'dist/containerjs-api.js',
  plugins: [
    commonjs({
      ignore: ['electron']
    })
  ]
};

import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'build/es/preload.js',
  format: 'umd',
  moduleName: 'ssf',
  dest: 'build/dist/containerjs-api.js',
  plugins: [
    commonjs({
      ignore: ['electron']
    })
  ]
};

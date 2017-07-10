import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'build/es/preload.js',
  format: 'umd',
  moduleName: 'ssf',
  dest: 'build/dist/containerjs-api.js',
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true
    }),
    
    commonjs({
      ignore: ['electron']
    })
  ]
};

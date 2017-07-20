import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'bundle.js',
  moduleName: 'ssf',
  format: 'umd',
  plugins: [
    resolve({
      module: true,
      main: true,
      browser: false,
      jsnext: true
    }),
    commonjs({
      include: '**'
    })
  ],
  dest: 'build/dist/containerjs-api.js'
};

import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'index.js',
  moduleName: 'ssf',
  format: 'umd',
  plugins: [
    resolve({
      module: true,
      main: false,
      browser: false,
      jsnext: true
    }),
    commonjs({
      include: '**'
    })
  ],
  dest: 'build/containerjs-bundle.js'
};

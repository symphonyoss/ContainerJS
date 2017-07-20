// import resolve from 'rollup-plugin-node-resolve';
// import commonjs from 'rollup-plugin-commonjs';

// export default {
//   entry: 'bundle.js',
//   moduleName: 'ssf',
//   format: 'umd',
//   plugins: [
//     resolve({
//       module: true,
//       main: true,
//       browser: false,
//       jsnext: true
//     }),
//     commonjs({
//       include: '**'
//     })
//   ],
//   dest: 'build/dist/containerjs-api.js'
// };

import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'build/es/index.js',
  format: 'umd',
  moduleName: 'ssf',
  plugins: [resolve()],
  dest: 'build/dist/containerjs-api.js'
};

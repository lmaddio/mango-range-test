import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer';

import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'public/bundle.js',
      format: 'iife',
      sourcemap: true
    },
    plugins: [
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify(
          process.env.NODE_ENV || 'development'
        )
      }),
      babel({
        babelrc: false,
        babelHelpers: 'bundled',
        presets: ['@babel/preset-react'],
      }),
      resolve({
        browser: true,
        extensions: ['.js'],
        dedupe: [ 'react', 'react-dom' ]
      }),
      commonjs(),
      postcss({
        extract: true,
        modules: false,
        minimize: process.env.NODE_ENV === 'production',
        plugins: [
          autoprefixer
        ],
        extensions: ['.css'],
        verbose: true
      })].concat(process.env.NODE_ENV === 'production' ? [
        terser()
      ] : [
        serve({
          open: true,
          verbose: true,
          contentBase: ['', 'public'],
          host: 'localhost',
          port: 4005,
          historyApiFallback: true
        }),
        livereload({ watch: 'public' }),
      ]
    )
  }
];

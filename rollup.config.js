import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import { babel } from '@rollup/plugin-babel';
import serve from 'rollup-plugin-dev';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';

export default {
  input: 'src/index.tsx',
  output: {
    dir: 'dist',
    format: 'commonjs',
    sourcemap: true,
    preserveModules: false,
    entryFileNames: '[name].js',
  },
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs({
      include: /node_modules/,
      requireReturnsDefault: 'auto',
      transformMixedEsModules: true,
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: './dist/types',
      emitDeclarationOnly: false,
      sourceMap: true,
      inlineSources: true,
      outputToFilesystem: true,
    }),
    babel({
      babelHelpers: 'bundled',
      presets: [
        ['@babel/preset-env', { targets: { browsers: 'last 2 versions' } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript',
      ],
      plugins: [],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      exclude: 'node_modules/**',
    }),
    postcss({
      modules: true,
      extract: true,
      minimize: true,
    }),
    copy({
      targets: [
        { src: 'public/*', dest: 'dist' },
      ],
    }),
    serve({
      dirs: ['dist'],
      host: 'localhost',
      port: 3000,
    }),
  ],
  onwarn(warning, warn) {
    // Ignore "use client" directive warnings
    if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('"use client"')) {
      return;
    }
    // Ignore "Root file specified for compilation" typescript warnings
    if (warning.plugin === 'typescript' && warning.message.includes('Root file specified for compilation')) {
      return;
    }
    warn(warning);
  }
}; 
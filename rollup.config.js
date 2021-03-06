import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import sveltePreprocess from 'svelte-preprocess';
import { config } from 'dotenv';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';

const production = !process.env.ROLLUP_WATCH;

if (process.env.LOCAL) {
  config({ path: '.env.local' });
} else {
  config();
}

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn(
        'npm',
        ['run', 'start', '--', '--dev'],
        {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true,
        }
      );

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    },
  };
}

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/build/bundle.js',
  },
  plugins: [
    replace({
      // stringify the object
      DB_URL: JSON.stringify(process.env.DB_URL),
      preventAssignment: true,
    }),
    alias({
      entries: [
        { find: 'fp', replacement: __dirname + '/src/fp' },
        { find: 'view', replacement: __dirname + '/src/view' },
        { find: 'app', replacement: __dirname + '/src/app' },
        { find: 'test', replacement: __dirname + '/src/test' },
      ],
    }),
    svelte({
      preprocess: sveltePreprocess({ postcss: true }),
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: 'bundle.css' }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ['svelte'],
      preferBuiltins: false,
    }),
    commonjs(),

    builtins(),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser({ compress: { evaluate: false } }),
  ],
  watch: {
    clearScreen: false,
  },
};

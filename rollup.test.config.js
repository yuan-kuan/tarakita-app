import { config } from 'dotenv';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';

// if (process.env.LOCAL) {
//   config({ path: '.env.local' });
// } else {
//   config();
// }
config({ path: '.env.local' });

export default {
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
      ],
    }),
  ],
};

import daggy from 'daggy';
import Future from 'fluture';
import page from 'page';
import { Path } from 'path-parser';

import * as free from 'fp/free';
import { addSop } from 'fp/sop';
import { goToAskerPage } from 'app/asker';
import { goToHomePage } from 'app/home';

const Navigation = daggy.taggedSum('Navigation', {
  Show: ['path', 'params'],
});
// @ts-ignore
const { Show } = Navigation;

const nagivationToFuture = (p) =>
  p.cata({
    Show: (path, params) =>
      Future((reject, resolve) => {
        try {
          const newPath = new Path(path).build(params, { ignoreConstraints: true });

          if (newPath != page.current) {
            // @ts-ignore wrong type definition version?
            page.show(newPath, page.prevContext, false, true);
          }

          resolve(newPath);
        } catch (error) {
          reject(`Navigation error: ${error} when path is ${path} and params are ${JSON.stringify(params)}`);
        }
        return () => { };
      }),
  });

const setUrl = (path, params) => free.lift(Show(path, params));

const homePath = '/';
const askerPath = '/asker';

const setHomeUrl = () => setUrl(homePath);
const setAskerUrl = () => setUrl(askerPath);
//const setItemUrl = (itemId) => setUrl(itemPath, { 'itemId': encodeURIComponent(itemId) });

function start() {
  page('/', () => {
    addSop(() => goToHomePage());
  });

  page(askerPath, (ctx) => {
    addSop(() => goToAskerPage());
  });

//  page(itemPath, (ctx) => {
//    addSop(() => goToItem(ctx.params.itemId));
//  });

  page('*', () => {
    console.error('Unknown path');
  });
  page();
}

export const navigationInterpretor = [Navigation, nagivationToFuture];
export { start, setHomeUrl, setAskerUrl };

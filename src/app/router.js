import daggy from 'daggy';
import Future from 'fluture';
import page from 'page';
import { Path } from 'path-parser';

import * as free from 'fp/free';
import { addSop } from 'fp/sop';
import { goToAskerPage } from 'app/asker';
import { goToHomePage, goToQuestion, goToComment } from 'app/home';
import { goToRegisterPage } from 'app/user';

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
          const newPath = new Path(path).build(params, {
            ignoreConstraints: true,
          });

          if (newPath != page.current) {
            // @ts-ignore wrong type definition version?
            page.show(newPath, page.prevContext, false, true);
          }

          resolve(newPath);
        } catch (error) {
          reject(
            `Navigation error: ${error} when path is ${path} and params are ${JSON.stringify(
              params
            )}`
          );
        }
        return () => {};
      }),
  });

const setUrl = (path, params) => free.lift(Show(path, params));

const homePath = '/';
const askerPath = '/asker';
const registerPath = '/register';
const questionPath = '/q/:id';
const commentPath = '/q/:id/c';

const setHomeUrl = () => setUrl(homePath);
const setAskerUrl = () => setUrl(askerPath);
const setRegisterUrl = () => setUrl(registerPath);
const setQuestionUrl = (id) =>
  setUrl(questionPath, { id: encodeURIComponent(id) });
const setCommentUrl = (id) =>
  setUrl(commentPath, { id: encodeURIComponent(id) });
//const setItemUrl = (itemId) => setUrl(itemPath, { 'itemId': encodeURIComponent(itemId) });

function start() {
  page('/', () => {
    addSop(() => goToHomePage());
  });

  page(askerPath, (ctx) => {
    addSop(() => goToAskerPage());
  });

  page(registerPath, (ctx) => {
    addSop(() => goToRegisterPage());
  });

  page(questionPath, (ctx) => {
    addSop(() => goToQuestion(ctx.params.id));
  });

  page(commentPath, (ctx) => {
    addSop(() => goToComment(ctx.params.id));
  });

  page('*', () => {
    console.error('Unknown path');
  });
  page();
}

export const navigationInterpretor = [Navigation, nagivationToFuture];
export { start, setHomeUrl, setAskerUrl, setQuestionUrl, setRegisterUrl, setCommentUrl };

import * as R from 'ramda';

import * as free from 'fp/free';
import * as kv from 'app/kv';
import { setRef } from 'fp/ref';
import { addSop } from 'fp/sop';
import { viewMainPage} from 'view/view';
import * as router from 'app/router';
import { randomFourCharacter, tapLog } from 'app/utils';
import { UserStores } from 'app/stores';

import Register from 'view/Register.svelte';
import { goToHomePage } from './home';

const C = {
  previousUserKey: 'tka_previous_user',
};

const L = {
  id: R.lensProp('_id'),
  name: R.lensProp('name'),
};


const shuffleArray = (arr) =>
  arr.sort(() => Math.random() - 0.5);

const pickRandomFour = 
  R.pipe(
    R.replace(/[ ]/g, ''),
    R.split(''),
    shuffleArray,
    R.take(4),
    R.join(''),
  );

const generateHardId = (userFormData) =>
  free.of(userFormData)
    .map(R.view(L.name))
    .map(pickRandomFour)
    .map(R.curry((a,b) => a.concat(b)))
    .ap(randomFourCharacter())

const addId = (userFormData) =>
  free.of(userFormData)
    .chain(generateHardId)
    .map(R.set(L.id))
    .ap(free.of(userFormData))

const hasPreviousUser = () => loadPreviousUser().map(R.complement(R.isNil))

const loadPreviousUser = () => kv.get(null, C.previousUserKey); 

const createAndSave = (userFormData) =>
  free.of(userFormData)
    .chain(addId)
    .chain(kv.set(C.previousUserKey))

const performRegister = (userFormData) =>
  free.sequence([
    createAndSave(userFormData),
    goToHomePage()
  ]);
    

const goToRegisterPage = () =>
  free.sequence([
    viewMainPage(Register),
    router.setRegisterUrl(),
    setRef(UserStores.performRegister, (userJson) => addSop(() => performRegister(userJson))) 
  ]);

export {createAndSave, loadPreviousUser, hasPreviousUser, goToRegisterPage};

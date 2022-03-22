import * as R from 'ramda';
import * as free from 'fp/free';
import * as db from 'app/database';

const dbUrl = 'http://localhost:5984/tka_1';

const downloadQuestion = () => {};

const uploadDesignDoc = () => {
  const replicationFilter = {
    _id: '_design/replicate',
    filters: {
      question: function (doc) {
        return doc.type == 'question' || doc.type == 'venue';
      }.toString(),
      answer: function (doc, req) {
        return doc.type == 'answer' && doc.user == req.user;
      }.toString(),
    }
  };

  return free.of(replicationFilter)
    .chain(db.put)
    .call(free.bimap(
      R.identity, R.identity
    ));
};

const uploadQuestion = () => 
  free.sequence([
    uploadDesignDoc(),
    db.replicateTo(dbUrl, {filter: 'replicate/question'}) 
  ]); 


const uploadAnswer = () => {};

export {downloadQuestion, uploadQuestion, uploadAnswer};

var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient,
    user;
MongoClient.connect(require('../config.js').mongodb.uri, function(err, db) {
  console.log("MongoDB connect success!");
  user = db.collection('user');
});

router.post('/login', function(req, res, next) {
  user.findOne({
    student: req.body.student,
  }, function(err, doc) {
    if (!doc) {
      res.redirect('/?noStudent=true');
    } else {
      if (req.body.id != doc['id'].substr(doc['id'].length - 8, 8)) {
        res.redirect('/?idNotMatch=true');
      } else {
        req.session.student = req.body.student;
        req.session.role = 's';
        if (doc['question']) {
          req.session.question = doc['question'];
        } else {
          req.session.question = 1;
          if (req.body['email']) {
            user.update({student: req.body.student}, {'$set': {
              email: req.body['email']
            }}, function(err, res){});
          }
          res.redirect('/intro1');
          return;
        }
        if (!doc['148']) {
          res.redirect('/question');
        } else if (req.session.role == 'b') {
          res.redirect('/result');
        } else if (!doc['244']) {
          res.redirect('/question');
        } else {
          res.redirect('/result');
        }
      }
    }
  });
});

router.get('/logout', function(req, res, next) {
  delete req.session.student;
  delete req.session.question;
  res.redirect('/');
});

router.post('/submit', function(req, res, next) {
  if (req.body.select) {
    var question_num = req.session.question;
    user.update({student: req.session.student}, {'$set': {
      question: req.session.question,
      [question_num]: req.body.select,
      [question_num + '_time']: new Date().getTime() - req.session.time
    }}, function(err, res){});
    req.session.question += 1;
  }
  if (req.session.question < 148) {
    res.redirect('/question');
  } else if (req.session.role == 'b') {
    res.redirect('/result');
  } else if (req.session.question <= 244) {
    res.redirect('/question');
  } else {
    res.redirect('/result');
  }
});

router.post('/yjs_1', function(req, res, next) {
  if (req.body.select) {
    user.update({student: req.session.student}, {'$set': {
      yjs_1: req.body.select
    }}, function(err, res){});
  }
  res.redirect('/yjs2');
});

router.post('/yjs_2', function(req, res, next) {
  if (req.body.select) {
    user.update({student: req.session.student}, {'$set': {
      yjs_2: req.body.select
    }}, function(err, res){});
  }
  req.session.question = 1;
  res.redirect('/question');
});


module.exports = router;

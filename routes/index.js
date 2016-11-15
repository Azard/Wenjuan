var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient,
    user;
MongoClient.connect(require('../config.js').mongodb.uri, function(err, db) {
  console.log("MongoDB connect success!");
  user = db.collection('user');
});

var question = require('../question').question;

router.get('/', function(req, res, next) {
  res.render('index', {noStudent: req.query.noStudent, idNotMatch: req.query.idNotMatch});
});

router.get('/intro1', function(req, res, next) {
  res.render('intro1', {role: req.session.role});
});

router.get('/intro2', function(req, res, next) {
  res.render('intro2', {role: req.session.role});
});

router.get('/intro3', function(req, res, next) {
  res.render('intro3', {role: req.session.role});
});

router.get('/intro4', function(req, res, next) {
  res.render('intro4', {role: req.session.role});
});

router.get('/yjs1', function(req, res, next) {
  res.render('yjs1');
});

router.get('/yjs2', function(req, res, next) {
  res.render('yjs2');
});

router.get('/question', function(req, res, next) {
  if (!req.session.student) {
    res.redirect('/');
    return;
  }
  if ((req.session.question > 148 && req.session.role == "b") || (req.session.question > 244 && req.session.role == "s")) {
    res.redirect('/result');
    return;
  }

  req.session.time = new Date().getTime();
  res.render('question', {
    student: req.session.student,
    num: req.session.question,
    question: question[req.session.question],
    role: req.session.role
  });
});

router.get('/result', function(req, res, next) {
  if (!req.session.question || (req.session.role == "b" && req.session.question < 148) || (req.session.role == "s" && req.session.question < 244)) {
    res.redirect('/question');
    return;
  }

  if (req.session.role == 's') {
    user.findOne({
      student: req.session.student,
    }, function(err, doc) {
      res.render('result', {
        student: req.session.student,
        role: req.session.role,
        comment_A: partA(doc, req.session.student),
        comment_B: partB(doc, req.session.student),
        comment_C: partC(doc, req.session.student),
        comment_D: partD(doc, req.session.student),
        comment_E: partE(doc, req.session.student),
        comment_F: partF(doc, req.session.student),
        comment_jyb: jyb(doc, req.session.student)
      });
    });
  } else {
    user.findOne({
      student: req.session.student,
    }, function(err, doc) {
      res.render('result', {
        student: req.session.student,
        role: req.session.role,
        comment_A: partA(doc, req.session.student),
        comment_B: partB(doc, req.session.student),
        comment_C: partC(doc, req.session.student),
        comment_D: partD(doc, req.session.student),
        comment_E: partE(doc, req.session.student),
        comment_F: partF(doc, req.session.student)
      });
    });
  }



});

var partA = function(doc, student) {
  var score_A = {
    score_A_sport: evaluate_A(doc['1']) + evaluate_A(doc['6']) + evaluate_A(doc['11']) + evaluate_A(doc['16']) + evaluate_A(doc['21']) + evaluate_A(doc['26']),
    score_A_music_feel: evaluate_A(doc['2']) + evaluate_A(doc['7']) + evaluate_A(doc['12']) + evaluate_A(doc['17']) + evaluate_A(doc['22']) + evaluate_A(doc['27']),
    score_A_social: evaluate_A(doc['3']) + evaluate_A(doc['8']) + evaluate_A(doc['13']) + evaluate_A(doc['18']) + evaluate_A(doc['23']) + evaluate_A(doc['28']),
    score_A_music_express: evaluate_A(doc['4']) + evaluate_A(doc['9']) + evaluate_A(doc['14']) + evaluate_A(doc['19']) + evaluate_A(doc['24']) + evaluate_A(doc['29']),
    score_A_mentality: evaluate_A(doc['5']) + evaluate_A(doc['10']) + evaluate_A(doc['15']) + evaluate_A(doc['20']) + evaluate_A(doc['25']) + evaluate_A(doc['30'])
  };
  user.update({student: student}, {'$set': score_A}, function(err, res){});
  var comment_A = {};

  if (score_A.score_A_sport >= 28) comment_A['sport'] = '重视体育运动，身体条件很好，可喜可贺';
  else if (score_A.score_A_sport >= 22) comment_A['sport'] = '比较重视体育运动，身体较好。祝贺你';
  else if (score_A.score_A_sport >= 15) comment_A['sport'] = '身体活动水平或者身体能力中等。可适度关注自己的运动和生活习惯，保持身体健康水平';
  else if (score_A.score_A_sport >= 9) comment_A['sport'] = '身体活动水平，或者身体能力较弱。建议养成健康的运动和生活习惯，提高健康水平';
  else comment_A['sport'] = '很不重视体育运动，或者身体能力很弱。建议你科学锻炼身体，培养健康的生活习惯，提高健康水平';

  if (score_A.score_A_music_feel >= 28) comment_A['music_feel'] = '日常生活中充满了浓厚的音乐气氛';
  else if (score_A.score_A_music_feel >= 22) comment_A['music_feel'] = '日常生活中的音乐气氛比较浓厚';
  else if (score_A.score_A_music_feel >= 15) comment_A['music_feel'] = '音乐在日常生活中发挥了一定的作用';
  else if (score_A.score_A_music_feel >= 9) comment_A['music_feel'] = '日常生活中比较缺乏音乐的调剂作用，建议加强';
  else comment_A['music_feel'] = '日常生活中音乐的气息很少，建议逐步养成欣赏音乐的习惯';

  if (score_A.score_A_social >= 28) comment_A['social'] = '很活跃的社交达人';
  else if (score_A.score_A_social >= 22) comment_A['social'] = '比较重视社交活动，社交能力较强';
  else if (score_A.score_A_social >= 15) comment_A['social'] = '社会交往倾向中等';
  else if (score_A.score_A_social >= 9) comment_A['social'] = '不太重视群体性社交活动';
  else comment_A['social'] = '离群索居，社交程度很低';

  if (score_A.score_A_music_express >= 28) comment_A['music_express'] = '音乐的抒发和表现能力很强';
  else if (score_A.score_A_music_express >= 22) comment_A['music_express'] = '音乐的抒发和表现能力较强';
  else if (score_A.score_A_music_express >= 15) comment_A['music_express'] = '音乐的抒发和表现能力中等';
  else if (score_A.score_A_music_express >= 9) comment_A['music_express'] = '音乐的抒发和表现能力较弱';
  else comment_A['music_express'] = '音乐的抒发和表现能力很弱';

  if (score_A.score_A_mentality >= 28) comment_A['mentality'] = '拥有一个亲密友善的核心朋友圈，请继续保持';
  else if (score_A.score_A_mentality >= 22) comment_A['mentality'] = '核心朋友圈关系较好，请继续保持';
  else if (score_A.score_A_mentality >= 15) comment_A['mentality'] = '亲朋好友对你的生活有一定的支持，请你继续发扬广大';
  else if (score_A.score_A_mentality >= 9) comment_A['mentality'] = '来自核心朋友圈的支持欠佳，请注意改善';
  else comment_A['mentality'] = '社会支持严重缺乏，急需建立高质量的核心朋友圈';

  return comment_A;
};

var evaluate_A = function(select) {
  switch(select) {
    case 'A': return 5;
    case 'B': return 4;
    case 'C': return 3;
    case 'D': return 2;
    case 'E': return 1;
    default: return 0;
  }
};


var partB = function(doc, student) {
  var score_B = {
    score_B_freedom: evaluate_B_reverse(doc['31']) + evaluate_B_reverse(doc['40']) + evaluate_B_reverse(doc['42']) + evaluate_B(doc['48']) + evaluate_B_reverse(doc['56']),
    score_B_power: evaluate_B_reverse(doc['32']) + evaluate_B_reverse(doc['36']) + evaluate_B_reverse(doc['43']) + evaluate_B_reverse(doc['51']) + evaluate_B(doc['57']) + evaluate_B(doc['60']),
    score_B_duty: evaluate_B(doc['33']) + evaluate_B(doc['44']) + evaluate_B_reverse(doc['50']) + evaluate_B_reverse(doc['52']) + evaluate_B_reverse(doc['58']) + evaluate_B_reverse(doc['61']),
    score_B_fair: evaluate_B(doc['34']) + evaluate_B_reverse(doc['37']) + evaluate_B(doc['41']) + evaluate_B_reverse(doc['45']) + evaluate_B(doc['49']) + evaluate_B_reverse(doc['55']),
    score_B_legal: evaluate_B(doc['35']) + evaluate_B(doc['46']) + evaluate_B(doc['54']) + evaluate_B_reverse(doc['59']) + evaluate_B(doc['62']),

    score_B_8: evaluate_B(doc['8']),
    score_B_9: evaluate_B(doc['9']),
    score_B_17: evaluate_B(doc['17']),
    score_B_23: evaluate_B(doc['23']),
    score_B_33: evaluate_B(doc['33']),
  };
  user.update({student: student}, {'$set': score_B}, function(err, res){});
  var comment_B = {};

  if (score_B.score_B_freedom >= 20) comment_B['freedom'] = '非常看重个人自由，不愿意受到限制';
  else if (score_B.score_B_freedom >= 13) comment_B['freedom'] = '希望有些自由，也愿意受到一些限制';
  else comment_B['freedom'] = '对个人自由的要求不高';

  if (score_B.score_B_power >= 27) comment_B['power'] = '比较注意维护个人利益';
  else if (score_B.score_B_power >= 19) comment_B['power'] = '维护个人利益的意愿处于人群普通水平';
  else comment_B['power'] = '不大注意维护个人利益';

  if (score_B.score_B_duty >= 32) comment_B['duty'] = '有很强的社会责任感';
  else if (score_B.score_B_duty >= 25) comment_B['duty'] = '有一定的社会责任感';
  else comment_B['duty'] = '社会责任感较弱';

  if (score_B.score_B_fair >= 32) comment_B['fair'] = '有很强的公平意识';
  else if (score_B.score_B_fair >= 23) comment_B['fair'] = '有一定的公平意识';
  else comment_B['fair'] = '不太看重公平';

  if (score_B.score_B_legal >= 21) comment_B['legal'] = '有很强的遵守规则意识';
  else if (score_B.score_B_legal >= 16) comment_B['legal'] = '有一定的规则规范意识';
  else comment_B['legal'] = '对抗规则的倾向比较明显';

  return comment_B;
};

var evaluate_B = function(select) {
  switch(select) {
    case 'A': return 1;
    case 'B': return 2;
    case 'C': return 3;
    case 'D': return 4;
    case 'E': return 5;
    default: return 0;
  }
};

var evaluate_B_reverse = function(select) {
  switch(select) {
    case 'A': return 5;
    case 'B': return 4;
    case 'C': return 3;
    case 'D': return 2;
    case 'E': return 1;
    default: return 0;
  }
};


var partC = function(doc, student) {
  var score_C = {
    score_C_Big_1: evaluate_C(doc['64']) + evaluate_C(doc['65']) + evaluate_C(doc['66']) + evaluate_C(doc['67']) + evaluate_C(doc['68']) + evaluate_C(doc['69']),
    score_C_Big_2: evaluate_C_reverse(doc['70']) + evaluate_C_reverse(doc['71']) + evaluate_C_reverse(doc['72']) + evaluate_C_reverse(doc['73']) + evaluate_C_reverse(doc['74']) + evaluate_C_reverse(doc['75']) + evaluate_C_reverse(doc['76']) + evaluate_C_reverse(doc['77']),
    score_C_Big_3: evaluate_C(doc['78']),
    score_C_valid: evaluate_C_valid(doc['79'])
  };
  user.update({student: student}, {'$set': score_C}, function(err, res){});
  return {};
};

var evaluate_C = function(select) {
  switch(select) {
    case 'A': return 1;
    case 'B': return 2;
    case 'C': return 3;
    case 'D': return 4;
    case 'E': return 5;
    case 'F': return 6;
    default: return 0;
  }
};

var evaluate_C_reverse = function(select) {
  switch(select) {
    case 'A': return 6;
    case 'B': return 5;
    case 'C': return 4;
    case 'D': return 3;
    case 'E': return 2;
    case 'F': return 1;
    default: return 0;
  }
};

var evaluate_C_valid = function(select) {
  switch(select) {
    case 'A': return 1;
    case 'B': return 2;
    case 'C': return 3;
    case 'D': return 4;
    case 'E': return 5;
    case 'F': return 6;
    default: return 0;
  }
};


var partD = function(doc, student) {
  var score_D = {
    score_D_1: evaluate_D(doc['80']) + evaluate_D(doc['81']),
    score_D_2: evaluate_D(doc['82']) + evaluate_D(doc['83']),
    score_D_3: evaluate_D(doc['84']) + evaluate_D(doc['85']) + evaluate_D(doc['86']),
    score_D_4: evaluate_D(doc['87']) + evaluate_D(doc['88']) + evaluate_D(doc['89']),
    score_D_5: evaluate_D(doc['90']) + evaluate_D(doc['91']) + evaluate_D(doc['92']),
    score_D_6: evaluate_D(doc['93']) + evaluate_D(doc['94']) + evaluate_D(doc['95']),
    score_D_valid: evaluate_D(doc['96'])
  };
  score_D['score_D_total'] = score_D.score_D_1 + score_D.score_D_2 + score_D.score_D_3 + score_D.score_D_4 + score_D.score_D_5 + score_D.score_D_6;
  user.update({student: student}, {'$set': score_D}, function(err, res){});

  var comment_D = {};
  if (score_D.score_D_total >= 79) comment_D['shame'] = '脸皮很薄，很容易产生羞耻感';
  else if (score_D.score_D_total >= 59) comment_D['shame'] = '羞耻之心在人群中处于一般水平';
  else comment_D['shame'] = '跟大多数人相比不容易产生羞耻感';

  return comment_D;
};

var evaluate_D = function(select) {
  switch(select) {
    case 'A': return 5;
    case 'B': return 4;
    case 'C': return 3;
    case 'D': return 2;
    case 'E': return 1;
    default: return 0;
  }
};


var partE = function(doc, student) {
  var score_E = {
    score_E_cut_class: evaluate_E(doc['97']) + evaluate_E(doc['98']) + evaluate_E(doc['99']) + evaluate_E(doc['100']) + evaluate_E(doc['101']) + evaluate_E(doc['102']) + evaluate_E(doc['103']),
    score_E_cheat: evaluate_E(doc['104']) + evaluate_E(doc['105']) + evaluate_E(doc['106']) + evaluate_E(doc['107']),
    score_E_valid: evaluate_E(doc['108'])
  };
  user.update({student: student}, {'$set': score_E}, function(err, res){});

  var comment_E = {};
  if (score_E.score_E_cut_class >= 30) comment_E['cut_class'] = '非常认可学校教学管理制度';
  else if (score_E.score_E_cut_class >= 23) comment_E['cut_class'] = '比较认可学校的教学管理制度';
  else comment_E['cut_class'] = '对学校的某些教学管理制度不太认可';

  if (score_E.score_E_cheat >= 16) comment_E['cheat'] = '非常认可学校考试管理制度';
  else if (score_E.score_E_cheat >= 13) comment_E['cheat'] = '比较认可学校的考试管理制度';
  else comment_E['cheat'] = '对学校的某些考试管理制度不太认可';

  return comment_E;
};

var evaluate_E = function(select) {
  switch(select) {
    case 'A': return 5;
    case 'B': return 4;
    case 'C': return 3;
    case 'D': return 2;
    case 'E': return 1;
    default: return 0;
  }
};



var partF = function(doc, student) {
  var score_F = {
    score_F_1: evaluate_F(doc['109']) + evaluate_F(doc['114']) + evaluate_F(doc['119']) + evaluate_F_reverse(doc['124']) + evaluate_F(doc['129']) + evaluate_F(doc['134']) + evaluate_F(doc['139']) + evaluate_F(doc['144']),
    score_F_2: evaluate_F_reverse(doc['110']) + evaluate_F(doc['115']) + evaluate_F(doc['120']) + evaluate_F(doc['125']) + evaluate_F(doc['130']) + evaluate_F(doc['135']) + evaluate_F(doc['140']) + evaluate_F(doc['145']),
    score_F_3: evaluate_F(doc['111']) + evaluate_F(doc['116']) + evaluate_F(doc['121']) + evaluate_F_reverse(doc['126']) + evaluate_F_reverse(doc['131']) + evaluate_F(doc['136']) + evaluate_F_reverse(doc['141']) + evaluate_F(doc['146']),
    score_F_4: evaluate_F(doc['112']) + evaluate_F(doc['117']) + evaluate_F(doc['122']) + evaluate_F(doc['127']) + evaluate_F(doc['132']) + evaluate_F(doc['137']) + evaluate_F(doc['142']) + evaluate_F(doc['147']),
    score_F_5: evaluate_F(doc['113']) + evaluate_F_reverse(doc['118']) + evaluate_F_reverse(doc['123']) + evaluate_F(doc['128']) + evaluate_F(doc['133']) + evaluate_F(doc['138']) + evaluate_F(doc['143']) + evaluate_F(doc['148']),
  };
  user.update({student: student}, {'$set': score_F}, function(err, res){});
  var comment_F = {};

  if (score_F.score_F_1 >= 41) comment_F['no1'] = '心理压力很大';
  else if (score_F.score_F_1 >= 33) comment_F['no1'] = '心理压力较大';
  else if (score_F.score_F_1 >= 24) comment_F['no1'] = '心理压力值处于人群平均水平范围';
  else if (score_F.score_F_1 >= 16) comment_F['no1'] = '心理压力值低于人群的平均水平';
  else comment_F['no1'] = '心理压力很小';

  if (score_F.score_F_2 >= 41) comment_F['no2'] = '很认真很严谨';
  else if (score_F.score_F_2 >= 33) comment_F['no2'] = '比较认真严谨';
  else if (score_F.score_F_2 >= 24) comment_F['no2'] = '认真严谨程度处于人群平均水平范围';
  else if (score_F.score_F_2 >= 16) comment_F['no2'] = '做事认真严谨程度稍差';
  else comment_F['no2'] = '做事认真严谨程度很差';

  if (score_F.score_F_3 >= 41) comment_F['no3'] = '与人交往宜人性程度很高';
  else if (score_F.score_F_3 >= 33) comment_F['no3'] = '与人交往宜人性程度较高';
  else if (score_F.score_F_3 >= 24) comment_F['no3'] = '与人交往宜人性程度处于人群平均水平范围';
  else if (score_F.score_F_3 >= 16) comment_F['no3'] = '与人交往宜人性程度稍低';
  else comment_F['no3'] = '与人交往宜人性程度很低，同你打交道的人常会感觉不舒服';

  if (score_F.score_F_4 >= 41) comment_F['no4'] = '思想观念开放性很高';
  else if (score_F.score_F_4 >= 33) comment_F['no4'] = '思想观念开放程度较高';
  else if (score_F.score_F_4 >= 24) comment_F['no4'] = '思想观念开放程度处于人群平均水平范围';
  else if (score_F.score_F_4 >= 16) comment_F['no4'] = '略微有点保守，思想观念开放程度较低';
  else comment_F['no4'] = '很保守，思想观念开放程度很低';

  if (score_F.score_F_5 >= 41) comment_F['no5'] = '非常外向';
  else if (score_F.score_F_5 >= 33) comment_F['no5'] = '比较外向';
  else if (score_F.score_F_5 >= 24) comment_F['no5'] = '内外向程度中等';
  else if (score_F.score_F_5 >= 16) comment_F['no5'] = '比较内向';
  else comment_F['no5'] = '很内向';

  return comment_F;
};

var evaluate_F = function(select) {
  switch(select) {
    case 'A': return 1;
    case 'B': return 2;
    case 'C': return 3;
    case 'D': return 4;
    case 'E': return 5;
    case 'F': return 6;
    default: return 0;
  }
};

var evaluate_F_reverse = function(select) {
  switch(select) {
    case 'A': return 6;
    case 'B': return 5;
    case 'C': return 4;
    case 'D': return 3;
    case 'E': return 2;
    case 'F': return 1;
    default: return 0;
  }
};


var evaluate_jyb = function(select) {
  switch(select) {
    case 'A': return 1;
    case 'B': return 2;
    case 'C': return 3;
    case 'D': return 4;
    default: return 0;
  }
};

var b = 148;

var jyb = function(doc, student) {
  var score_jyb = {
    score_jyb_3_love: evaluate_jyb(doc[(b+4).toString()]) + evaluate_jyb(doc[(b+12).toString()]) + evaluate_jyb(doc[(b+13).toString()]) + evaluate_jyb(doc[(b+19).toString()]),
    score_jyb_3_job: evaluate_jyb(doc[(b+2).toString()]) + evaluate_jyb(doc[(b+10).toString()]) + evaluate_jyb(doc[(b+17).toString()]) + evaluate_jyb(doc[(b+18).toString()]),
    score_jyb_3_study: evaluate_jyb(doc[(b+3).toString()]) + evaluate_jyb(doc[(b+7).toString()]) + evaluate_jyb(doc[(b+14).toString()]) + evaluate_jyb(doc[(b+16).toString()]),
    score_jyb_3_people: evaluate_jyb(doc[(b+8).toString()]) + evaluate_jyb(doc[(b+9).toString()]) + evaluate_jyb(doc[(b+11).toString()]) + evaluate_jyb(doc[(b+15).toString()]),
    score_jyb_3_school: evaluate_jyb(doc[(b+1).toString()]) + evaluate_jyb(doc[(b+5).toString()]) + evaluate_jyb(doc[(b+6).toString()]) + evaluate_jyb(doc[(b+20).toString()]),
    score_jyb_2_sleep: evaluate_jyb(doc[(b+56).toString()]) + evaluate_jyb(doc[(b+67).toString()]) + evaluate_jyb(doc[(b+79).toString()]) + evaluate_jyb(doc[(b+88).toString()]),
    score_jyb_2_eat: evaluate_jyb(doc[(b+23).toString()]) + evaluate_jyb(doc[(b+38).toString()]) + evaluate_jyb(doc[(b+66).toString()]) + evaluate_jyb(doc[(b+86).toString()]),
    score_jyb_2_hurt: evaluate_jyb(doc[(b+27).toString()]) + evaluate_jyb(doc[(b+49).toString()]) + evaluate_jyb(doc[(b+51).toString()]) + evaluate_jyb(doc[(b+62).toString()]),
    score_jyb_2_net: evaluate_jyb(doc[(b+34).toString()]) + evaluate_jyb(doc[(b+36).toString()]) + evaluate_jyb(doc[(b+43).toString()]) + evaluate_jyb(doc[(b+72).toString()]) + evaluate_jyb(doc[(b+75).toString()]),
    score_jyb_2_force: evaluate_jyb(doc[(b+26).toString()]) + evaluate_jyb(doc[(b+57).toString()]) + evaluate_jyb(doc[(b+63).toString()]) + evaluate_jyb(doc[(b+78).toString()]),
    score_jyb_2_impulse: evaluate_jyb(doc[(b+25).toString()]) + evaluate_jyb(doc[(b+50).toString()]) + evaluate_jyb(doc[(b+59).toString()]) + evaluate_jyb(doc[(b+65).toString()]),
    score_jyb_2_attack: evaluate_jyb(doc[(b+32).toString()]) + evaluate_jyb(doc[(b+41).toString()]) + evaluate_jyb(doc[(b+52).toString()]) + evaluate_jyb(doc[(b+81).toString()]),
    score_jyb_2_rely: evaluate_jyb(doc[(b+44).toString()]) + evaluate_jyb(doc[(b+54).toString()]) + evaluate_jyb(doc[(b+58).toString()]) + evaluate_jyb(doc[(b+87).toString()]),
    score_jyb_2_body: evaluate_jyb(doc[(b+33).toString()]) + evaluate_jyb(doc[(b+68).toString()]) + evaluate_jyb(doc[(b+70).toString()]) + evaluate_jyb(doc[(b+71).toString()]),
    score_jyb_2_social_afraid: evaluate_jyb(doc[(b+29).toString()]) + evaluate_jyb(doc[(b+60).toString()]) + evaluate_jyb(doc[(b+69).toString()]) + evaluate_jyb(doc[(b+85).toString()]),
    score_jyb_2_sensitive: evaluate_jyb(doc[(b+21).toString()]) + evaluate_jyb(doc[(b+22).toString()]) + evaluate_jyb(doc[(b+76).toString()]) + evaluate_jyb(doc[(b+82).toString()]),
    score_jyb_2_zibei: evaluate_jyb(doc[(b+35).toString()]) + evaluate_jyb(doc[(b+48).toString()]) + evaluate_jyb(doc[(b+61).toString()]) + evaluate_jyb(doc[(b+74).toString()]) + evaluate_jyb(doc[(b+83).toString()]),
    score_jyb_2_pianzhi: evaluate_jyb(doc[(b+24).toString()]) + evaluate_jyb(doc[(b+39).toString()]) + evaluate_jyb(doc[(b+46).toString()]) + evaluate_jyb(doc[(b+47).toString()]),
    score_jyb_2_yiyu: evaluate_jyb(doc[(b+28).toString()]) + evaluate_jyb(doc[(b+31).toString()]) + evaluate_jyb(doc[(b+37).toString()]) + evaluate_jyb(doc[(b+40).toString()]) + evaluate_jyb(doc[(b+64).toString()]),
    score_jyb_2_jiaolv: evaluate_jyb(doc[(b+45).toString()]) + evaluate_jyb(doc[(b+53).toString()]) + evaluate_jyb(doc[(b+73).toString()]) + evaluate_jyb(doc[(b+77).toString()]),
    score_jyb_1_huanjue: Math.max(evaluate_jyb(doc[(b+89).toString()]), evaluate_jyb(doc[(b+90).toString()]), evaluate_jyb(doc[(b+95).toString()]), evaluate_jyb(doc[(b+96).toString()])),
    score_jyb_1_zisha: Math.max(evaluate_jyb(doc[(b+91).toString()]), evaluate_jyb(doc[(b+92).toString()]), evaluate_jyb(doc[(b+93).toString()]), evaluate_jyb(doc[(b+94).toString()])),
    score_jyb_correct: Math.abs(evaluate_jyb(doc[(b+30).toString()]) - evaluate_jyb(doc[(b+52).toString()]))
                      + Math.abs(evaluate_jyb(doc[(b+42).toString()]) - evaluate_jyb(doc[(b+48).toString()]))
                      + Math.abs(evaluate_jyb(doc[(b+55).toString()]) - evaluate_jyb(doc[(b+76).toString()]))
                      + Math.abs(evaluate_jyb(doc[(b+80).toString()]) - evaluate_jyb(doc[(b+85).toString()]))
                      + Math.abs(evaluate_jyb(doc[(b+84).toString()]) - evaluate_jyb(doc[(b+58).toString()]))
  };
  var comment_jyb = {};
  comment_jyb['total'] = '';
  var level_3 = 0;
  var level_2 = 0;
  var level_1 = Math.max(score_jyb.score_jyb_1_huanjue, score_jyb.score_jyb_1_zisha);

  if (score_jyb.score_jyb_3_love >= 10) {comment_jyb['love'] = '有比较明显的恋爱问题困扰;'; comment_jyb.total += comment_jyb['love']; level_3 += 1;}
  if (score_jyb.score_jyb_3_job >= 11) {comment_jyb['job'] = '有比较明显的就业压力问题;'; comment_jyb.total += comment_jyb['job']; level_3 += 1;}
  if (score_jyb.score_jyb_3_study >= 11) {comment_jyb['study'] = '有比较明显的学业压力问题;'; comment_jyb.total += comment_jyb['study']; level_3 += 1;}
  if (score_jyb.score_jyb_3_people >= 10) {comment_jyb['people'] = '有比较明显的人际关系困扰;'; comment_jyb.total += comment_jyb['people']; level_3 += 1;}
  if (score_jyb.score_jyb_3_school >= 10) {comment_jyb['school'] = '有比较明显的学校适应困难;'; comment_jyb.total += comment_jyb['school']; level_3 += 1;}

  if (score_jyb.score_jyb_2_sleep >= 10) {comment_jyb['sleep'] = '有比较明显的睡眠问题;'; comment_jyb.total += comment_jyb['sleep']; level_2 += 1;}
  if (score_jyb.score_jyb_2_eat >= 9) {comment_jyb['eat'] = '有比较明显的进食问题;'; comment_jyb.total += comment_jyb['eat']; level_2 += 1;}
  if (score_jyb.score_jyb_2_hurt >= 8) {comment_jyb['hurt'] = '有比较明显的自伤行为;'; comment_jyb.total += comment_jyb['hurt']; level_2 += 1;}
  if (score_jyb.score_jyb_2_net >= 12) {comment_jyb['net'] = '网瘾分数偏高;'; comment_jyb.total += comment_jyb['net']; level_2 += 1;}
  if (score_jyb.score_jyb_2_force >= 10) {comment_jyb['force'] = '强迫方面得分偏高;'; comment_jyb.total += comment_jyb['force']; level_2 += 1;}
  if (score_jyb.score_jyb_2_impulse >= 10) {comment_jyb['impulse'] = '比较冲动;'; comment_jyb.total += comment_jyb['impulse']; level_2 += 1;}
  if (score_jyb.score_jyb_2_attack >= 9) {comment_jyb['attack'] = '敌对攻击分数偏高;'; comment_jyb.total += comment_jyb['attack']; level_2 += 1;}
  if (score_jyb.score_jyb_2_rely >= 10) {comment_jyb['rely'] = '依赖程度较高;'; comment_jyb.total += comment_jyb['rely']; level_2 += 1;}
  if (score_jyb.score_jyb_2_body >= 9) {comment_jyb['body'] = '躯体化程度较高;'; comment_jyb.total += comment_jyb['body']; level_2 += 1;}
  if (score_jyb.score_jyb_2_social_afraid >= 10) {comment_jyb['social_afraid'] = '社交恐惧程度较高;'; comment_jyb.total += comment_jyb['social_afraid']; level_2 += 1;}
  if (score_jyb.score_jyb_2_sensitive >= 10) {comment_jyb['sensitive'] = '比较敏感;'; comment_jyb.total += comment_jyb['sensitive']; level_2 += 1;}
  if (score_jyb.score_jyb_2_zibei >= 12) {comment_jyb['zibei'] = '自卑感较强;'; comment_jyb.total += comment_jyb['zibei']; level_2 += 1;}
  if (score_jyb.score_jyb_2_pianzhi >= 10) {comment_jyb['pianzhi'] = '偏执分数略高;'; comment_jyb.total += comment_jyb['pianzhi']; level_2 += 1;}
  if (score_jyb.score_jyb_2_yiyu >= 12) {comment_jyb['yiyu'] = '郁郁寡欢的时候有点多;'; comment_jyb.total += comment_jyb['yiyu']; level_2 += 1;}
  if (score_jyb.score_jyb_2_jiaolv >= 9) {comment_jyb['jiaolv'] = '有比较明显的焦虑感;'; comment_jyb.total += comment_jyb['jiaolv']; level_2 += 1;}

  if (comment_jyb.total.indexOf(';') != -1) {
    comment_jyb.total = comment_jyb.total.substring(0, comment_jyb.total.length - 1);
    comment_jyb.total += '。';
  }
  console.log(comment_jyb);


  score_jyb.level_1 = level_1;
  score_jyb.level_2 = level_2;
  score_jyb.level_3 = level_3;
  if (level_1 >= 3 || level_2 >= 1 || level_3 >= 2) {
    score_jyb['need_serve'] = 'y';
    comment_jyb['need_serve'] = 'y';
  } else {
    score_jyb['need_serve'] = 'n';
    comment_jyb['need_serve'] = 'n';
  }


  user.update({student: student}, {'$set': score_jyb}, function(err, res){});
  return comment_jyb;
};

module.exports = router;

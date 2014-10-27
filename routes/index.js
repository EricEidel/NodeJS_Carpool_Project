
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Bluepages Example' , user:req.user});
};

exports.login = function(req, res){
    res.render('login', {title: 'Login', user:req.user ,reason:req.query["reason"]});
};

exports.reports = function(req, res){
  res.render('reports', {title: 'Reports', user:req.user });
};

exports.account = function(req, res){
  res.render('account', {user:req.user});
}
var sys=require('sys');

var listContains = function(list, value){
    for(var p in list)
        if(list[p] === value)
            return true;
    return false;
}

module.exports.isUserNotLoggedIn = function(url){
  var setReturnTo =  true;
  return function(req,res,next){
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      next();
    }
    else{
      return res.redirect(url);
    }
  }
}

module.exports.isMember = function(grps) {
  var url =  '/login';
  var setReturnTo =  true;
  var groups = (grps instanceof Array)? grps : [];
  return function(req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      if (setReturnTo && req.session) {
        req.session.returnTo = req.originalUrl || req.url;
      }
      return res.redirect(url);
    }
    else{
        var isMember = true;
        for(var i=0; i<groups.length; i++){
            if(!listContains(req.user.groups,groups[i]))
                isMember = false;
        }
        if(isMember)
            next();
        else
          res.render("403");
    }
  }
}

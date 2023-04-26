var express = require('express');
var router = express.Router();
var pool=require('./pool')
var LocalStorage=require('node-localstorage').LocalStorage;
localStorage=new LocalStorage('./scratch');

/* GET users listing. */
router.get('/logininterface', function(req, res) {
  res.render('logininterface',{message:''});
});


router.get('/logout', function(req, res) {
  localStorage.clear()
  res.render('logininterface',{message:''});
});



router.post('/chkadmin', function(req, res) {
    pool.query("select * from administrator where (emailid=? or mobilenumber=?) and password=?",[req.body.emailid,req.body.emailid,req.body.pwd],function(error,result){
if(error)
{console.log(error)
    res.render('logininterface',{message:"Server Error..."});
}
else
{
 if(result.length==1)
 { 
 localStorage.setItem("ADMIN",JSON.stringify(result[0]))
 res.render('dashboard',{ 'data': result[0] });
   
 }
 else
 {
    res.render('logininterface',{message:"Invalid Emailid/Mob.no or Password"});
 }   
}

})

});

module.exports = router;

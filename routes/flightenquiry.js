var express=require('express')
var router=express.Router()
var pool=require('./pool')
var upload=require('./multer')
var LocalStorage=require('node-localstorage').LocalStorage;
localStorage=new LocalStorage('./scratch');


router.get('/flightinterface',function(req,res){
     var admin=JSON.parse(localStorage.getItem('ADMIN'))
      if(admin)
      res.render('flightinterface',{message:''})
      else
      res.render('logininterface',{message:''})
}) 





router.get('/displayallflights',function(req,res){
     var admin=JSON.parse(localStorage.getItem('ADMIN'))
     if(!admin)
     res.render('logininterface',{message:''})
     else
    
     pool.query("select F.*,(select C.cityname from cities C where C.cityid=F.sourcecity) as sourcecity,(select C.cityname from cities C where C.cityid=F.destinationcity ) as destinationcity from flightsdetails F ",function(error,result){
          
          if(error)
          {   
               //  console.log(error)
               
               res.render('displayallflights',{'data':[],'message':'Server Error'})
          }
          else
          {
               res.render('displayallflights',{'data':result,'message':'Record Submitted Successfully'})
         
          }
     })
    
}) 


router.get('/edit_flight_data',function(req,res){

     
     pool.query("select F.*,(select C.cityname from cities C where C.cityid=F.sourcecity) as sourcecity,(select C.cityname from cities C where C.cityid=F.destinationcity ) as destinationcity from flightsdetails F where flightid=? ",[req.query.flightid],function(error,result){
          if(error)
          {   
               //  console.log(error)
               res.render('displaybyid',{'data':[],'message':'Server Error'})
          }
          else
          {
               res.render('displaybyid',{'data':result[0],'message':'Record Submitted Successfully'})
         
          }
     })
    
}) 



router.post('/flightsubmit',upload.single('logo'),function(req,res){

     console.log("BODY:",req.body)
     console.log("FILE:",req.file)

     var days=(""+req.body.days).replaceAll("'",'"')
     
     pool.query("insert into flightsdetails (flightname, types, totalseats, days, sourcecity, departuretime, destinationcity, arrivaltime, company, logo)values(?,?,?,?,?,?,?,?,?,?)",[req.body.flightname,req.body.flighttype,req.body.noofseats,days,req.body.sourcecity,req.body.deptime,req.body.destinationcity,req.body.arrtime,req.body.company,req.file.originalname],function(error,result){
     if(error)
     {   
          //  console.log(error)
          res.render('flightinterface',{'message':'Server Error'})
     }
     else
     {
          res.render('flightinterface',{'message':'Record Submitted Successfully'})
    
     }
})
})


router.get('/fetchallcities',function(req,res){
     pool.query("select * from cities",function(error,result){
     if(error)
     {
          res.status(500).json({result:[],message:'Server Error'})
     }
     else
     {
          res.status(200).json({result:result,message:'Success '})

     }

     })
}) 

router.post('/flightedit',function(req,res){

     
    
     if(req.body.btn=='Edit')
     {
      var days=(""+req.body.days).replaceAll("'",'"')
     pool.query("update flightsdetails set flightname=?, types=?, totalseats=?, days=?, sourcecity=?, departuretime=?, destinationcity=?, arrivaltime=?, company=? where flightid=?",[req.body.flightname,req.body.flighttype,req.body.noofseats,days,req.body.sourcecity,req.body.deptime,req.body.destinationcity,req.body.arrtime,req.body.company,req.body.flightid],function(error,result){
     if(error)
     {   
          //  console.log(error)
          res.redirect('/flight/displayallflights')
     }
     else
     {
          res.redirect('/flight/displayallflights')
    
     }
})
    }

    else
    {
     pool.query("delete from flightsdetails where flightid=? ",[req.body.flightid],function(error,result){
          if(error)
          {   
               //  console.log(error)
               res.redirect('/flight/displayallflights')
          }
          else
          {
               res.redirect('/flight/displayallflights')
         
          }
     })
    }
})

router.get('/edit_flight_data_image',function(req,res){
     pool.query("select F.*,(select C.cityname from cities C where C.cityid=F.sourcecity) as sourcecity,(select C.cityname from cities C where C.cityid=F.destinationcity ) as destinationcity from flightsdetails F where flightid=? ",[req.query.flightid],function(error,result){
          if(error)
          {   
               //  console.log(error)
               res.render('showimage',{'data':[],'message':'Server Error'})
          }
          else
          {
               res.render('showimage',{'data':result[0],'message':'Record Submitted Successfully'})
         
          }
     })
    
}) 



router.post('/editimage',upload.single('logo'),function(req,res){

     console.log("BODY:",req.body)
     console.log("FILE:",req.file)

    
     
     pool.query("update flightsdetails set  logo=? where flightid=? ",[req.file.originalname,req.body.flightid],function(error,result){
     if(error)
     {   
          //  console.log(error)
          res.redirect('/flight/displayallflights')
     }
     else
     {
          res.redirect('/flight/displayallflights')
    
     }
})

})





module.exports = router;
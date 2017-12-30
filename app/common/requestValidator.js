var commonService = require("../common/commonService.js");
var mailFormat = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})|([0-9]{10})+$/;
module.exports = {
  adduser:function(req,res){
if(!req.body.userName || req.body.userName==null ||req.body.userName== undefined ||req.body.userName=="" || !mailFormat.test(req.body.userName)){
  return "please enter the valid email";
}
if(!req.body.password || req.body.password==null|| req.body.password== undefined || req.body.password==""){
  return "password is required";
}
if(!req.body.fullName || req.body.fullName==null|| req.body.fullName== undefined || req.body.fullName==""){
  return "userName is required";
}
if(!req.body.userid ||req.body.userid==null ||req.body.userid== undefined ||req.body.userid=="" ){
  return "please selecct the unique userId";
}
return true;
  },
  addstockarea:function(req,res){
if(!req.body.stockareaName || req.body.stockareaName==null ||req.body.stockareaName== undefined ||req.body.stockareaName==""){
  return "please enter the valid stockareaName";
}
if(!req.body.latitude || req.body.latitude==null|| req.body.latitude== undefined || req.body.latitude==""){
  return "latitude is required";
}
if(!req.body.longitude || req.body.longitude==null|| req.body.longitude== undefined || req.body.longitude==""){
  return "longitude is required";
}
if(!req.body.phone ||req.body.phone==null ||req.body.phone== undefined ||req.body.phone=="" ){
  return "phone number is required";
}
return true;
  },
  validatetoken:function(req,res){
    if(!req.body.token || req.body.token==null ||req.body.token== undefined ||req.body.token==""){
      return "token should not be empty";
    }
    return true;
  },
  update:function(req,res){
    if(!req.body.fullName || !req.body.address || !req.body.dob){
      return "Nothing to update";
    }
    return true;
  },
  updateprofilepic:function(req,res){
    if(!req.body.img || req.body.img=="" || req.body.img==undefined){
      return "select a image to upload";
    }
    return true;
  },
  verify:function(req,res){
    if(!req.body.email || req.body.email=="" || req.body.email==undefined || !mailFormat.test(req.body.userName)){
      return "email id is required";
    }
    return true;
  },
   deleteemail:function(req,res){
      if(!req.body.email || req.body.email=="" || req.body.email==undefined || !mailFormat.test(req.body.userName)){
        return "email id is required";
      }
      return true;
    },
    addprimary:function(req,res){
       if(!req.body.email || req.body.email=="" || req.body.email==undefined || !mailFormat.test(req.body.userName)){
         return "email id is required";
       }
       return true;
     },
     addnewemail:function(req,res){
        if(!req.body.email || req.body.email=="" || req.body.email==undefined || !mailFormat.test(req.body.userName)){
          return "email id is required";
        }
        return true;
      },
  verifymobile:function(req,res){
    if(!req.body.mobile || req.body.mobile=="" || req.body.mobile==undefined){
      return "mobile number is required";
    }
    return true;
  },
  addnewmobile:function(req,res){
    if(!req.body.mobile || req.body.mobile=="" || req.body.mobile==undefined){
      return "mobile number is required";
    }
    return true;
  },
  addprimarymobile:function(req,res){
    if(!req.body.mobile || req.body.mobile=="" || req.body.mobile==undefined){
      return "mobile number is required";
    }
    return true;
  },
  deletemobile:function(req,res){
    if(!req.body.mobile || req.body.mobile=="" || req.body.mobile==undefined){
      return "mobile number is required";
    }
    return true;
  },
  updatepassword:function(req,res){
    if(req.body.oldPassword==null ||req.body.oldPassword==undefined ||req.body.oldPassword==""){
      return "old password is required";
    }
    if(req.body.newPassword==null ||req.body.newPassword==undefined ||req.body.newPassword==""){
      return "new password is requried";
    }
    return true;
  },
  forgetpassword:function(req,res){
    if(!req.body.username || req.body.username==null ||req.body.username==undefined ||req.body.username==""){
      return "please enter the valid email";
    }
    return true;
  },

  resetpassword:function(req,res){
    if(!req.body.newPassword || req.body.newPassword==null ||req.body.newPassword==undefined || req.body.newPassword==""){
      return "enter the valid password";
    }
    return true;
  }
};

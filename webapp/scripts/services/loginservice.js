'use strict';

/**
 *@Author PalMurugan C
 *
 * @Description Login authentication service
 */

vgApp.factory('loginService', ['$http', function($http) {

  var sdo = {

    // Service for authenticating user
    authenticateUser: function(userName, password) {
      var promise = $http({
        url: domainURL + 'api/token/login',
        method: "post",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformRequest: function(obj) {
          var str = [];
          for (var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
        },
        data: {
          "username": userName,
          "password": password,
          "client_id": "$vgodown1",
          "client_secret": "grnklnio576543hyjvbk",
          "grant_type": "password"
        }

      }).then(function(data) {
        return data;

      }, function(err) {
        return err;

      });

      return promise;
    },
    material: function(term) {
      var promise = $http({
        method: "POST",
        //   dataType  :"json",
        headers: {
          'Content-Type': 'application/json'
        },
        url: domainURL + 'api/material/Id',
        data: {
          "name": term
        }
      }).then(function(data) {
        return data;
      }, function(xhr, status, err) {
        return err;
      });

      return promise;
    },
    addsuggest: function(Id, filter) {
      var promise = $http({
        method: "POST",
        //   dataType  :"json",
        headers: {
          'Content-Type': 'application/json'
        },
        url: domainURL + 'api/suggest/suggestproduct',
        data: {
          "materialId": Id,
          "filters": filter
        }
      }).then(function(data) {
        return data;
      }, function(xhr, status, err) {
        return err;
      });

      return promise;
    },
    registerUser: function(data) {
      var promise = $http({
        url: domainURL + 'api/users/adduser',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    signUpComplete: function(data) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/stockarea/addstockarea',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    forgotPassword: function(data) {
      var promise = $http({
        url: domainURL + 'api/users/forgetPassword',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    verifyToken: function(data) {
      var promise = $http({
        url: domainURL + 'api/users/onVerifyAction',
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    collabrator: function(data) {
      var promise = $http({
        url: domainURL + 'api/organisation/collabrator',
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          token: data
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },

    validatetoken: function(data) {
      var promise = $http({
        url: domainURL + 'api/users/validatetoken',
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "token": data
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },

    isAuthenticated: function() {
      var promise = $http({
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          'userId': localStorage.getItem('userId'),
          'access_token': localStorage.getItem('access_token')
        },
        url: domainURL + 'api/token/checktoken'
      }).then(function(data) {
        return data
      }, function(data) {
        return data;
      });
      return promise;
    },
    updatePassword: function(data) {
      var promise = $http({
        url: domainURL + 'api/secured/users/updatePassword',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    checkname: function(name) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/stockarea/checkstockarea',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "term": name
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    codes: function() {
      var promise = $http({
        url: domainURL + 'api/secured/users/getcodes',
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    deleteuser: function(password) {
      var promise = $http({
        url: domainURL + 'api/secured/users/deleteuser',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "password": password
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    emailchange: function(email) {
      var promise = $http({
        url: domainURL + 'api/users/checkemail',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "term": email
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
  useridchange: function(userid) {
      var promise = $http({
        url: domainURL + 'api/users/checkuserid',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "userid": userid
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    phonechange: function(no) {
      var promise = $http({
        url: domainURL + 'api/secured/users/checkphone',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "term": no
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    getUserDetails: function() {
      var promise = $http({
        url: domainURL + 'api/secured/users/getuser',
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function(data) {
        return data;
      }, function(data) {
        return data;
      });
      return promise;
    },
    geturl: function() {
      var promise = $http({
        url: domainURL + 'api/secured/users/geturl',
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    updateprofile: function(data) {
      var promise = $http({
        url: domainURL + 'api/secured/users/update',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    gethistory: function() {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/history/gethistory',
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    gethistoryview: function() {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/history/gethistoryview',
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    updatepassword: function(oldpassword, newpassword) {
      var promise = $http({
        url: domainURL + 'api/secured/users/updatepassword',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "oldPassword": oldpassword,
          "newPassword": newpassword
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    addprimary: function(email) {
      var promise = $http({
        url: domainURL + 'api/secured/users/addprimary',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "email": email
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    addprimarymobile: function(email) {
      var promise = $http({
        url: domainURL + 'api/secured/users/addprimarymobile',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "mobile": email
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    addprimarystockarea: function(email, stockareaId) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/stockarea/primaryemail',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "email": email,
          "stockareaId": stockareaId
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    addprimarymobilestockarea: function(email, stockareaId) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/stockarea/primarymobile',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "mobile": email,
          "stockareaId": stockareaId

        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },

    updateprofilepic: function(img) {
      var promise = $http({
        url: domainURL + 'api/secured/users/updateprofilepic',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "img": img
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    addsecondary: function(email) {
      var promise = $http({
        url: domainURL + 'api/secured/users/addsecondary',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "email": email
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    deleteemail: function(email) {
      var promise = $http({
        url: domainURL + 'api/secured/users/deleteemail',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "email": email
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    deletemobile: function(email) {
      var promise = $http({
        url: domainURL + 'api/secured/users/deletemobile',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "mobile": email
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    deleteemailstockarea: function(email, stockareaId) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/stockarea/deleteemail',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "email": email,
          "stockareaId": stockareaId
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    deletemobilestockarea: function(email, stockareaId) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/stockarea/deletemobile',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "mobile": email,
          "stockareaId": stockareaId
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    verify: function(email) {
      var promise = $http({
        url: domainURL + 'api/secured/users/verify',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "email": email
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    verifymobile: function(mobile) {
      var promise = $http({
        url: domainURL + 'api/secured/users/verifymobile',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "mobile": mobile
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    submitotp: function(token) {
      var promise = $http({
        url: domainURL + 'api/secured/users/verifymobileotp',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "token": token
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    verifyemail: function(token, email) {
      var promise = $http({
        url: domainURL + 'api/users/verifyemail',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "email": email,
          "token": token
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    addnewmail: function(email) {
      var promise = $http({
        url: domainURL + 'api/secured/users/addnewmail',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "email": email
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    addnewmobile: function(email, code) {
      var promise = $http({
        url: domainURL + 'api/secured/users/addnewmobile',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "mobile": email,
          "code": code
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },

    addnewmobilestockarea: function(email, code, stockareaId) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/stockarea/addnewmobile',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "mobile": email,
          "code": code,
          "stockareaId": stockareaId

        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    addnewmailstockarea: function(email, stockareaId) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/stockarea/addnewemail',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "email": email,
          "stockareaId": stockareaId

        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    updateorganisation: function(name, as, from, to) {
      var promise = $http({
        url: domainURL + 'api/secured/users/updateorganisation',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "name": name,
          "as": as,
          "from": from,
          "to": to
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    editorganisation: function(id, name, as, from, to) {
      var promise = $http({
        url: domainURL + 'api/secured/users/editorganisation',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "id": id,
          "name": name,
          "as": as,
          "from": from,
          "to": to
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    deleteorganisation: function(id) {
      var promise = $http({
        url: domainURL + 'api/secured/users/deleteorganisation',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "id": id
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    }
  };
  return sdo;
}]);

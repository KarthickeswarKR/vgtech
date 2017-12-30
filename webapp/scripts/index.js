'use strict';

function setheightandwidthofmaincontainer() {
  var height;
  var tabcontentslist = document.getElementsByClassName("tabcontents");
  var screenHeight = screen.height;
  screenHeight = window.innerHeight;
  if (tabcontentslist.length != 0) {
    if (screenHeight > (60 + 80 + 430 + 70)) {
      height = screenHeight - 60 - 80 - 70 - 20;
      //document.getElementById("addproductdiv").style.height = height - (145) + 'px';
      document.getElementById("map").style.height = height + 'px';
      document.getElementById("mainsection").style.height = height + 'px';
      document.getElementById("maindiv").style.height = height + 'px';
      document.getElementById("settingdiv").style.height = height - (53) + 'px';
      //document.getElementById("orderListDiv").style.height = height + 'px';
      //document.getElementById("orderTansactionDetailsDiv").style.height = height + 'px';
      document.getElementById("productlistsectiondiv").style.height = height - (140) + 'px';
      document.getElementById("productlistdiv").style.height = height - (140) + 'px';
      document.getElementById("notification").style.height = screenHeight - 75 + 'px';
      for (var i = tabcontentslist.length - 1; i >= 0; i--) {
        tabcontentslist[i].style.height = height + 'px';
      }

      document.getElementsByClassName("searchresultdiv")[0].style.height = (height - 150) + 'px';

      //document.getElementById("searchresult").style.height = height - (100) + 'px';
    } else {
      height = 430;
      //document.getElementById("branddiv").style.height = height - (125) + 'px';
      //document.getElementById("productinfodiv").style.height = height - (125) + 'px';
      document.getElementById("map").style.height = height + 'px';
      document.getElementById("mainsection").style.height = height + 'px';
      document.getElementById("maindiv").style.height = height + 'px';
      document.getElementById("settingdiv").style.height = height - (53) + 'px';

      //document.getElementById("orderListDiv").style.height = height + 'px';
      //document.getElementById("orderTansactionDetailsDiv").style.height = height + 'px';
      document.getElementById("productlistdiv").style.height = height - (137) + 'px';
      document.getElementById("productlistsectiondiv").style.height = height - (137) + 'px';
      document.getElementById("notification").style.height = height - 60 + 'px';

      //document.getElementById("addproductdiv").style.height = height - (150) + 'px';
      for (var i = tabcontentslist.length - 1; i >= 0; i--) {
        tabcontentslist[i].style.height = height + 'px';
      }
      document.getElementsByClassName("searchresultdiv")[0].style.height = 350 + 'px';
    }
    if (document.getElementById("productinfodiv") !== null) {
      document.getElementById("productinfodiv").style.height = height - (131) + 'px';
    }
    if (document.getElementById("branddiv") !== null) {
      document.getElementById("branddiv").style.height = height - (131) + 'px';
    }
    if (document.getElementById("addproduct") !== null) {
      document.getElementById("addproduct").style.height = height - (53) + 'px';
    }
    if (document.getElementById("searchresult") !== null) {
      document.getElementById("searchresult").style.height = height + 'px';
    }
    if (document.getElementById("editproduct") !== null) {
      document.getElementById("editproduct").style.height = height - (131) + 'px';
    }
    var width;
    var innerWidth = window.innerWidth;

    //innerWidth = 1200;
    if (innerWidth > 800) {
      width = innerWidth - 279;
      document.getElementById("map").style.width = width + 'px';
      document.getElementById("maindiv").style.width = width + 'px';
      document.getElementById("mainsection").style.width = width + 'px';
    }

    if (innerWidth < 800) {
      width = 800;
      width = 800 - 300;
      //document.getElementById("map").style.width = width + 'px';
      document.getElementById("maindiv").style.width = width + 'px';
      document.getElementById("mainsection").style.width = width + 'px';
      document.getElementById("mainsection").style.width = width + 'px';
    }
  }

}
setTimeout(function() {
  setheightandwidthofmaincontainer();
}, 1000);
window.addEventListener('resize', function() {
  setheightandwidthofmaincontainer();
});
$(document).ready(function() {
  $('[data-toggle="tooltip"]').tooltip();
});

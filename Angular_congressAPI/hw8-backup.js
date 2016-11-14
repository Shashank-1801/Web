var myApp = angular.module('myApp', ['angularUtils.directives.dirPagination']);


myApp.factory("bio_id_updater", function() {
  var bio_id = "K000388";

  function get_bio_id() {
    return bio_id;
  }

  function set_bio_id(newVal) {
    bio_id = newVal;
    //console.log("id changed to " + bio_id);
  }
  return {
    get_bio_id: get_bio_id,
    set_bio_id: set_bio_id,
  }
});


myApp.controller('legis-all', function($scope, $http, bio_id_updater) {
  $http({
    method: 'GET', //CHANGE THIS FROM GET TO POST
    url: './phpfunc.php',
    params: {
      dbtype: 'legislators-all'
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })

  .then(function(response) {
    $scope.names = response.data.results;
    //console.log(response.data);
    $scope.states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Federated States of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

  });


  $scope.set_bio_id = bio_id_updater.set_bio_id;

});

myApp.controller('legis-details', function($scope, $http, bio_id_updater) {

  $scope.$watch(
    function() {
      return bio_id_updater.get_bio_id();
    },

    function(value) {
      //console.log("bio_id found is " + value);
      var v = localStorage.getItem(value);
      if (v != null) {
        console.log("yellow icon for favs, saved " + value);
        $("#favbtn_legislator").css('background', "yellow");
      } else {
        console.log("white icon for favs, removed " + value);
        $("#favbtn_legislator").css('background', "white");
      }



      // info related to legislator
      $http({
        method: 'GET', //CHANGE THIS FROM GET TO POST
        url: './phpfunc.php',
        params: {
          dbtype: 'legislators-details',
          bio_id: value
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })

      .then(function(response) {
        $scope.bio_details = response.data.results[0];

        console.log("start date = " + $scope.bio_details.term_start);
        console.log("start date = " + $scope.bio_details.term_end);
        var start = moment($scope.bio_details.term_start);
        var end = moment($scope.bio_details.term_end);
        var now = moment();
        var total = moment(end).diff(moment(start));
        var completed = moment(now).diff(moment(start));

        var percen = (completed / total) * 100;

        console.log("total = " + total);
        console.log("completed = " + completed);

        console.log(percen);


        $scope.percent_completed = Math.round(percen);

        $scope.term_end = moment(end).format("MMM DD, YYYY");
        $scope.term_start = moment(end).format("MMM DD, YYYY");
        $scope.birthday = moment($scope.bio_details.birthday).format("MMM DD, YYYY");
        console.log(moment(end).format("MMM DD, YYYY"));

        //console.log($scope.bio_details);
      });

      // top 5 committees
      $http({
        method: 'GET', //CHANGE THIS FROM GET TO POST
        url: './phpfunc.php',
        params: {
          dbtype: 'legislators-committees',
          bio_id: value
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })

      .then(function(response) {
        $scope.bio_details_comm = response.data.results;
        //console.log($scope.bio_details_comm);
      });

      // top 5 bills
      $http({
        method: 'GET', //CHANGE THIS FROM GET TO POST
        url: './phpfunc.php',
        params: {
          dbtype: 'legislators-bills',
          bio_id: value
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })

      .then(function(response) {
        $scope.bio_details_bills = response.data.results;
        //console.log($scope.bio_details_bills);
      });

      $scope.photo_url = "https://theunitedstates.io/images/congress/original/" + value + ".jpg";

      //$scope.start_date = moment(bio_details.start_date, "MMM DD, YYYY");

      $scope.fb = function() {
        if ($scope.bio_details.facebook_id == null) {
          return null;
        } else {
          return '<a class="top-text" href="' + $scope.bio_details.facebook_id + '" target="_newtab"><img src="./images/logo.png" class="logo-img"></a>';
        }

      }
      $scope.tw = "";
      $scope.web = "";

    }
  );

  $scope.toggleSave = function(data) {
    if (localStorage.getItem(data.bioguide_id) == null) {
      // save data
      localStorage.setItem(data.bioguide_id, JSON.stringify(data));
      console.log("yellow icon for favs, saved " + data.bioguide_id);
      $("#favbtn_legislator").css('background', "yellow");
    } else {
      // remove data
      localStorage.removeItem(data.bioguide_id, JSON.stringify(data));
      console.log("white icon for favs, removed " + data.bioguide_id);
      $("#favbtn_legislator").css('background', "white");
    }

  }

});


myApp.controller('legis-house', function($scope, $http, bio_id_updater) {
  $http({
    method: 'GET', //CHANGE THIS FROM GET TO POST
    url: './phpfunc.php',
    params: {
      dbtype: 'legislators-house'
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })

  .then(function(response) {
    $scope.legHouses = response.data.results;
    //console.log(response.data);
  });

  $scope.set_bio_id = bio_id_updater.set_bio_id;


});

myApp.controller('legis-senate', function($scope, $http, bio_id_updater) {
  $http({
    method: 'GET', //CHANGE THIS FROM GET TO POST
    url: './phpfunc.php',
    params: {
      dbtype: 'legislators-senate'
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })

  .then(function(response) {
    $scope.legSenate = response.data.results;
    //console.log("legSenate is :");
    //console.log($scope.legSenate);
    //console.log(typeof $scope.legSenate);
  });

  $scope.set_bio_id = bio_id_updater.set_bio_id;

});


myApp.controller('legis_fav', function($scope, $http, bio_id_updater) {

  $scope.local_data = localToArray();

  $scope.$watch(localStorage, $scope.reload);

  function localToArray() {
    var arr = [];
    for (var i = 0; i < localStorage.length; i++) {
      try {
        var info = JSON.parse(localStorage.getItem(localStorage.key(i)));
        arr.push(info);
      } catch (err) {

      }
      //console.log(arr); 
    }
    return arr;
  };

  //console.log(typeof $scope.local_data);
  //console.log($scope.local_data);


  $scope.set_bio_id = bio_id_updater.set_bio_id;

  $scope.photo_url = function(id) {
    return "https://theunitedstates.io/images/congress/original/" + id + ".jpg";
  }

  $scope.remove = function(key) {
    localStorage.removeItem(key);
    $scope.local_data = localToArray();
  }

  $scope.reload = function() {
    $scope.local_data = localToArray();
  }

});


myApp.controller('bill_fav', function($scope, $http, bill_id_updater) {

  $scope.local_data = localToArray();

  $scope.$watch(localStorage, $scope.reload);

  function localToArray() {
    var arr = [];
    for (var i = 0; i < localStorage.length; i++) {
      try {
        var info = JSON.parse(localStorage.getItem(localStorage.key(i)));
        arr.push(info);
      } catch (err) {

      }
      //console.log(arr); 
    }
    return arr;
  };

  //console.log(typeof $scope.local_data);
  //console.log($scope.local_data);


  $scope.set_bill_id = bill_id_updater.set_bill_id;

  $scope.remove = function(key) {
    localStorage.removeItem(key);
    $scope.local_data = localToArray();
  }

  $scope.reload = function() {
    $scope.local_data = localToArray();
  }

});


myApp.controller('comm_fav', function($scope, $http) {

  $scope.local_data = localToArray();

  $scope.$watch(localStorage, $scope.reload);

  function localToArray() {
    var arr = [];
    for (var i = 0; i < localStorage.length; i++) {
      try {
        var info = JSON.parse(localStorage.getItem(localStorage.key(i)));
        arr.push(info);
      } catch (err) {

      }
      //console.log(arr); 
    }
    return arr;
  };

  //console.log(typeof $scope.local_data);
  //console.log($scope.local_data);


  //$scope.set_bill_id = bio_id_updater.set_bill_id;

  $scope.remove = function(key) {
    localStorage.removeItem(key);
    $scope.local_data = localToArray();
    $("#favbtn_j_" + key).css('background', "white");
    $("#favbtn_" + key).css('background', "white");
  }

  $scope.reload = function() {
    $scope.local_data = localToArray();
  }

});


myApp.factory("bill_id_updater", function() {
  var bill_id = "hr4925-114";

  function get_bill_id() {
    return bill_id;
  }

  function set_bill_id(newVal) {
    bill_id = newVal;
  }
  return {
    get_bill_id: get_bill_id,
    set_bill_id: set_bill_id,
  }
});


myApp.controller('bills_active', function($scope, $http, bill_id_updater) {
  $http({
      method: 'GET', //CHANGE THIS FROM GET TO POST
      url: './phpfunc.php',
      params: {
        dbtype: 'bills-active'
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function(response) {
      $scope.bills = response.data.results;
    });

  $scope.set_bill_id = bill_id_updater.set_bill_id;

});

myApp.controller('bills_new', function($scope, $http, bill_id_updater) {
  $http({
      method: 'GET', //CHANGE THIS FROM GET TO POST
      url: './phpfunc.php',
      params: {
        dbtype: 'bills-new'
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function(response) {
      $scope.bills = response.data.results;
    });

  $scope.set_bill_id = bill_id_updater.set_bill_id;

});

myApp.directive('pdf', function() {
  return {
    restrict: 'E',
    link: function(scope, element, attrs) {
      var url = scope.$eval(attrs.src);
      element.replaceWith('<object type="application/pdf" data="' + url + '"></object>');
    }
  };
});

myApp.controller('bill_details', function($scope, $http, bill_id_updater) {

  $scope.$watch(
    function() {
      return bill_id_updater.get_bill_id();
    },

    function(value) {
      //console.log("bill_id found is " + value);
      $scope.bill_details = "";
      // info related to legislator
      $http({
        method: 'GET', //CHANGE THIS FROM GET TO POST
        url: './phpfunc.php',
        params: {
          dbtype: 'bill_details',
          bill_id: value
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })

      .then(function(response) {
        $scope.bill_details = response.data.results[0];
        //console.log($scope.bill_details);

        $scope.bill_status = "New";
        if ($scope.bill_details.history.active == true) {
          $scope.bill_status = "Active";
        }



        var v = localStorage.getItem(value);
        if (v != null) {
          console.log("yellow icon for favs, saved " + value);
          $("#favbtn_bills").css('background', "yellow");
        } else {
          console.log("white icon for favs, removed " + value);
          $("#favbtn_bills").css('background', "white");
        }


        $scope.intro_date = moment($scope.bill_details.introduced_on).format("MMM DD, YYYY");


        try {
          $scope.pdf_url = $scope.bill_details.last_version.urls.pdf;
          $scope.pdf_view = "<h1>jsabc</h1>";
          //console.log($scope.pdf_url)
          $("#pdf_view").html('<object data="' + $scope.pdf_url + '" type="application/pdf" width="300" height="200">   </object>');
        } catch (err) {
          console.log("error in fetching PDF");
          $("#pdf_view").html('PDF unavailable');
        }


        $scope.toggleSave = function(data) {
          if (localStorage.getItem(data.bill_id) == null) {
            // save data
            localStorage.setItem(data.bill_id, JSON.stringify(data));
            console.log("yellow icon for favs, saved " + data.bill_id);
            $("#favbtn_bills").css('background', "yellow");
          } else {
            // remove data
            localStorage.removeItem(data.bill_id, JSON.stringify(data));
            console.log("white icon for favs, removed " + data.bill_id);
            $("#favbtn_bills").css('background', "white");
          }
          // localStorage.setItem(data.bill_id, JSON.stringify(data));
          // var legFavs = JSON.parse(localStorage.getItem(data.bill_id));

        };



      });

    }
  );


});


myApp.controller('comm_house', function($scope, $http) {
  $http({
      method: 'GET', //CHANGE THIS FROM GET TO POST
      url: './phpfunc.php',
      params: {
        dbtype: 'comm_house'
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function(response) {
      $scope.comms = response.data.results;
    });


  $scope.toggleSave = function(data) {
    if (localStorage.getItem(data.committee_id) == null) {
      // save data
      localStorage.setItem(data.committee_id, JSON.stringify(data));
      console.log("yellow icon for favs, saved " + data.committee_id);
      $("#favbtn_" + data.committee_id).css('background', "yellow");
      $("#favbtn_j_" + data.committee_id).css('background', "yellow");
    } else {
      // remove data
      localStorage.removeItem(data.committee_id, JSON.stringify(data));
      console.log("white icon for favs, removed " + data.committee_id);
      $("#favbtn_" + data.committee_id).css('background', "white");
      $("#favbtn_j_" + data.committee_id).css('background', "white");
    }

  };


});

myApp.controller('comm_senate', function($scope, $http) {
  $http({
      method: 'GET', //CHANGE THIS FROM GET TO POST
      url: './phpfunc.php',
      params: {
        dbtype: 'comm_senate'
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function(response) {
      $scope.comms = response.data.results;

    });

  $scope.toggleSave = function(data) {
    if (localStorage.getItem(data.committee_id) == null) {
      // save data
      localStorage.setItem(data.committee_id, JSON.stringify(data));
      console.log("yellow icon for favs, saved " + data.committee_id);
      $("#favbtn_" + data.committee_id).css('background', "yellow");
      $("#favbtn_j_" + data.committee_id).css('background', "yellow");
    } else {
      // remove data
      localStorage.removeItem(data.committee_id, JSON.stringify(data));
      console.log("white icon for favs, removed " + data.committee_id);
      $("#favbtn_" + data.committee_id).css('background', "white");
      $("#favbtn_j_" + data.committee_id).css('background', "white");
    }

  };


});

myApp.controller('comm_joint', function($scope, $http) {
  $http({
      method: 'GET', //CHANGE THIS FROM GET TO POST
      url: './phpfunc.php',
      params: {
        dbtype: 'comm_joint'
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function(response) {
      $scope.comms = response.data.results;
    });

  $scope.toggleSave = function(data) {
    if (localStorage.getItem(data.committee_id) == null) {
      // save data
      localStorage.setItem(data.committee_id, JSON.stringify(data));
      console.log("yellow icon for favs, saved " + data.committee_id);
      $("#favbtn_j_" + data.committee_id).css('background', "yellow");
      $("#favbtn_" + data.committee_id).css('background', "yellow");
    } else {
      // remove data
      localStorage.removeItem(data.committee_id, JSON.stringify(data));
      console.log("white icon for favs, removed " + data.committee_id);
      $("#favbtn_j_" + data.committee_id).css('background', "white");
      $("#favbtn_" + data.committee_id).css('background', "white");
    }

  };


});



// JS functions
/* opne and close the nav bar*/
function openCloseNav() {
  var w = document.getElementById("side-nav").style.width;
  var visibleWidth = "150px";
  var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  if (width < 500) {
    visibleWidth = "50px";
  }
  if (w == visibleWidth) {
    document.getElementById("side-nav").style.width = "0";
    document.getElementById("results").style.marginLeft = "0";
  } else {
    document.getElementById("side-nav").style.width = visibleWidth;
    document.getElementById("results").style.marginLeft = visibleWidth;
  }
  $("#width").html(width);
}

function prepareHtml(data) {
  //console.log("in show details, and got " + data.birthday);
  var inner_html_code = "<h3> Details </h3>";
  inner_html_code += "<hr>";

  inner_html_code += "<img class='col-lg-3 leg_img' src='https://theunitedstates.io/images/congress/original/" + data.bioguide_id + ".jpg' alt='" + data.bioguide_id + "' >"

  return inner_html_code;
}


function slide_details() {
  $('.carousel').carousel(1);
}

function prev_slide() {
  $('.carousel').carousel(0);
}

function toggleSave(data) {
  //console.log("fav button clicked : " + data);
}

// jQuery functions
$(document).ready(function() {
  $("#legislators").click(function() {
    $(".results").hide();
    $('.carousel').carousel(0);
    $("#legislators_results").show();

  });

  $("#bills").click(function() {
    $(".results").hide();
    $('.carousel').carousel(0);
    $("#bills_results").show();

  });

  $("#committees").click(function() {
    load_fav();
    $(".results").hide();
    $('.carousel').carousel(0);
    $("#committees_results").show();
  });

  $("#favorites").click(function() {
    $(".results").hide();
    $('.carousel').carousel(0);
    $("#favorites-results").show();
    load_fav();
  });

  $(".btn.btn-primary.details").click(function() {
    $('.carousel').carousel(1);
  });

  $(".details_back").click(function() {
    $('.carousel').carousel(0);
  });


  $("#c_j").click(function() {
    load_fav();
  });

  $("#c_h").click(function() {
    load_fav();
  });

  $("#c_s").click(function() {
    load_fav();
  });


  $(".results").hide();
  $("#legislators_results").show();


});

function load_fav() {
  angular.element('#f1').scope().reload();
  angular.element('#f1').scope().$apply();
  angular.element('#f2').scope().reload();
  angular.element('#f2').scope().$apply();
  angular.element('#f3').scope().reload();
  angular.element('#f3').scope().$apply();
  for (var i = 0; i < localStorage.length; i++) {
    try {
      var info = JSON.parse(localStorage.getItem(localStorage.key(i)));
      $("#favbtn_" + info.committee_id).css('background', "yellow");
      $("#favbtn_j_" + info.committee_id).css('background', "yellow");
      // arr.push(info);
    } catch (err) {

    }
  }

  // $('#fav_leg').html("");
  // $('#fav_bill').html("");
  // $('#fav_comm').html("");
  // for (var i = 0; i < localStorage.length; i++){
  //     try{
  //         var info = JSON.parse(localStorage.getItem(localStorage.key(i)));
  //         var row = "";
  //         if( typeof info.bioguide_id != 'undefined'){
  //             row += "<tr>";
  //             row += '<td><button class="btn btn-default fa fa-trash-o" onclick="remove_entry(' + "'" +  info.bioguide_id + "'"+ '")></button></td>';
  //             row += "<td> <img src='https://theunitedstates.io/images/congress/original/" + info.bioguide_id + ".jpg'></img></td>";
  //             row += "<td>" + info.title + " " + info.first_name + " " + info.middle_name + " " + info.last_name + "</td>";
  //             row += "<td>" + info.chamber + "</td>";
  //             row += "<td>" + info.district + "</td>";
  //             row += "<td>" + info.state_name + "</td>";
  //             row += '<td><button class="btn btn-primary details" onclick="showLeg('+ "'" +  info.bioguide_id + "'"+')" ng-click="set_bio_id(' + "'" +  info.bioguide_id + "'"+ ')">View Details</button></td>';
  //             row += "</tr>";

  //             $('#fav_leg').append(row);
  //         }else if(typeof info.bill_id != 'undefined'){
  //             row += "<tr>";
  //             row += '<td><button class="btn btn-default fa fa-trash-o" onclick="remove_entry(' + "'" +  info.bill_id + "'"+ ')"></button></td>';
  //             row += "<td>" + info.bill_id + "</td>";
  //             row += "<td>" + info.official_title + "</td>";
  //             row += "<td>" + info.chamber + "</td>";
  //             row += "<td>" + info.introduced_on + "</td>";
  //             row += "<td>" + info.sponsor.title + ' ' + info.sponsor.first_name + ' ' + info.sponsor.last_name + "</td>";
  //             row += '<td><button class="btn btn-primary details" onclick="slide_details()" ng-click="set_bio_id(' + info.bill_id + ')">View Details</button></td>';
  //             row += "</tr>";

  //             $('#fav_bill').append(row);
  //         }else if(info.committee_id !== ""){
  //             row += "<tr>";
  //             row += '<td><button class="btn btn-default fa fa-trash-o" onclick="remove_entry(' + "'" +  info.committee_id + "'"+ ')"></button></td>';
  //             row += "<td>" + info.chamber + "</td>";
  //             row += "<td>" + info.committee_id + "</td>";
  //             row += "<td>" + info.name + "</td>";
  //             row += "<td>" + info.parent_committee_id + "</td>";
  //             row += "<td>" + info.subcommittee + "</td>";
  //             row += "</tr>";

  //             $('#fav_comm').append(row);
  //         }else{
  //            //console.log("unrelated data");
  //         }
  //     }catch(err){
  //        //console.log("error in parsing " + localStorage.key(i));
  //     }


  // }

}



function showLegTab() {
  $(".results").hide();
  $("#legislators_results").show();
  slide_details();
}

function showBillTab() {
  $(".results").hide();
  $("#bills_results").show();
  slide_details();
}

function remove_entry(key) {
  localStorage.removeItem(key);
  load_fav();

}

function isLegislatorFav(id) {
  if (isInLocalStrorage(id)) {
    console.log("yellow icon");
  } else {
    console.log("white icon");
  }
}


function isInLocalStrorage(key) {
  if (localStorage.getItem(key) != null) {
    return true;
  } else {
    return false;
  }
}


function getFormattedDate(date) {
  //var date = moment(date);
  console.log(moment(date, "MM/DD/YY"));
}
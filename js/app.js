'use strict';

angular.module('pantryApp', [])
  .controller('PantryController', function($scope, $http){
    var apiurl = "";

    var req = {
      method: 'POST',
      url: apiurl,
      data: {"operation": "list",
        "tableName": "Pantry",
        "payload": {
          "TableName": "Pantry"
        }
      }
    }

    // fetchPantry(req);

    $scope.pantry = [
        {
          "item": "name1",
          "stock": 1
        },
        {
          "item": "name2",
          "stock": 2
        }
      ];

    console.log($scope.pantry);

    function fetchPantry(req){
      $http(req).then(function(response){
        console.log(response);
        $scope.pantry = response.data.Items;

      });
    }

    $scope.newItem = function() {
      console.log(this.itemname);
      console.log(this.itemstock);

      var req = {
        method: 'POST',
        url: apiurl,
        data: {
          "operation": "create",
          "tableName": "Pantry",
          "payload": {
            "Item": {
                "item": this.itemname,
                "stock": this.itemstock
            }
          }
        }
      }

      // check for errors, etc.
      $http(req).then(function(response){
        console.log(response);
        // add the new item directly to the pantry scope (to save api calls)
        // or call fetchPantry again...
      });
    }






  });

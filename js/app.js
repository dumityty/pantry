'use strict';

angular.module('pantryApp', [])
  .controller('PantryController', function($scope, $http){
    var apiurl = "URL";

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

    fetchPantry(req);

    function fetchPantry(req){
      $http(req).then(function(response){
        // maybe be more specific and get only the Items from the data.
        // don't need the whole data response.
        $scope.pantry = response.data;
        console.log(response);

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

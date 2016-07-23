'use strict';

angular.module('pantryApp', ['xeditable'])
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

    fetchPantry(req);

    // todo: save pantry somehow locally - in cookies, etc
    // and only refresh it on click of a refresh button
    // any functions below should also refresh the $scope.pantry and update the view.
    //
    // reload scope after each function
    // also empty the form add after saving

    // $scope.pantry = [
    //   {
    //     "item": "name1",
    //     "stock": 1
    //   },
    //   {
    //     "item": "name2",
    //     "stock": 2
    //   }
    // ];

    // console.log($scope.pantry);

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
      //   console.log(response);
        // add the new item directly to the pantry scope (to save api calls)
        // or call fetchPantry again...
      });
    }

     $scope.saveItem = function(olditem, data) {
      console.log(olditem);
      console.log(data);

      var req = {
        method: 'POST',
        url: apiurl,
        data: {
          "operation": "update",
          "tableName": "Pantry",
          "payload": {
            "Key": {
                "item": olditem.item
            },
            "UpdateExpression": "set item = :i, stock = :s",
            "ExpressionAttributeValues": {
              ":i": data.item,
              ":s": data.stock
            }
          }
        }
      }

       // check for errors, etc.
      $http(req).then(function(response){
        console.log(response);
        // update item in $scope.pantry
        // or call fetchPantry again...
      });

     }

    $scope.removeItem = function(data) {
      console.log(data);

      var req = {
        method: 'POST',
        url: apiurl,
        data: {
          "operation": "delete",
          "tableName": "Pantry",
          "payload": {
            "Key": {
              "item": data
            }
          }
        }
      }

       // check for errors, etc.
      $http(req).then(function(response){
        // console.log(response);
        // remove item from $scope.pantry
        // or call fetchPantry again...
      });
    }


    $scope.reload = function() {
      location.reload();
    }


  });

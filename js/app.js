'use strict';

angular.module('pantryApp', ['xeditable','ngCookies'])
  .controller('PantryController', function($scope, $http, $cookies){
    var apiurl = "";

    // todo:
    // save pantry somehow locally - in cookies - DONE
    // only refresh it on click of a refresh button - call function to refresh cookie
    //
    // any functions below should also refresh the $scope.pantry and update the view.
    //
    // also empty the form add after saving

    listPantry();

    // Retrieve and list the Pantry items.
    function listPantry() {
      $scope.pantry = $cookies.getObject('pantry');
      console.log($scope.pantry);

      if (typeof $scope.pantry === "undefined") {
        fetchPantry();
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
      }
    }

    // Fetch pantry items from DynamoDB
    function fetchPantry(){
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
      $http(req).then(function(response){
        console.log(response);
        $scope.pantry = response.data.Items;
        console.log($scope.pantry);

        $cookies.putObject('pantry', $scope.pantry);
      });
    }

    // Add new item in Pantry DynamoDB table.
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

      $scope.newitem = {
        item: this.itemname,
        stock: this.itemstock
      };

      // Reset the form.
      this.newItemForm.$setPristine();
      this.newItemForm.$setUntouched();
      this.itemname = "";
      this.itemstock = "";

      // check for errors, etc.
      $http(req).then(function(response){
        // console.log(response);
        // add the new item directly to the pantry scope (to save api calls)
        // or call fetchPantry again...
        $scope.pantry.push($scope.newitem);
        console.log($scope.pantry);

        // Refresh cookie with new item.
        $cookies.putObject('pantry', $scope.pantry);
      });
    }

    // Update an item in the Pantry table.
    $scope.saveItem = function(olditem, data, index) {
      console.log(olditem);
      console.log(data);

      // Cannot update a key attribute (item) so need to approach differently:
      // delete old item and reinsert.
      if (olditem.item != data.item) {
        $scope.removeItem(olditem.item, index);

        var req = {
          method: 'POST',
          url: apiurl,
          data: {
            "operation": "create",
            "tableName": "Pantry",
            "payload": {
              "Item": {
                  "item": data.item,
                  "stock": data.stock
              }
            }
          }
        }

        // check for errors, etc.
        $http(req).then(function(response){
          // console.log(response);
          // add the new item directly to the pantry scope (to save api calls)
          // or call fetchPantry again...
          $scope.pantry.push(data);
          console.log($scope.pantry);

          // Refresh cookie with new item.
          $cookies.putObject('pantry', $scope.pantry);
        });

      }
      else {
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
              "UpdateExpression": "set stock = :s",
              "ExpressionAttributeValues": {
                ":s": data.stock
              }
            }
          }
        }

        // Refresh $scope.pantry and cookie.
        $scope.pantry[index].item = data.item;
        $scope.pantry[index].stock = data.stock;
        $cookies.putObject('pantry', $scope.pantry);

        // check for errors, etc.
        $http(req).then(function(response){
          console.log(response);
        });
      }

     }

    // Delete an item from the Pantry table.
    $scope.removeItem = function(data, index) {
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

      // Refresh $scope.pantry
      // ideally move these things in the 'success' from $http
      $scope.pantry.splice(index, 1);
      $cookies.putObject('pantry', $scope.pantry);

       // check for errors, etc.
      $http(req).then(function(response){
        // console.log(response);
      });
    }

    // Reload the page after clicking the refresh button.
    $scope.reload = function() {
      $cookies.remove('pantry');
      location.reload();
    }

  });

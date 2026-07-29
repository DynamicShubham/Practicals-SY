console.log("JS is running....")

var app = angular.module("Prac-2",[]);
      app.controller("MyController",function($scope){
        $scope.message = "This is Excercise";
      });
(function (angular) {
/*global todomvc, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
var app = angular.module('myApp.todo', ['firebase', 'firebase.utils', 'firebase.auth', 'ngRoute']);



//Controller
app.controller('TodoCtrl', function TodoCtrl($scope, Auth, fbutil, user, $location, $firebaseArray, $firebaseObject) {


	var unbind;
	var profile = $firebaseObject(fbutil.ref('users', user.uid));
	profile.$bindTo($scope, 'profile').then(function(ub) { unbind = ub; });
	
	$scope.logout = function() {
		if( unbind ) { 
			unbind(); 
		}
		profile.$destroy();
		Auth.$unauth();
		$location.path('/login');
	};
	  
	app.config(['$routeProvider', function($routeProvider) {
		$routeProvider.whenAuthenticated('/', {
			templateUrl: 'todo/todo.html',
			controller: 'TodoCtrl'
		});
	}]);





	var url = 'https://subtask-v1.firebaseio.com/';
	var fireRef = new Firebase(url);

	// Bind the todos to the firebase provider.
	$scope.todos = $firebaseArray(fbutil.ref('users', user.uid, 'todos'));
	$scope.newTodo = '';
	$scope.newTodoComment = '';
	$scope.newTodoDate = '';
	$scope.editedTodo = null;
	$scope.editedTodo = null;



	$scope.$watch('todos', function () {
		var total = 0;
		var remaining = 0;
		$scope.todos.forEach(function (todo) {
			// Skip invalid entries so they don't break the entire app.
			if (!todo || !todo.title) {
				return;
			}

			total++;
			if (todo.completed === false) {
				remaining++;
			}
		});
		$scope.totalCount = total;
		$scope.remainingCount = remaining;
		$scope.completedCount = total - remaining;
		$scope.allChecked = remaining === 0;
	}, true);

	$scope.addTodo = function () {
		 
		if ($scope.newTodoDate == null || $scope.newTodoDate == '') {
			var newTodo = $scope.newTodo.trim();
			var newTodoComment = $scope.newTodoComment.trim();
			var newTodoDate = '';
			
			if (!newTodo.length) {
				return;
			}
			$scope.todos.$add({
				title: newTodo,
				completed: false,
				comment: newTodoComment,
				date: newTodoDate
			});
		}else {
			var newTodo = $scope.newTodo.trim();
			var newTodoComment = $scope.newTodoComment.trim();
			var newTodoDate = Date.parse($scope.newTodoDate);
			
			if (!newTodo.length) {
				return;
			}
			$scope.todos.$add({
				title: newTodo,
				completed: false,
				comment: newTodoComment,
				date: newTodoDate
			});
		}

		$scope.newTodo = '';
		$scope.newTodoComment = '';
		$scope.newTodoDate = '';
	};

	$scope.editTodo = function (todo) {
		$scope.editedTodo = todo;
		$scope.originalTodo = angular.extend({}, $scope.editedTodo);
	};

	$scope.doneEditing = function (todo) {
		$scope.editedTodo = null;
		var title = todo.title.trim();
		if (title) {
			$scope.todos.$save(todo);
		} else {
			$scope.removeTodo(todo);
		}
	};

	$scope.revertEditing = function (todo) {
		todo.title = $scope.originalTodo.title;
		$scope.doneEditing(todo);
	};
	
	//Date edit 

	//Date edit

	$scope.removeTodo = function (todo) {
		$scope.todos.$remove(todo);
	};

	$scope.clearCompletedTodos = function () {
		$scope.todos.forEach(function(todo) {
			if(todo.completed) {
				$scope.removeTodo(todo);
			}
		});
	};

	$scope.markAll = function (allCompleted) {
		$scope.todos.forEach(function(todo) {
			todo.completed = allCompleted;
			$scope.todos.$save(todo);
		});
	};
	
	$scope.changePassword = function(pass, confirm, newPass) {
        resetMessages();
        if( !pass || !confirm || !newPass ) {
          $scope.err = 'Please fill in all password fields';
        }
        else if( newPass !== confirm ) {
          $scope.err = 'New pass and confirm do not match';
        }
        else {
          Auth.$changePassword({email: profile.email, oldPassword: pass, newPassword: newPass})
            .then(function() {
              $scope.msg = 'Password changed';
            }, function(err) {
              $scope.err = err;
            })
        }
      };
      $scope.clear = resetMessages;

      $scope.changeEmail = function(pass, newEmail) {
        resetMessages();
        var oldEmail = profile.email;
        Auth.$changeEmail({oldEmail: oldEmail, newEmail: newEmail, password: pass})
          .then(function() {
            // store the new email address in the user's profile
            return fbutil.handler(function(done) {
              fbutil.ref('users', user.uid, 'email').set(newEmail, done);
            });
          })
          .then(function() {
            $scope.emailmsg = 'Email changed';
          }, function(err) {
            $scope.emailerr = err;
          });
      };
      function resetMessages() {
        $scope.err = null;
        $scope.msg = null;
        $scope.emailerr = null;
        $scope.emailmsg = null;
      }




});

//Displays the Tasks



//todoBlur.js
app.directive('todoBlur', function () {
	return function (scope, elem, attrs) {
		elem.bind('blur', function () {
			scope.$apply(attrs.todoBlur);
		});

		scope.$on('$destroy', function () {
			elem.unbind('blur');
		});
	};
})

//todoEscape.js
app.directive('todoBlur', function () {
	var ESCAPE_KEY = 27;
	return function (scope, elem, attrs) {
		elem.bind('keydown', function (event) {
			if (event.keyCode === ESCAPE_KEY) {
				scope.$apply(attrs.todoEscape);
			}
		});

		scope.$on('$destroy', function () {
			elem.unbind('keydown');
		});
	};
});

//todoFocus.js
app.directive('todoFocus', function todoFocus($timeout) {
	return function (scope, elem, attrs) {
		scope.$watch(attrs.todoFocus, function (newVal) {
			if (newVal) {
				$timeout(function () {
					elem[0].focus();
				}, 0, false);
			}
		});
	};
});

//Comment 
app.directive('tooltip', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            $(element).hover(function(){
                // on mouseenter
                $(element).tooltip('show');
            }, function(){
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
});

})(angular);
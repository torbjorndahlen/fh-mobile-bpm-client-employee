angular.module('starter.controllers', [])

.controller('AccountCtrl', function($scope, $ionicLoading) {
  var message = '';
  // Show loading...
  $scope.show = function() {
    $ionicLoading.show({
      template: '<div class="ion-checkmark">&nbsp;'+message+'</div>',
      duration: 1000
    });
  };

  // Hide loading...
  $scope.hide = function(){
    $ionicLoading.hide();
  };
})

.controller('TasksCtrl', function($scope, $ionicLoading, $ionicModal, $timeout) {
  // Show loading...
  $scope.show = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
  };

  // Hide loading...
  $scope.hide = function(){
    $ionicLoading.hide();
  };

  $scope.credentials = function(){
  };

  $scope.closeLogin = function () {
    if($scope.credentials.password && $scope.credentials.username){
        $scope.showSucces();
        // store the credentials to the mobile device
        window.localStorage.setItem("employee_bpm_username", $scope.credentials.username);
        window.localStorage.setItem("employee_bpm_password", $scope.credentials.password);
        $timeout(function() {
            $scope.login.hide();
            allTasks();
        }, 1000);
      }else{
        $scope.showFailed();
      }
  };

  $scope.showSucces = function() {
    $ionicLoading.show({
      template: '<div class="ion-checkmark">&nbsp;Success</div>',
      duration: 1000
      });
  };

  $scope.showFailed = function() {
    $ionicLoading.show({
      template: '<div class="ion-minus-circled">&nbsp;Login Failed</div>',
      duration: 1500
    });
  };

  $scope.listCanSwipe = true;

  $scope.tasks = [];

  $scope.loadTasks = function(){
    $scope.show();
    allTasks();
  }

  function isBlank(str) {
    return (!str || /^\s*$/.test(str));
  }

  function allTasks(){
      $fh.cloud({
        "path": "/bpm/runtimeTaskQuery",
        "method": "POST",
        "contentType": "application/json",
        "data": {
          "params": {
            "username": window.localStorage.getItem("epmloyee_bpm_username"),
            "password": window.localStorage.getItem("epmloyee_bpm_password")
          }
        }
      }, function(res) {
        if(res.code == 'ECONNREFUSED'){
          $scope.noticeMessage = 'Connection to mBaaS refused';
          $scope.tasks = null;
          $scope.hide();
        }else if(res.error != null){
          $scope.noticeMessage = 'Connection to BPM refused'
          $scope.tasks = null;
          $scope.hide();
        }else{
          $scope.noticeMessage = null;
          $scope.tasks = res.taskInfoList;
          if(res.taskInfoList.length == 0){
            $scope.noticeMessage  = 'Tasklist is empty';
          }else{
            for (i = 0; i < res.taskInfoList.length; i++) {
              for(x = 0; x < res.taskInfoList[i]['variables'].length; x++){
                  if(res.taskInfoList[i]['variables'][x]['name'] == 'username'){
                     res.taskInfoList[i]['created-by'] = res.taskInfoList[i]['variables'][x]['value']['value']
                  }
                }
              }
            var taskArray = new Array();
            for (i = 0; i < res.taskInfoList.length; i++) {
              taskArray.push(res.taskInfoList[i].taskSummaries)
            }
            JSONArray jsonMainArr = taskArray.getJSONArray("source"); 
            $scope.tasks = jsonMainArr
            $scope.noticeMessage = res.taskInfoList
          }
        }
          $scope.hide();
      }, function(msg,err) {
        $scope.tasks = null;
        $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err);
        // Clear loading
        $scope.hide();
      });
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');

  };

  $scope.claimTask = function(task){
      $scope.show();
      $fh.cloud({
        "path": "/bpm/claimTask",
        "method": "POST",
        "contentType": "application/json",
        "data": {
          "params": {
            "username": window.localStorage.getItem("epmloyee_bpm_username"),
            "password": window.localStorage.getItem("epmloyee_bpm_password")
          },
          "taskId": task.id
        }
      }, function(res) {
        if(res.code == 'ECONNREFUSED'){
          $scope.noticeMessage = 'Connection to mBaaS refused';
          $scope.tasks = null;
          $scope.hide();
        }else if(res.error != null){
          $scope.noticeMessage = 'Connection to BPM refused'
          $scope.tasks = null;
          $scope.hide();
        }else{
          allTasks();
        }
      }, function(msg,err) {
        $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err);
        $scope.tasks = null;
        // Clear loading
        $scope.hide();
      });
  };

  $scope.startTask = function(task){
      $scope.show();
      $fh.cloud({
        "path": "/bpm/startTask",
        "method": "POST",
        "contentType": "application/json",
        "data": {
          "params": {
            "username": window.localStorage.getItem("epmloyee_bpm_username"),
            "password": window.localStorage.getItem("epmloyee_bpm_password")
          },
          "taskId": task.id
        }
      }, function(res) {
        if(res.code == 'ECONNREFUSED'){
          $scope.noticeMessage = 'Connection to mBaaS refused';
          $scope.tasks = null;
          $scope.hide();
        }else if(res.error != null){
          $scope.noticeMessage = 'Connection to BPM refused'
          $scope.tasks = null;
          $scope.hide();
        }else{
          allTasks();
        }
      }, function(msg,err) {
        $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err);
        $scope.tasks = null;
        // Clear loading
        $scope.hide();
      });
  };

  $scope.releaseTask = function(task){
      $scope.show();
      $fh.cloud({
        "path": "/bpm/releaseTask",
        "method": "POST",
        "contentType": "application/json",
        "data": {
          "params": {
            "username": window.localStorage.getItem("epmloyee_bpm_username"),
            "password": window.localStorage.getItem("epmloyee_bpm_password")
          },
          "taskId": task.id
        }
      }, function(res) {
        if(res.code == 'ECONNREFUSED'){
          $scope.noticeMessage = 'Connection to mBaaS refused';
          $scope.tasks = null;
          $scope.hide();
        }else if(res.error != null){
          $scope.noticeMessage = 'Connection to BPM refused'
          $scope.tasks = null;
          $scope.hide();
        }else{
          allTasks();
        }
      }, function(msg,err) {
        $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err);
        $scope.tasks = null;
        // Clear loading
        $scope.hide();
      });
  };

  $scope.statusIsReserved = function(task){
        if (task.status == 'Reserved') {
          return true;
        }
        return true;
  };

  $scope.statusIsInProgress = function(task){
      if (task.status == 'InProgress') {
        return true;
      }
      return true;
  };

  $scope.statusIsReady = function(task){
      if (task.status == 'Ready') {
        return true;
      }
      return true;
  };

  // Load the modal from the given template URL
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(login) {
    $scope.login = login;
    login.show();
  });

  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.login.remove();
  });
  // Execute action on hide modal
  $scope.$on('login.hidden', function() {
  });
  // Execute action on remove modal
  $scope.$on('login.removed', function() {
  // Execute action
  });
})

.controller('TaskDetailCtrl', function($scope, $stateParams, $ionicLoading, $ionicModal) {
  $scope.readOnly = 'readonly';

  $scope.show = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
  };

  // Hide loading...
  $scope.hide = function(){
    $ionicLoading.hide();
  };

  function showSuccessMessage() {
    $ionicLoading.show({
      template: '<div class="ion-checkmark">&nbsp; Success</div>',
      duration: 1000
    });
    //Reloading the Task-Tab
    window.location.reload(true);
  };

  $scope.getTaskContent = function(){
    $scope.show();
    loadTaskContent();
  }

  function loadTaskContent(){
    $fh.cloud({
      "path": "/bpm/loadTaskContent",
      "method": "POST",
      "contentType": "application/json",
      "data": {
        "params": {
          "username": window.localStorage.getItem("epmloyee_bpm_username"),
          "password": window.localStorage.getItem("epmloyee_bpm_password")
        },
        "taskId": $stateParams.taskId
      }
    }, function(res) {
      if(res.code == 'ECONNREFUSED'){
        $scope.noticeMessage = 'Connection to mBaaS refused';
        $scope.taskContent = null;
        $scope.hide();
      }else if(res.error != null){
        $scope.noticeMessage = 'Connection to BPM refused'
        $scope.taskContent = null;
        $scope.hide();
      }else{
        $scope.noticeMessage = null;
        $scope.taskContent = res.contentMap;
        $scope.hide();
      }
    }, function(msg,err) {
      $scope.taskContent = null;
      $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err);
      $scope.hide();
    });
    // Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
  };

  function completeTask(){
      $scope.show();
      $fh.cloud({
        "path": "/bpm/completeTask",
        "method": "POST",
        "contentType": "application/json",
        "data": {
          "params": {
            "username": window.localStorage.getItem("epmloyee_bpm_username"),
            "password": window.localStorage.getItem("epmloyee_bpm_password")
          },
          "taskId": $stateParams.taskId,
          "firstname": $scope.taskContent.firstname,
          "lastname": $scope.taskContent.lastname,
          "request": $scope.taskContent.request,
          "decision": $scope.taskContent.decision,
          "decisioncomment": $scope.taskContent.decisioncomment
        }
      }, function(res) {
        if(res.code == 'ECONNREFUSED'){
          $scope.noticeMessage = 'Connection to mBaaS refused';
          $scope.taskContent = null;
          $scope.hide();
        }else if(res.error != null){
          $scope.noticeMessage = 'Connection to BPM refused'
          $scope.taskContent = null;
          $scope.hide();
        }else{
          $scope.hide();
          showSuccessMessage();
        }
      }, function(msg,err) {
        $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err);
        $scope.taskContent = null;
        // Clear loading
        $scope.hide();
      });
  };

  $scope.statusIsInProgress = function(){
      if ($stateParams.status == 'InProgress') {
        return true;
      }
      return false;
  };

  $scope.statusIsReserved = function(){
        if ($stateParams.status == 'Reserved') {
          return true;
        }
        return false;
  };

  // Load the modal from the given template URL
  $ionicModal.fromTemplateUrl('templates/task-detail-edit.html', function($ionicModal) {
    $scope.modal = $ionicModal;
  }, {
    // Use our scope for the scope of the modal to keep it simple
    scope: $scope,
    // The animation we want to use for the modal entrance
    animation: 'slide-in-up'
  });

  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

   $scope.modalCancel = function(){
    $scope.modal.hide();
    $scope.show();
    loadTaskContent();
  }

  $scope.modalComplete = function(){
    completeTask();
    $scope.modal.hide();
    location.href = '#/tab/tasks';
  }

  $scope.modalSave = function(){
    $scope.modal.hide();
  }

})

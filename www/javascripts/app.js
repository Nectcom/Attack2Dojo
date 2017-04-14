var app = angular.module('myApp', ['onsen']);

// what u want? -> toppage.htmlのinputに入力された値をpwdとしてurlに投げ、取得したページをpage1.htmlに出す
app.value('pwds', {
  'login_pass' : {'pwd' : 2384},
  'username': 'crapcrap',
  'userpwd': 'thisistestid',
});
  
app.value('urls', {
  'index' : ['POST', 'https://library.rail-e.or.jp/e-library/Index'],
  'login' : ['GET', 'https://library.rail-e.or.jp/e-library/jsp/dojo/index.jsp'],
  'userLogin' : ['POST' , 'https://library.rail-e.or.jp/e-library/Login']
});

/**
 * HTTP通信を制御する
 * */
app.factory('HTTPRequestService', ['$http', '$q', 'urls', '$httpParamSerializerJQLike', 
  function($http, $q, urls, $httpParamSerializerJQLike){
    var httpRequestService = {};

    /**
     * 指定されたページを取得する
     * @param add_key urls[add_key]でRESTとURLを指定する
     * @param datas 同時に送信するデータ
     * @callback callback
     * */
    this.getHtml = function(add_key, datas, callback){
      // console.debug('request ' + urls[add_key][1]);
      $http({
        method : urls[add_key][0],
        headers : {
        'Content-Type' : 'application/x-www-form-urlencoded'
        },
        transformRequest : $httpParamSerializerJQLike,
        url : urls[add_key][1],
        data : datas
      }).then(function onSuccess(response){
        callback(response.data);
      }, function onError(response){
        console.log('error : ' + urls[add_key][1]);
      });
    };
    
    /**
     * 実力試験道場へログインし、成功判定を行う
     * @param bookcode 会誌のパスコード
     * @param username
     * @param userpass
     * */
    this.userLogin = function(bookcode, username, userpass){
      var deferred = $q.defer();
      var promise = deferred.promise;
      
      promise
      .then(function(bookcode){
        getHtml('index', ['pwd', bookcode], function(data){
          // Error check.
          if(data.match(/TopError/)){
            deferred.reject('booklogin');
          }else{
            deferred.resolve();
          }
        });
      })
      .then(userLogin(username,userpass));
      
      return promise;
    };
    
    /**
     * 2nd. User Login
     * @param username
     * @param userpass
     * */
    var userLogin = function(username, userpass){
      getHtml('login', {}, function(data){
        var loginParams = {
          'act' : 'login',
          'textPersonID' : username,
          'passwordPassword' : userpass,
          'textPersonID_hid' : getEncodeElementValue(username),
          'passwordPassword_hid' : getEncodeElementValue(userpass)
        };
        
        getHtml('userLogin', loginParams, function(data){
          //TODO: error check
          if(data.match(/ログインエラー/)){
            return false;
          }else{
            return true;
          }
        });
        
      });
      
    };
    return httpRequestService;
  }]);
      
/**
 * @classdesc アプリ全体のページ遷移を管理する
 * */
app.controller('PageController', ['$scope', 'pwds', 'urls', 'HTTPRequestService', 
  function($scope, pwds, urls, httpRequestService){
    $scope.pwd = pwds['login_pass']['pwd'];
    $scope.username = pwds['username'];
    $scope.userpwd = pwds['userpwd'];
    $scope.urls = urls;
    $scope.data = 'no name';

    $scope.firstLogin = function(){
      console.debug('go login.');
      $scope.isSpin = true;

      // Fail pattern.
      // httpRequestService.getHtml('index', {}, function(data){
      httpRequestService.getHtml('index', pwds['login_pass'], function(data){

        // Error Handring.
        if(data.match(/TopError/)){
          console.log("Password missed");
          alert('実力試験道場のパスワードが間違っています');
          $scope.isSpin = false;
          return;
        }

        httpRequestService.getHtml('login', {}, function(data){
          // console.debug($(data).find('.footer').text());
          var loginQuery = $(data);
          
          loginQuery.find('.login_input01 > #textPersonId').val($scope.username);
          loginQuery.find('#passwordPassword').val($scope.userpwd);

          // Do Login submit.
          var personID = loginQuery.find('#textPersonId').val();
          var password = loginQuery.find('#passwordPassword').val();
          
          loginQuery.find('#textPersonId_hid').val(getEncodeElementValue(personID));
          loginQuery.find('#passwordPassword_hid').val(getEncodeElementValue(password));
          loginQuery.find('input[name=act]').val('input');

         var params = { 'act' : 'login',
                        'textPersonId' : personID, 'passwordPassword' : password,
                        'textPersonId_hid' : getEncodeElementValue(personID),
                        'passwordPassword_hid' : getEncodeElementValue(password)
                       };

          httpRequestService.getHtml('userLogin', params, makeFiledList(data));

          $scope.app.slidingMenu.setMainPage('page1.html');
        });
      });

      // make main page test list.
      // @params data return html data
      function makeFieldList(data){
        
      }
    }
}]);
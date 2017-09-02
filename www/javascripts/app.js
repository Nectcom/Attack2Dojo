var app = angular.module('myApp', ['onsen']);

// what u want? -> toppage.htmlのinputに入力された値をpwdとしてurlに投げ、取得したページをpage1.htmlに出す
app.value('pwds', {
  'login_pass' : {'pwd' : 3770},
  'username': 'crapcrap',
  'userpwd': 'thisistestid',
});
  
app.value('urls', {
  'index' : ['POST', 'https://library.rail-e.or.jp/e-library/Index'],
  'login' : ['GET', 'https://library.rail-e.or.jp/e-library/jsp/dojo/index.jsp'],
  'userLogin' : ['POST' , 'https://library.rail-e.or.jp/e-library/Login']
});


app.service('LoginService', ['$http', '$q', '$httpParamSerializer', 
  function($http, $q, $httpParamSerializer){
    /**
     * 道場パスとユーザーログインを一度に行う
     * 
     * @param bookPass 雑誌掲載のパスワード
     * @param username
     * @param userPass ユーザーログイン用のパスワード
     */
    this.login = function(bookPass, username, userPass){
      var responceText = '';
      var self = this;
      var phase1 = this.htmlRequest('POST', 'https://library.rail-e.or.jp/e-library/Index', {'pwd': bookPass});
      var phase2 = phase1.then(function onSuccess(responce){
          // Error check.
          if(responce.data.match(/TopError/)){
            console.error('Phase1 Responce Error');
            responceText = responce.data;
            return $q.reject('Phase1 Responce Error');
          }
          
          return self.htmlRequest('GET', 'https://library.rail-e.or.jp/e-library/jsp/dojo/index.jsp');
        }, function onError(responce){
          console.error('Phase1 HTTP Error.');
      });
      
      var phase3 = phase2.then(function onSuccess(responce){
          var userForm = new FormData();
          userForm.append('act', 'login');
          userForm.append('textPersonID', username);
          userForm.append('passwordPassword', userPass);
          userForm.append('textPersonID_hid', getEncodeElementValue(username));
          userForm.append('passwordPassword_hid', getEncodeElementValue(userPass));
          
          return self.htmlRequest('POST', 'https://library.rail-e.or.jp/e-library/Login', 
            {'act' : 'login',
            'textPersonID': username,
            'passwordPassword' : userPass,
            'textPersonID_hid' : getEncodeElementValue(username),
            'passwordPassword_hid' : getEncodeElementValue(userPass),
            'checkRemember' : ''
            });
          
          // return $http({ method : 'POST',
          //   headers : { 'Content-Type' : 'application/x-www-form-urlencoded' },
          //   url : 'https://library.rail-e.or.jp/e-library/Login',
          //   data : userForm
          // });
        }, function onError(responce){
          console.error('Phase2 HTTP Error.');
      });
        
      phase3.then(function onSuccess(responce){
        // Error check.
        if(responce.data.match(/ログインエラー/)){
          console.error('Phase3 Responce Error.');
          responceText = responce.data;
          return $q.reject;
        }
        responceText = responce.data;
      }, function onError(responce){
        console.error('Phase3 HTTP Error.');
      });
      
      // Complete session.
      $q.all([phase1, phase2, phase3]).then(function(){
        console.log('logged in.');
        console.log(responceText);
      },
      function(){
        console.log(responceText);
        return responceText;
      });
      
    };
    
    /**
     * HTTPリクを送信してその$qを返す
     * 
     * @param type
     * @param url
     * @pram param
     * 
     * @return http Q object
     */
    this.htmlRequest = function(type, url, param){
      return $http({
        method : type,
        headers : { 'Content-Type' : 'application/x-www-form-urlencoded; charset=Shift-JIS' },
        url : url,
        data : $httpParamSerializer(param)
      });
    };

    /**
     * Common.jpよりコピー
     * まさかの(簡易式)自己暗号化
     * 
     * @param elementValue 暗号化したい値
     * @return 暗号化後の値
     */
    this.getEncodeElementValue = function(elementValue){
		  var elementValueBefChg = elementValue;
      var elementValueAftChg = "";
      for(i=0;i<elementValueBefChg.length;i++){
        var eachValue = elementValueBefChg.charCodeAt(i);
        var eachEncodeValue = eachValue-7;
        if(i!=0){
          elementValueAftChg=elementValueAftChg+","+eachEncodeValue;
        }else{
          elementValueAftChg=eachEncodeValue;
        }  
      }
      return elementValueAftChg;
	  };
}]);

/**
 * @classdesc アプリ全体のページ遷移を管理する
 * */
app.controller('PageController', ['$scope', 'pwds', 'urls', 'LoginService', 
  function($scope, pwds, urls, LoginService){
    $scope.pwd = pwds['login_pass']['pwd'];
    $scope.username = pwds['username'];
    $scope.userpwd = pwds['userpwd'];
    $scope.urls = urls;
    $scope.data = 'no name';

    $scope.firstLogin = function(){
      console.debug('go login.');
      $scope.isSpin = true;
      myNavigator.pushPage('page1.html');
      
      var responceText = LoginService.login($scope.pwd, $scope.username, $scope.userpwd);
      // $scope.debugdata = responceText;  
    };
}]);
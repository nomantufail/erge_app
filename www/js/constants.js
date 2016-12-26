angular.module('constants', [])
  .constant('API',
  {
    //BASE_URL: 'http://vengiledevs.cloudapp.net/hungrr/public/api/v1/',
    //BASE_URL: 'http://vengiledevs.cloudapp.net/erge/ergeapi/',
    //BASE_URL: 'http://localhost/erge/api/public/',
    BASE_URL: 'http://139.162.37.73/erge/',
    API_KEY: 'LpmEDriRQdKoGAPzRAlstFVEVbjPyPah',
    appToken: "LpmEDriRQdKoGAPzRAlstFVEVbjPyPah",
    stripe_public_key: 'pk_test_ILmH6W3u0aitZhKBsxW6LVSZ'
  }
)
  .constant('MESSAGES',
  {
    ERROR_MESSAGE: 'Something went wrong please check your internet connection!',
    SESSION_EXP: 'Your session expired, login again',
    hello: function () {
    }
  }
);

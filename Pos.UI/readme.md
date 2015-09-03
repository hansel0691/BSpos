# POS Angular JS App Notes

index.html - html compress, css compress, js compress
dev.html -  js concatenate, css minify
pos.html


### Install new package dependency
```batch
bower install <angular-package> --save-dev
```
or
```batch
bower install <angular-package> -D
```

### Todo
+ implement [HTTP Auth Interceptor Module](https://github.com/witoldsz/angular-http-auth). Check for the following HTTP status codes to comunicate with API service providing a more detailed info about the response. More info in [this tutorial](https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec). Like:
    * 401 Unauthorized — The user is not logged in
    * 403 Forbidden — The user is logged in but isn’t allowed access
    * 419 Authentication Timeout (non standard) — Session has expired
    * 440 Login Timeout (Microsoft only) — Session has expired


# Absolute Url Interceptor
An interceptor for HttpClient which will automate 

## Usage
```
//app.server.module.ts
@NgModlue({
  import: [ AbsoluteUrlInterceptorModule ]
})

//dynamic / express
res.render('../dist/index', {
    req,
    res,
    providers: [
      { provide: UNIVERSAL_BASE_URL, useValue: `${req.protocol}://${req.get('host')}` },
    ]
  });
```


# egg-router

This is an egg plugin, for **AUTO** router.

[What is egg?](https://eggjs.org/)

Files in /app/controller can be auto routed now, you needn't write router.js.

## Enable plugin

Install

```
npm i egg-router --save
```

Modify plugin.js to enable plugin

```
autorouter: {
  enable: true,
  package: 'egg-router',
}
```

## Controller syntactic sugar

egg-router use method name as route name.


### Use "verb middlewares method-name"

* "VERB ...middlewares helloWorld"  => VERB: /path/your-filename/helloWorld

* "VERB ...middlewares /helloWorld"  => VERB: /hellWorld 

verbs list:

`get, post, put, delete, patch, head, options, all`

Sample：

```js
// file: app/controller/open/test.js
module.exports = {
  // Will map to: PUT /open/test/helleWorld/ABC
  "PUT helloWorld/ABC": (ctx)=>{
    ctx.body = {a: 1}
  },
  // Will map to: DELETE /helloWorld/ABC, after use mymiddle
  "DELETE mymiddle /helloWorld/ABC": (ctx)=>{
    ctx.body = {success: true}
  }
}
```

### Directly map

Rules:

* helloWorld  => GET: /path/yourFilename/hello-world

* $helloWorld  => POST: /path/yourFilename/hello-world
 
* $$helloWorld  => PUT: /path/yourFilename/hello-world

* _helloWorld  => DELETE: /path/yourFilename/hello-world

* __helloWorld  => PATCH: /path/yourFilename/hello-world

Uppercase char will be transfered to minus and lowercase.

Sample:

```js
// file: app/controller/open/test.js
module.exports = {
  // Will map to PUT: /open/test/hello-world
  $$helloWorld: (ctx)=>{
    ctx.body = {a: 1}
  }
  // Will map to DELETE: /open/test/hello-world
  _helloWorld: (ctx)=>{
    ctx.body = {success: true}
  }
}
```

### No method name

Rules list:

* ""  => GET: /path/your-filename

* $  => POST: /path/your-filename
 
* $$  => PUT: /path/your-filename

* _  => DELETE: /path/your-filename

* __  => PATCH: /path/your-filename


### Multi-verb

Sample:

```js
"post|delete|put someMethod"(ctx){
	//....
}
```



 
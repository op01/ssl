Super Supreme Library
=====================
Compile and run untrusted program securely (?)

API
---
```javascript
// request
{
  "source_code":"print(1+2)",
  "langauge":"python3"
}

// response
{
  "stdout":"3\n"
}
```
Docker
-----
Running inside docker need `--privileged` option

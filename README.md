Super Supreme Library
=====================
Compile and run untrusted program securely (?)

API
---
```javascript
// request
{
  "source_code":"print(sum([int(i) for i in input().split()]))",
  "langauge":"python3",
  "stdin":"3 4 5"
}

// response
{
  "stdout":"12\n"
}
```
Docker
-----
Running inside docker need `--privileged` option

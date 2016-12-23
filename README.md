Super Supreme Library
=====================
[![Build Status](https://travis-ci.org/op01/ssl.svg?branch=master)](https://travis-ci.org/op01/ssl)

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
Supported langauges
-------------------
- C++
- Python3
- Haskell

Docker
-----
Running inside docker need `--privileged` option

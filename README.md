# Async Channels

[![Test](https://github.com/Eyal-Shalev/async_channels/actions/workflows/test.yml/badge.svg)](https://github.com/Eyal-Shalev/async_channels/actions/workflows/test.yml)

Inspired by `Go` & `Clojure` Channels, `async_channels` provides channels as an
asynchronous communication method between asynchronous functions.

## Installation

### Vanilla JS (CDN)

Import the module from one of the CDNs that mirror
[npmjs.com](https://npmjs.com):

- [skypack/@eyalsh/async_channels](https://skypack.dev/view/@eyalsh/async_channels)
- [unpkg/@eyalsh/async_channels](https://unpkg.com/@eyalsh/async_channels/dist/async_channels.esm.js)

```javascript
import { Channel } from "https://cdn.skypack.dev/@eyalsh/async_channels";
const ch = new Channel();
// ...
```

### Vanilla JS (Download)

A compiled version exists for every major dependency management system in the
[releases section](https://github.com/Eyal-Shalev/async_channels/releases).\
Download one of them and import it

```javascript
import { Channel } from "/path/to/async_channels.esm.js";
const ch = new Channel();
// ...
```

## Example

```typescript
import { Channel } from "https://deno.land/x/async_channels/mod.ts";

const sleep = (duration: number) =>
  new Promise<void>((res) => {
    setTimeout(() => res(), duration);
  });

function produce(num: number) {
  const ch = new Channel(0);
  (async () => {
    for (let i = 0; i < num; i++) {
      await sleep(500); // Do some work...
      await ch.add(i++);
    }
    ch.close();
  })();

  return ch;
}

sleep(200).then(() => console.log("boo"));

for await (let product of produce(5)) {
  console.log({ product });
}
```

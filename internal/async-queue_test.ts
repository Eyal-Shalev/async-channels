#!/usr/bin/env -S deno test --lock lock.test.json --import-map import_map.json

import { assertEquals } from "deno/testing/asserts.ts";
import { AsyncQueue } from "./async-queue.ts";

Deno.test("no-buffer remove -> add", async () => {
  const stack = new AsyncQueue<string>(0);

  assertEquals(
    await Promise.all([stack.remove(), stack.add("a")]),
    [["a", true], undefined],
  );
});

Deno.test("no-buffer add -> remove", async () => {
  const stack = new AsyncQueue<string>(0);

  assertEquals(
    await Promise.all([stack.add("a"), stack.remove()]),
    [undefined, ["a", true]],
  );
});

Deno.test("no-buffer remove -> remove -> add -> add", async () => {
  const stack = new AsyncQueue<string>(0);

  assertEquals(
    await Promise.all([
      stack.remove(),
      stack.remove(),
      stack.add("a"),
      stack.add("b"),
    ]),
    [["a", true], ["b", true], undefined, undefined],
  );
});

Deno.test("no-buffer add -> add -> remove -> remove", async () => {
  const stack = new AsyncQueue<string>(0);

  assertEquals(
    await Promise.all([
      stack.add("a"),
      stack.add("b"),
      stack.remove(),
      stack.remove(),
    ]),
    [undefined, undefined, ["a", true], ["b", true]],
  );
});

Deno.test("no-buffer add -> remove; remove -> add", async () => {
  const stack = new AsyncQueue<string>(0);

  assertEquals(
    await Promise.all([stack.add("a"), stack.remove()]),
    [undefined, ["a", true]],
  );
  assertEquals(
    await Promise.all([stack.remove(), stack.add("b")]),
    [["b", true], undefined],
  );
});

Deno.test("buffered add -> remove", async () => {
  const stack = new AsyncQueue<string>(1);

  await stack.add("a");
  assertEquals(await stack.remove(), ["a", true]);
});

Deno.test("buffered add -> add -> remove -> remove", async () => {
  const stack = new AsyncQueue<string>(1);

  await stack.add("a");

  assertEquals(
    await Promise.all([stack.add("b"), stack.remove()]),
    [undefined, ["a", true]],
  );

  assertEquals(await stack.remove(), ["b", true]);
});

Deno.test("buffered add -> remove; remove -> add", async () => {
  const stack = new AsyncQueue<string>(1);

  await stack.add("a");
  assertEquals(await stack.remove(), ["a", true]);
  await stack.add("a");
  assertEquals(await stack.remove(), ["a", true]);
});

Deno.test("buffered add -> add -> add -> remove -> remove -> remove", async () => {
  const stack = new AsyncQueue<string>(2);

  await stack.add("a");
  await stack.add("b");

  assertEquals(
    await Promise.all([stack.add("c"), stack.remove()]),
    [undefined, ["a", true]],
  );

  assertEquals(await stack.remove(), ["b", true]);
  assertEquals(await stack.remove(), ["c", true]);
});

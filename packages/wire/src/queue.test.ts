import { AsyncQueue } from '../src/queue.js';
import { messages } from '../src/messages.js';

// A complete ReadyForQuery server message: indicator 'Z' (0x5A), Int32 length
// = 5, then a single transaction-status byte ('I').
const READY_FOR_QUERY = Buffer.from([0x5a, 0x00, 0x00, 0x00, 0x05, 0x49]);

// Mimics exactly what the socket 'data' handler does in AsyncQueue.connect():
// append the bytes to the buffer and run the queue.
function feed(queue: AsyncQueue, bytes: Buffer): void {
  queue.buffer = Buffer.concat([queue.buffer, bytes]);
  queue.processQueue();
}

// Resolves true if `promise` settles within `ms`, false otherwise (i.e. a hang).
function resolvesWithin(promise: Promise<unknown>, ms: number): Promise<boolean> {
  return Promise.race([
    promise.then(() => true),
    new Promise<boolean>((resolve) => setTimeout(() => resolve(false), ms)),
  ]);
}

test('AsyncQueue resolves consecutive replies under normal ordering', async () => {
  const queue = new AsyncQueue();

  const first = queue.reply(messages.readyForQuery);
  feed(queue, READY_FOR_QUERY);
  await first;

  const second = queue.reply(messages.readyForQuery);
  feed(queue, READY_FOR_QUERY);

  expect(await resolvesWithin(second, 500)).toBe(true);
  queue.socket.destroy();
});

// Regression test: a 'data' event can arrive after one reply() resolves but
// before the next reply() is registered (the window opened by macrotask-
// yielding awaits between replies). Previously processQueue() left the settled
// waiter in this.replyPending, so this stray data was parsed against it,
// resolve() was a no-op, and the message was dropped — hanging the next reply()
// forever.
test('AsyncQueue does not drop a message that arrives before the next reply() is registered', async () => {
  const queue = new AsyncQueue();

  const first = queue.reply(messages.readyForQuery);
  feed(queue, READY_FOR_QUERY);
  await first; // first waiter has settled

  // Stray 'data' delivered while replyPending still references the settled
  // waiter, before the next reply() registers.
  feed(queue, READY_FOR_QUERY);

  const second = queue.reply(messages.readyForQuery);

  expect(await resolvesWithin(second, 500)).toBe(true);
  queue.socket.destroy();
});

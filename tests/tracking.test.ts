import assert from "node:assert/strict";
import { test } from "node:test";

import {
  captureAttribution,
  getAttribution,
  getLastTouchAttribution,
  LANGUAGE,
  pushDataLayer,
  SITE_ID,
  SITE_NAME,
  trackPageView,
} from "../lib/tracking";

test("site identity constants match the Kazanım tracking plan", () => {
  assert.equal(SITE_ID, "kazanim");
  assert.equal(SITE_NAME, "Kazanım Gayrimenkul");
  assert.equal(LANGUAGE, "tr");
});

test("tracking helpers are no-ops server-side and never throw", () => {
  // No `window` in the Node test runner — every helper must fail silently.
  assert.doesNotThrow(() => pushDataLayer("test_event", { event_label: "x" }));
  assert.doesNotThrow(() => trackPageView());
  assert.deepEqual(captureAttribution(), {});
  assert.deepEqual(getAttribution(), {});
  assert.deepEqual(getLastTouchAttribution(), {});
});

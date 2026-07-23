import assert from "node:assert/strict";
import { test } from "node:test";

import {
  cn,
  formatDateShortTR,
  formatDateTR,
  parseJson,
  slugify,
  telHref,
  truncate,
  whatsappUrl,
} from "../lib/utils";

test("slugify handles Turkish characters", () => {
  assert.equal(slugify("Kazanım Yaşam Evleri"), "kazanim-yasam-evleri");
  assert.equal(slugify("Güvenli Yatırım & Kalıcı Değer"), "guvenli-yatirim-kalici-deger");
  assert.equal(slugify("ÇĞİÖŞÜ çğıöşü"), "cgiosu-cgiosu");
});

test("slugify collapses whitespace and dashes", () => {
  assert.equal(slugify("  çok   boşluk  "), "cok-bosluk");
  assert.equal(slugify("a--b---c"), "a-b-c");
});

test("formatDateTR renders Turkish long dates", () => {
  assert.equal(formatDateTR(new Date(2026, 6, 23)), "23 Temmuz 2026");
  assert.equal(formatDateTR(null), "");
  assert.equal(formatDateTR("not-a-date"), "");
});

test("formatDateShortTR pads day and month", () => {
  assert.equal(formatDateShortTR(new Date(2026, 0, 5)), "05.01.2026");
});

test("truncate cuts on a word boundary", () => {
  const text = "Kazanım Gayrimenkul değer odaklı projeler geliştirir";
  const result = truncate(text, 30);
  assert.ok(result.length <= 31); // includes the ellipsis
  assert.ok(result.endsWith("…"));
  assert.ok(!result.includes("geliştirir"));
});

test("parseJson falls back safely", () => {
  assert.deepEqual(parseJson('{"a":1}', {}), { a: 1 });
  assert.deepEqual(parseJson("not json", { fallback: true }), { fallback: true });
  assert.deepEqual(parseJson(null, []), []);
  assert.deepEqual(parseJson({ already: "object" }, {}), { already: "object" });
});

test("whatsappUrl strips non-digits and encodes the message", () => {
  assert.equal(whatsappUrl("+90 (555) 000 00 00"), "https://wa.me/905550000000");
  assert.ok(
    whatsappUrl("905550000000", "Merhaba, bilgi almak istiyorum").includes(
      "text=Merhaba%2C%20bilgi%20almak%20istiyorum",
    ),
  );
});

test("telHref keeps digits and plus sign", () => {
  assert.equal(telHref("+90 555 000 00 00"), "tel:+905550000000");
});

test("cn joins truthy class names", () => {
  assert.equal(cn("a", false, null, undefined, "b"), "a b");
});

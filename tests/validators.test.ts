import assert from "node:assert/strict";
import { test } from "node:test";

import {
  careerFormSchema,
  contactFormSchema,
  fieldErrors,
  projectLeadFormSchema,
} from "../lib/validators";

const VALID_CONTACT = {
  name: "Test Kişi",
  phone: "0555 000 00 00",
  email: "test@example.com",
  subject: "Proje Bilgi Talebi",
  message: "Bilgi almak istiyorum.",
  kvkk: true,
  website: "",
};

test("contact form accepts a valid submission", () => {
  const result = contactFormSchema.safeParse(VALID_CONTACT);
  assert.ok(result.success);
});

test("contact form requires KVKK approval", () => {
  const result = contactFormSchema.safeParse({ ...VALID_CONTACT, kvkk: false });
  assert.ok(!result.success);
  if (!result.success) {
    assert.ok(fieldErrors(result.error).kvkk);
  }
});

test("contact form rejects short phone numbers", () => {
  const result = contactFormSchema.safeParse({ ...VALID_CONTACT, phone: "1234" });
  assert.ok(!result.success);
});

test("honeypot value causes validation failure", () => {
  const result = contactFormSchema.safeParse({ ...VALID_CONTACT, website: "spam" });
  assert.ok(!result.success);
});

test("attribution fields, including extended click IDs, are accepted", () => {
  const result = projectLeadFormSchema.safeParse({
    ...VALID_CONTACT,
    projectSlug: "kazanim-vadi",
    utmSource: "google",
    utmMedium: "cpc",
    utmCampaign: "lansman",
    gclid: "abc123",
    gbraid: "gb123",
    wbraid: "wb123",
    fbclid: "fb123",
    msclkid: "ms123",
    landingPage: "/projeler/kazanim-vadi",
    referrer: "https://www.google.com/",
  });
  assert.ok(result.success);
});

test("career form works without an email or position", () => {
  const result = careerFormSchema.safeParse({
    name: "Aday Kişi",
    phone: "05550000000",
    email: "",
    positionId: "",
    message: "",
    cvUrl: "",
    kvkk: true,
    website: "",
  });
  assert.ok(result.success);
});

test("fieldErrors flattens issues to a field → message map", () => {
  const result = contactFormSchema.safeParse({ name: "x", phone: "1", kvkk: false });
  assert.ok(!result.success);
  if (!result.success) {
    const errors = fieldErrors(result.error);
    assert.ok(errors.name);
    assert.ok(errors.phone);
    assert.ok(errors.kvkk);
  }
});

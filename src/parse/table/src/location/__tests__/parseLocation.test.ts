import { parseLocation } from "src/parse/table/src/location/parseLocation";
import { describe, expect, test } from "vitest";

describe("parseLocation.test.ts", () => {
  test("undefined returns undefined", () => {
    expect(parseLocation(undefined)).toBeUndefined();
  });
  test("US city", () => {
    expect(parseLocation("Linden, NJ")).toStrictEqual({
      city: "Linden",
      state: "NJ",
      country: "United States",
    });
  });
  test("US city no comma", () => {
    expect(parseLocation(`Boston MA`)).toStrictEqual({
      country: "United States",
      state: "MA",
      city: "Boston",
    });
  });
  test("2 US cities", () => {
    expect(
      parseLocation(`
            Burlingame, CA
            Redmond, WA
        `),
    ).toStrictEqual({
      city: "Burlingame",
      state: "CA",
      country: "United States",
    });
  });
  test("UK maps to united kingdom", () => {
    expect(parseLocation("London, UK")).toStrictEqual({
      city: "London",
      country: "United Kingdom",
    });
  });
  test("Canadian city", () => {
    expect(
      parseLocation(`
            Toronto, ON, Canada
            Vancouver, BC, Canada    
        `),
    ).toStrictEqual({
      city: "Toronto",
      state: "ON",
      country: "Canada",
    });
  });
  test("NYC", () => {
    expect(parseLocation(`NYC`)).toStrictEqual({
      city: "New York City",
      state: "NY",
      country: "United States",
    });
  });
  test("Remote in USA", () => {
    expect(parseLocation(`Remote in USA`)).toStrictEqual({
      country: "United States",
      type: "Remote",
    });
  });
  test("Remote in Canada", () => {
    expect(parseLocation(`Remote in Canada`)).toStrictEqual({
      country: "Canada",
      type: "Remote",
    });
  });
  test("state and country", () => {
    expect(parseLocation(`New York, United States`)).toStrictEqual({
      country: "United States",
      state: "New York",
    });
  });
  test("Washington, D.C.", () => {
    expect(parseLocation(`Washington, D.C.`)).toStrictEqual({
      city: "Washington",
      state: "DC",
      country: "United States",
    });
  });
  test("Remote only", () => {
    expect(parseLocation(`Remote`)).toStrictEqual({
      type: "Remote",
    });
  });
  test("America", () => {
    expect(parseLocation(`America`)).toStrictEqual({
      country: "United States",
    });
    expect(parseLocation(`United states of america`)).toStrictEqual({
      country: "United States",
    });
  });
  test("Redmond, Washington, USA", () => {
    expect(parseLocation(`Redmond, Washington, USA`)).toStrictEqual({
      city: "Redmond",
      state: "Washington",
      country: "United States",
    });
  });
  test("St. Petersburg, FL", () => {
    expect(parseLocation(`St. Petersburg, FL`)).toStrictEqual({
      city: "St. Petersburg",
      state: "FL",
      country: "United States",
    });
  });
  test("Bellevue, Washington", () => {
    expect(parseLocation(`Bellevue, Washington`)).toStrictEqual({
      city: "Bellevue",
      state: "Washington",
      country: "United States",
    });
  });
  test("United States", () => {
    expect(parseLocation(`United States`)).toStrictEqual({
      country: "United States",
    });
  });
  test("San Jose", () => {
    expect(parseLocation(`San Jose`)).toStrictEqual({
      city: "San Jose",
      country: "United States",
    });
  });
  test("Atlanta Georgia", () => {
    expect(parseLocation(`Atlanta Georgia`)).toStrictEqual({
      city: "Atlanta",
      state: "Georgia",
      country: "United States",
    });
  });
  test("states only", () => {
    expect(parseLocation(`SF`)).toStrictEqual({
      state: "SF",
      country: "United States",
    });
    expect(parseLocation(`Texas`)).toStrictEqual({
      state: "Texas",
      country: "United States",
    });
    expect(parseLocation(`Arizona`)).toStrictEqual({
      state: "Arizona",
      country: "United States",
    });
    expect(
      parseLocation(`
            Texas
            Arizona
        `),
    ).toStrictEqual({
      state: "Texas",
      country: "United States",
    });
  });
});

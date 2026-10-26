import { test } from "node:test";
import assert from "node:assert/strict";
import { buildListQuery, clampPage, toSort } from "./query.ts";

const TODAY = "2026-10-26";

test("por defecto: discover populares, página 1", () => {
  const { path, params } = buildListQuery({}, TODAY);
  assert.equal(path, "/discover/movie");
  assert.equal(params.get("sort_by"), "popularity.desc");
  assert.equal(params.get("page"), "1");
  assert.equal(params.get("with_genres"), null);
});

test("género y orden mejor valoradas", () => {
  const { params } = buildListQuery({ genre: "28", sort: "top" }, TODAY);
  assert.equal(params.get("with_genres"), "28");
  assert.equal(params.get("sort_by"), "vote_average.desc");
  assert.equal(params.get("vote_count.gte"), "300");
});

test("recientes limita a hoy; género inválido se ignora", () => {
  const { params } = buildListQuery({ sort: "recent", genre: "28,abc" }, TODAY);
  assert.equal(params.get("primary_release_date.lte"), TODAY);
  assert.equal(params.get("with_genres"), null);
});

test("búsqueda usa /search/movie e ignora género", () => {
  const { path, params } = buildListQuery({ q: "  matrix ", genre: "28", page: "3" }, TODAY);
  assert.equal(path, "/search/movie");
  assert.equal(params.get("query"), "matrix");
  assert.equal(params.get("with_genres"), null);
  assert.equal(params.get("page"), "3");
});

test("página y orden se sanean", () => {
  assert.equal(clampPage("0"), 1);
  assert.equal(clampPage("999"), 500);
  assert.equal(clampPage("abc"), 1);
  assert.equal(toSort("hack"), "popular");
});

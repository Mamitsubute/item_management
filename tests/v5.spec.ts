import { test, expect } from "@playwright/test";
import path from "path";

const url = `file://${path.resolve(__dirname, "../v5/index.html")}`;

test.beforeEach(async ({ page }) => {
  await page.goto(url);
});

test("page title is correct", async ({ page }) => {
  await expect(page).toHaveTitle("Item Management web");
});

test("header shows correct title", async ({ page }) => {
  await expect(page.locator("header h1")).toContainText("Item Management Web");
});

test("Product List nav link is active by default", async ({ page }) => {
  const link = page.locator("nav a.active");
  await expect(link).toHaveText("Product List");
});

test("product table headers are in English", async ({ page }) => {
  const headers = page.locator("#productsTable thead th");
  await expect(headers.nth(0)).toHaveText("Product Name");
  await expect(headers.nth(1)).toHaveText("Price");
  await expect(headers.nth(2)).toHaveText("Stock");
  await expect(headers.nth(3)).toHaveText("Details");
});

test("initial products are listed in English", async ({ page }) => {
  const rows = page.locator("#productsTable tbody tr");
  await expect(rows).toHaveCount(3);
  await expect(rows.nth(0).locator("td").nth(0)).toHaveText("Strawberry");
  await expect(rows.nth(1).locator("td").nth(0)).toHaveText("Grape");
  await expect(rows.nth(2).locator("td").nth(0)).toHaveText("Banana");
});

test("clicking Details button opens product detail modal", async ({ page }) => {
  await page.locator(".detail-btn").first().click();
  const modal = page.locator("#detailModal");
  await expect(modal).toBeVisible();
  await expect(modal.locator("h3")).toHaveText("Product Details");
  await expect(modal.locator("table")).toContainText("Strawberry");
  await expect(modal.locator("table")).toContainText("Tochigi, Japan");
});

test("detail modal closes on clicking X", async ({ page }) => {
  await page.locator(".detail-btn").first().click();
  await page.locator("#detailModal .close").click();
  await expect(page.locator("#detailModal")).toBeHidden();
});

test("clicking Add New button opens add modal", async ({ page }) => {
  await page.locator("button.btn", { hasText: "Add New" }).click();
  const modal = page.locator("#addModal");
  await expect(modal).toBeVisible();
  await expect(modal.locator("h3")).toHaveText("Add Product");
});

test("add modal form labels are in English", async ({ page }) => {
  await page.locator("button.btn", { hasText: "Add New" }).click();
  const labels = page.locator("#addForm label");
  await expect(labels.nth(0)).toHaveText("Product Name");
  await expect(labels.nth(1)).toHaveText("Price");
  await expect(labels.nth(2)).toHaveText("Stock");
  await expect(labels.nth(3)).toHaveText("Supplier");
  await expect(labels.nth(4)).toHaveText("Cost");
  await expect(labels.nth(5)).toHaveText("Origin");
});

test("Cancel button closes add modal", async ({ page }) => {
  await page.locator("button.btn", { hasText: "Add New" }).click();
  await page.locator("#addModal .btn-secondary").click();
  await expect(page.locator("#addModal")).toBeHidden();
});

test("adding a new product appends it to the table", async ({ page }) => {
  await page.locator("button.btn", { hasText: "Add New" }).click();
  await page.fill("#productName", "Apple");
  await page.fill("#price", "400");
  await page.fill("#stock", "15");
  await page.fill("#supplier", "DDD Trading");
  await page.fill("#cost", "150");
  await page.fill("#origin", "Aomori, Japan");
  await page.locator("#addForm button[type='submit']").click();

  const rows = page.locator("#productsTable tbody tr");
  await expect(rows).toHaveCount(4);
  await expect(rows.nth(3).locator("td").nth(0)).toHaveText("Apple");
});

test("newly added product Details button works", async ({ page }) => {
  await page.locator("button.btn", { hasText: "Add New" }).click();
  await page.fill("#productName", "Orange");
  await page.fill("#price", "350");
  await page.fill("#stock", "10");
  await page.fill("#supplier", "EEE Trading");
  await page.fill("#cost", "120");
  await page.fill("#origin", "Ehime, Japan");
  await page.locator("#addForm button[type='submit']").click();

  const rows = page.locator("#productsTable tbody tr");
  await rows.nth(3).locator(".detail-btn").click();
  await expect(page.locator("#detailModal")).toBeVisible();
  await expect(page.locator("#detailContent")).toContainText("Orange");
});

test("switching to Q&A page works", async ({ page }) => {
  await page.locator("nav a", { hasText: "Q&A" }).click();
  await expect(page.locator("#qa")).toBeVisible();
  await expect(page.locator("#qa")).toContainText("This is the Q&A page.");
  await expect(page.locator("#products")).toBeHidden();
});

test("switching back to Product List page works", async ({ page }) => {
  await page.locator("nav a", { hasText: "Q&A" }).click();
  await page.locator("nav a", { hasText: "Product List" }).click();
  await expect(page.locator("#products")).toBeVisible();
  await expect(page.locator("#qa")).toBeHidden();
});

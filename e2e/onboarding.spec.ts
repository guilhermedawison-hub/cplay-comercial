import { test, expect } from "./fixtures";

test("user onboarding", async ({ page, isMobile, menu, dismissToast }) => {
  await page.goto("/");

  // The public/onboarding shell still comes from Atomic CRM while the authenticated
  // application is branded as CPlay Comercial.
  await expect(page).toHaveTitle(/CPlay Comercial|Atomic CRM/);
  await expect(page.getByText("Welcome to Atomic CRM")).toBeVisible();

  await page.getByLabel("First name").fill("John");
  await page.getByLabel("Last name").fill("Doe");
  await page.getByLabel("Email").fill("john@doe.com");
  await page.getByLabel("Password").fill("password");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page.getByText("What's next?")).toBeVisible();
  await expect(page.getByText("1/3 done")).toBeVisible();
  await expect(page.getByText("Install Atomic CRM")).toBeVisible();
  await expect(page.getByText("Adicionar primeiro contato")).toBeVisible();
  await expect(page.getByText("Add your first note")).toBeVisible();
  await expect(page.getByRole("button", { name: "Import data" })).toBeVisible();

  await page
    .getByRole(isMobile ? "button" : "link", {
      name: /Add contact|Adicionar contato/,
    })
    .click();
  await page.waitForLoadState("networkidle");
  await page.getByLabel("She/Her").click();
  await page.getByLabel(/First name|Nome/).fill("Jane");
  await page.getByLabel(/Last name|Sobrenome/).fill("Smith");
  await page.getByLabel(/Title|Cargo\/Função/).fill("CEO");
  await page.getByLabel(/Company|Empresa/).click();
  await page.getByPlaceholder("Search").fill("Smith Corp");
  await page.getByText("Create Smith Corp").click();
  await page
    .getByRole("group", { name: /Email addresses|E-mails/ })
    .getByRole("textbox", { name: /Email/ })
    .fill("jane@smithcorp.com");
  await page
    .getByRole("group", { name: /Email addresses|E-mails/ })
    .getByRole("button", { name: "Add" })
    .click();

  await page
    .getByRole("group", { name: /Phone numbers|Telefones/ })
    .getByRole("textbox", { name: /Phone number|WhatsApp\/Telefone/ })
    .fill("+1234567890");
  await page
    .getByRole("group", { name: /Phone numbers|Telefones/ })
    .getByRole("button", { name: "Add" })
    .click();

  await page
    .getByLabel(/LinkedIn URL|LinkedIn/)
    .fill("https://www.linkedin.com/in/jane-smith");

  await page
    .getByLabel(/Background info \(bio, how you met, etc\)|Observações/)
    .fill("Met at a conference.");

  await page.getByLabel(/Has newsletter|Recebe newsletter/).check();

  await expect(page.getByLabel(/Account manager \*|Responsável \*/)).toHaveText(
    "John Doe",
  );

  await page.getByRole("button", { name: "Save" }).click();

  await dismissToast("Element created");

  await expect(page.locator(isMobile ? "h2" : "h5")).toHaveText("Jane Smith");
  await expect(page.getByText("CEO at Smith Corp")).toBeVisible();

  await menu.goToDashboard();
  await page.waitForLoadState("networkidle");

  await expect(page.getByText("2/3 done")).toBeVisible();

  await page
    .getByRole(isMobile ? "button" : "link", { name: "Add note" })
    .click();

  await page.waitForLoadState("networkidle");

  await page.getByPlaceholder("Add a note").fill("This is a note about Jane.");
  await page
    .getByRole("button", { name: isMobile ? "Save" : "Add this note" })
    .click();

  await dismissToast("Note added");

  await expect(
    page.getByText(isMobile ? "Me" : "You added a note", { exact: false }),
  ).toBeVisible();
  await expect(page.getByText("This is a note about Jane.")).toBeVisible();

  await menu.goToDashboard();

  await page.waitForLoadState("networkidle");

  await expect(page.getByText("Latest Activity")).toBeVisible();
  await expect(
    page.getByText("Latest Activity").locator("xpath=../.."),
  ).toHaveText(/You added company Smith Corp today at/);

  await expect(
    page.getByText("Latest Activity").locator("xpath=../.."),
  ).toHaveText(/You added Jane Smith to Smith Corp today at/);

  await expect(
    page.getByText("Latest Activity").locator("xpath=../.."),
  ).toHaveText(/You added a note about Jane Smith today at/);
});

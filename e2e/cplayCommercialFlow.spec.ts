import { expect, test } from "./fixtures";

test("CPlay commercial opportunity flow", async ({
  page,
  createSales,
  createContact,
  createProduct,
  menu,
}) => {
  const sales = await createSales({
    first_name: "Luiz",
    last_name: "Comercial",
    email: "luiz@cplay.test",
    password: "password",
  });

  await createContact({
    first_name: "Marina",
    last_name: "Silva",
    sales_id: sales.id,
    company_id: null,
  });

  await createProduct({
    name: "Site Institucional",
    basePrice: 149.9,
  });

  await page.goto("/");
  await page.getByLabel("Email").fill("luiz@cplay.test");
  await page.getByLabel("Password").fill("password");
  await page.getByRole("button", { name: "Sign in" }).click();

  await menu.goToDeals();
  await expect(page.getByText("Funil comercial")).toBeVisible();

  await page.getByRole("button", { name: "Nova oportunidade" }).click();

  await page.getByLabel("Negócio/Oportunidade *").fill("Novo site Marina");

  await page.getByLabel("Contato principal *").click();
  await page.getByRole("option", { name: /Marina Silva/ }).click();

  await page.getByLabel("Produto/Serviço *").click();
  await page.getByRole("option", { name: "Site Institucional" }).click();

  const amountInput = page.getByLabel("Valor da oportunidade *");
  await expect(amountInput).toHaveValue(/149[,.]9/);

  await amountInput.fill("199.90");
  await expect(amountInput).toHaveValue(/199[,.]90?/);

  await page.getByRole("button", { name: "Save" }).click();
  await page.waitForLoadState("networkidle");

  const newStage = page.getByRole("region", { name: "Novo" });
  await expect(newStage.getByText("Marina Silva")).toBeVisible();
  await expect(newStage.getByText("Site Institucional")).toBeVisible();

  await newStage.getByText("Marina Silva").click();
  await page.getByRole("button", { name: /Edit|Editar/ }).click();

  await page.getByLabel("Etapa *").click();
  await page.getByRole("option", { name: "Contatado" }).click();
  await page.getByRole("button", { name: "Save" }).click();
  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: /Voltar à oportunidade/ }).click();
  await page.waitForLoadState("networkidle");

  const contactedStage = page.getByRole("region", { name: "Contatado" });
  await expect(contactedStage.getByText("Marina Silva")).toBeVisible();
});

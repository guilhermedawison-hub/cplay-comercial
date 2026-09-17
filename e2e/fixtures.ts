import { test as base, expect, type Page } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const adminSupabase = createClient(
  process.env.VITE_SUPABASE_URL ?? "http://127.0.0.1:54341",
  process.env.SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const TABLES = [
  "tasks",
  "contact_notes",
  "deal_notes",
  "deals",
  "contacts",
  "companies",
  "products",
  "lead_sources",
  "tags",
  "favicons_excluded_domains",
  "configuration",
  "sales",
];

async function resetDb() {
  for (const table of TABLES) {
    await adminSupabase.from(table).delete().not("id", "is", null);
  }

  const { data } = await adminSupabase.auth.admin.listUsers();
  await Promise.all(
    data.users.map((user) => adminSupabase.auth.admin.deleteUser(user.id)),
  );
}

async function createUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data, error } = await adminSupabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }

  return data.user;
}

async function createSales({
  first_name,
  last_name,
  email,
  password,
  administrator = false,
}: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  administrator?: boolean;
}) {
  const { data: userData, error: userError } =
    await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (userError) {
    throw new Error(`Failed to create sales: ${userError.message}`);
  }

  const { data, error } = await adminSupabase
    .from("sales")
    .update({ first_name, last_name, administrator })
    .eq("user_id", userData.user?.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create sales: ${error.message}`);
  }

  return data;
}

async function createNotes({
  contactId,
  salesId,
  notes,
}: {
  contactId: string | number;
  salesId: string | number;
  notes: {
    text: string;
    date?: string;
    status?: "cold" | "warm" | "hot";
  }[];
}) {
  if (notes.length === 0) return;

  const { error } = await adminSupabase.from("contact_notes").insert(
    notes.map(({ text, date, status = "cold" }) => ({
      contact_id: contactId,
      sales_id: salesId,
      text,
      date,
      status,
    })),
  );

  if (error) {
    throw new Error(`Failed to create notes: ${error.message}`);
  }
}

async function createCompany({
  name,
  salesId,
}: {
  name: string;
  salesId: string | number;
}) {
  const { data, error } = await adminSupabase
    .from("companies")
    .insert({ name, sales_id: salesId })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to create company: ${error.message}`);
  }

  return data;
}

async function createContact({
  first_name,
  last_name,
  title = "",
  company_id = null,
  sales_id,
  notes = [],
}: {
  first_name: string;
  last_name: string;
  title?: string;
  company_id?: string | number | null;
  sales_id: string | number;
  notes?: {
    text: string;
    date?: string;
    status?: "cold" | "warm" | "hot";
  }[];
}) {
  const { data, error } = await adminSupabase
    .from("contacts")
    .insert({
      first_name,
      last_name,
      title,
      company_id,
      sales_id,
      first_seen: new Date().toISOString(),
      last_seen: new Date().toISOString(),
      has_newsletter: false,
      tags: [],
      gender: "unknown",
      status: "cold",
      background: "",
      email_jsonb: [],
      phone_jsonb: [],
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to create contact: ${error.message}`);
  }

  await createNotes({
    contactId: data.id,
    salesId: sales_id,
    notes,
  });

  return data;
}

async function createProduct({
  name,
  basePrice,
}: {
  name: string;
  basePrice: number;
}) {
  const { data, error } = await adminSupabase
    .from("products")
    .insert({
      name,
      base_price: basePrice,
      active: true,
      display_order: 0,
    })
    .select("id, name, base_price")
    .single();

  if (error) {
    throw new Error(`Failed to create product: ${error.message}`);
  }

  return data;
}

async function getDealByName(name: string) {
  const { data, error } = await adminSupabase
    .from("deals")
    .select(
      "id, name, stage, primary_contact_id, contact_ids, product_id, amount, sales_id",
    )
    .eq("name", name)
    .single();

  if (error) {
    throw new Error(`Failed to fetch deal: ${error.message}`);
  }

  return data;
}

const getMenuMethod = ({ page }: { page: Page; isMobile: boolean }) => ({
  goToDashboard: async () => {
    await page.getByRole("link", { name: "Dashboard" }).click();
    await page.waitForLoadState("networkidle");
  },
  goToContacts: async () => {
    await page.getByRole("link", { name: "Contatos" }).click();
    await page.waitForLoadState("networkidle");
  },
  goToDeals: async () => {
    await page.getByRole("link", { name: "Oportunidades" }).click();
    await page.waitForLoadState("networkidle");
  },
});

const dismissToast = async (page: Page, content: string) => {
  await expect(page.getByText(content)).toBeVisible();
  await page.getByLabel("Close toast").first().click();
  await page.waitForLoadState("networkidle");
};

export const test = base.extend<{
  resetDb: void;
  createUser: typeof createUser;
  createSales: typeof createSales;
  createCompany: typeof createCompany;
  createContact: typeof createContact;
  createNotes: typeof createNotes;
  createProduct: typeof createProduct;
  getDealByName: typeof getDealByName;
  menu: ReturnType<typeof getMenuMethod>;
  dismissToast: (content: string) => Promise<void>;
}>({
  resetDb: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      await resetDb();
      await use();
    },
    { auto: true },
  ],
  // eslint-disable-next-line no-empty-pattern
  createUser: async ({}, cb) => {
    await cb(createUser);
  },
  // eslint-disable-next-line no-empty-pattern
  createSales: async ({}, cb) => {
    await cb(createSales);
  },
  // eslint-disable-next-line no-empty-pattern
  createCompany: async ({}, cb) => {
    await cb(createCompany);
  },
  // eslint-disable-next-line no-empty-pattern
  createContact: async ({}, cb) => {
    await cb(createContact);
  },
  // eslint-disable-next-line no-empty-pattern
  createNotes: async ({}, cb) => {
    await cb(createNotes);
  },
  // eslint-disable-next-line no-empty-pattern
  createProduct: async ({}, cb) => {
    await cb(createProduct);
  },
  // eslint-disable-next-line no-empty-pattern
  getDealByName: async ({}, cb) => {
    await cb(getDealByName);
  },
  menu: async ({ page, isMobile }, cb) => {
    await cb(getMenuMethod({ page, isMobile }));
  },
  dismissToast: async ({ page }, cb) => {
    await cb((content: string) => dismissToast(page, content));
  },
});

export { expect };

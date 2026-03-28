import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { createLead, getLeadByEmail, getAllLeads } from "./db";
import { notifyOwner } from "./_core/notification";
import { storagePut } from "./storage";
import { z } from "zod";
import ExcelJS from "exceljs";
import { nanoid } from "nanoid";

/**
 * Generates an Excel spreadsheet from the leads data and uploads it to S3.
 * Returns the public download URL.
 */
async function generateLeadsSpreadsheet(): Promise<string> {
  const leads = await getAllLeads();

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Sintesys.io";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Leads", {
    properties: { defaultColWidth: 20 },
  });

  // Header row styling
  sheet.columns = [
    { header: "ID", key: "id", width: 8 },
    { header: "Nome", key: "name", width: 25 },
    { header: "Email", key: "email", width: 30 },
    { header: "Telefono", key: "phone", width: 20 },
    { header: "Settore", key: "sector", width: 22 },
    { header: "Fonte", key: "source", width: 18 },
    { header: "Data Iscrizione", key: "createdAt", width: 22 },
  ];

  // Style the header row
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1B2A4A" },
  };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };
  headerRow.height = 28;

  // Add data rows
  for (const lead of leads) {
    sheet.addRow({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone || "",
      sector: lead.sector,
      source: lead.source,
      createdAt: lead.createdAt.toISOString().replace("T", " ").slice(0, 19),
    });
  }

  // Style data rows with alternating colors
  for (let i = 2; i <= sheet.rowCount; i++) {
    const row = sheet.getRow(i);
    row.alignment = { vertical: "middle" };
    if (i % 2 === 0) {
      row.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF5F5F0" },
      };
    }
  }

  // Add auto-filter
  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: 7 },
  };

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // Upload to S3 with unique filename
  const timestamp = new Date().toISOString().slice(0, 10);
  const fileKey = `leads/sintesys-leads-${timestamp}-${nanoid(6)}.xlsx`;
  const { url } = await storagePut(
    fileKey,
    Buffer.from(buffer),
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  return url;
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  leads: router({
    /**
     * Public endpoint: submit a new lead from the landing page form.
     * Validates input, checks for duplicates, saves to DB, and notifies owner.
     */
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(2, "Nome richiesto"),
          email: z.string().email("Email non valida"),
          phone: z.string().optional(),
          sector: z.string().min(1, "Settore richiesto"),
          source: z.string().default("landing_page"),
        })
      )
      .mutation(async ({ input }) => {
        // Check for duplicate email
        const existing = await getLeadByEmail(input.email);
        if (existing) {
          return {
            success: true,
            message: "Già iscritto",
            duplicate: true,
          } as const;
        }

        // Create the lead
        const lead = await createLead({
          name: input.name,
          email: input.email,
          phone: input.phone ?? null,
          sector: input.sector,
          source: input.source,
        });

        // Notify the owner about the new lead
        try {
          await notifyOwner({
            title: `Nuovo Lead: ${lead.name}`,
            content: `Nome: ${lead.name}\nEmail: ${lead.email}\nTelefono: ${lead.phone || "N/A"}\nSettore: ${lead.sector}\nFonte: ${lead.source}\nData: ${lead.createdAt.toISOString()}`,
          });
        } catch (err) {
          console.warn(
            "[Notification] Failed to notify owner about new lead:",
            err
          );
        }

        return {
          success: true,
          message: "Iscrizione completata",
          duplicate: false,
        } as const;
      }),

    /**
     * Protected endpoint: list all leads (admin only).
     */
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Accesso non autorizzato");
      }
      return getAllLeads();
    }),

    /**
     * Protected endpoint: export all leads as an Excel spreadsheet.
     * Generates .xlsx, uploads to S3, and returns the download URL.
     */
    exportSpreadsheet: protectedProcedure.mutation(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Accesso non autorizzato");
      }

      const url = await generateLeadsSpreadsheet();
      return { success: true, url } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;

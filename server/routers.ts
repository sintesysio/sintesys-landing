import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { createLead, getLeadByEmail, getAllLeads, getDailyEdition, getLatestEdition, createQualifiedLead, getQualifiedLeadByEmail, getAllQualifiedLeads, createClient, updateClient, deleteClient, getClientById, getAllClients, createTransaction, updateTransaction, deleteTransaction, getTransactionsByClient, getAllTransactions, getTransactionsByDateRange, getLeadsStats, getFinancialSummary, getBalanceByClient } from "./db";
import { syncSimpleLead, syncQualifiedLead, getMailchimpListStats, getMailchimpCampaigns } from "./mailchimp";
import { syncSimpleLeadToNotion, syncQualifiedLeadToNotion, getNotionPipelineDeals, getNotionDealDetail } from "./notion";
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
  workbook.creator = "Il Consigliere";
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
  const fileKey = `leads/ilconsigliere-leads-${timestamp}-${nanoid(6)}.xlsx`;
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

  dailyContent: router({
    /**
     * Public endpoint: get today's editorial content.
     * Uses Rome timezone (Europe/Rome) to determine "today".
     * Falls back to latest available edition if today has no content.
     */
    today: publicProcedure.query(async () => {
      // Get today's date in Rome timezone
      const now = new Date();
      const romeDate = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Europe/Rome",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(now); // Returns YYYY-MM-DD

      // Try to get today's edition
      let edition = await getDailyEdition(romeDate);

      // Fallback: get the latest available edition
      if (!edition) {
        edition = await getLatestEdition();
      }

      if (!edition) {
        return null; // No content available, frontend uses static fallback
      }

      // Format the date in Italian
      const months = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
      const [year, month, day] = romeDate.split("-").map(Number);
      const dateFormatted = `${day} ${months[month - 1]} ${year}`;

      return {
        dateFormatted,
        editionNumber: String(edition.editionNumber).padStart(3, "0"),
        headline: edition.headline,
        editorialP1: edition.editorialP1,
        editorialP2: edition.editorialP2,
        editorialP3: edition.editorialP3,
        imageCaption: edition.imageCaption,
        statsTitle: edition.statsTitle,
        stats: [
          {
            number: edition.stat1Number,
            suffix: edition.stat1Suffix,
            label: edition.stat1Label,
            desc: edition.stat1Desc,
            source: edition.stat1Source,
          },
          {
            number: edition.stat2Number,
            suffix: edition.stat2Suffix,
            label: edition.stat2Label,
            desc: edition.stat2Desc,
            source: edition.stat2Source,
          },
          {
            number: edition.stat3Number,
            suffix: edition.stat3Suffix,
            label: edition.stat3Label,
            desc: edition.stat3Desc,
            source: edition.stat3Source,
          },
        ],
        quote: edition.quote,
        ctaTitle: edition.ctaTitle,
        ctaText: edition.ctaText,
      };
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
          sector: z.string().optional(),
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
          sector: input.sector || null,
          source: input.source,
        });

        const sectorValue = input.sector || "Non specificato";

        // Track sync failures for structured logging
        const syncErrors: { service: string; error: string; timestamp: string }[] = [];

        // Sync to Mailchimp with tag "lead" + sector tag
        try {
          await syncSimpleLead({
            name: input.name,
            email: input.email,
            phone: input.phone,
            sector: sectorValue,
          });
          console.log(`[Mailchimp] ✓ Synced simple lead: ${input.email} (tag: lead, sector: ${sectorValue})`);
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          syncErrors.push({ service: "Mailchimp", error: errorMsg, timestamp: new Date().toISOString() });
          console.error(`[Mailchimp] ✗ Failed to sync simple lead ${input.email}:`, errorMsg);
        }

        // Sync to Notion CRM with Status = "Lead"
        try {
          await syncSimpleLeadToNotion({
            name: input.name,
            email: input.email,
            phone: input.phone,
            sector: sectorValue,
          });
          console.log(`[Notion] ✓ Synced simple lead: ${input.email} (status: Lead)`);
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          syncErrors.push({ service: "Notion", error: errorMsg, timestamp: new Date().toISOString() });
          console.error(`[Notion] ✗ Failed to sync simple lead ${input.email}:`, errorMsg);
        }

        // Notify the owner about the new lead (include sync errors if any)
        try {
          const syncStatus = syncErrors.length > 0
            ? `\n\n⚠️ SYNC ERRORS:\n${syncErrors.map(e => `- ${e.service}: ${e.error}`).join("\n")}`
            : "";

          await notifyOwner({
            title: `Nuovo Lead: ${lead.name}`,
            content: `Nome: ${lead.name}\nEmail: ${lead.email}\nTelefono: ${lead.phone || "N/A"}\nSettore: ${sectorValue}\nFonte: ${lead.source}\nData: ${lead.createdAt.toISOString()}${syncStatus}`,
          });
        } catch (err) {
          console.error("[Notification] ✗ Failed to notify owner about new lead:", err instanceof Error ? err.message : err);
        }

        // Log structured summary
        console.log(`[SimpleLead] Summary: email=${input.email}, sector=${sectorValue}, source=${input.source}, syncErrors=${syncErrors.length}`);
        if (syncErrors.length > 0) {
          console.error(`[SimpleLead] Sync failures for ${input.email}:`, JSON.stringify(syncErrors));
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

  landingLeads: router({
    /**
     * Public endpoint: submit a lead from the Landing Page simplified form (6 fields).
     * Saves as qualified lead with default values for missing fields.
     * Syncs to Mailchimp with tag "Qualificato" to trigger meeting automation.
     * Syncs to Notion CRM with Status = "Qualificado".
     */
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(2, "Nome richiesto"),
          email: z.string().email("Email non valida"),
          phone: z.string().optional(),
          sector: z.string().min(1, "Settore richiesto"),
          revenue: z.string().min(1, "Fatturato richiesto"),
          employees: z.string().min(1, "Dipendenti richiesto"),
        })
      )
      .mutation(async ({ input }) => {
        // Check for duplicate email in qualified leads
        const existing = await getQualifiedLeadByEmail(input.email);
        if (existing) {
          return { success: true, message: "Già registrato", duplicate: true } as const;
        }

        // Also check simple leads to avoid confusion
        const existingSimple = await getLeadByEmail(input.email);

        // Create qualified lead with default values for fields not collected on LP
        const lead = await createQualifiedLead({
          name: input.name,
          email: input.email,
          phone: input.phone ?? null,
          companyName: null,
          revenue: input.revenue,
          employees: input.employees,
          sector: input.sector,
          mainObstacle: "Da valutare in audit",
          dataLocation: "Da valutare in audit",
          cashFlowChallenge: null,
          delegationChallenge: null,
          currentTools: null,
          usesAI: "non_so",
          aiDetails: null,
          shadowAIConcern: null,
          priority: "Audit richiesto via Landing Page",
          successionConcern: null,
          isDecisionMaker: "si",
        });

        // Track sync failures for structured logging
        const syncErrors: { service: string; error: string; timestamp: string }[] = [];

        // Sync to Mailchimp with tag "Qualificato" + sector tag
        try {
          await syncQualifiedLead({
            name: input.name,
            email: input.email,
            phone: input.phone,
            companyName: undefined,
            revenue: input.revenue,
            employees: input.employees,
            sector: input.sector,
            mainObstacle: "Da valutare in audit",
            dataLocation: "Da valutare in audit",
            usesAI: "non_so",
            priority: "Audit richiesto via Landing Page",
            isDecisionMaker: "si",
          });
          console.log(`[Mailchimp] ✓ Synced LP lead: ${input.email} (tag: Qualificato, sector: ${input.sector})`);
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          syncErrors.push({ service: "Mailchimp", error: errorMsg, timestamp: new Date().toISOString() });
          console.error(`[Mailchimp] ✗ Failed to sync LP lead ${input.email}:`, errorMsg);
        }

        // Sync to Notion CRM with Status = "Qualificado"
        try {
          await syncQualifiedLeadToNotion({
            name: input.name,
            email: input.email,
            phone: input.phone,
            revenue: input.revenue,
            employees: input.employees,
            sector: input.sector,
            mainObstacle: "Da valutare in audit",
            dataLocation: "Da valutare in audit",
            usesAI: "non_so",
            priority: "Audit richiesto via Landing Page",
            isDecisionMaker: "si",
          });
          console.log(`[Notion] ✓ Synced LP lead: ${input.email} (status: Qualificado)`);
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          syncErrors.push({ service: "Notion", error: errorMsg, timestamp: new Date().toISOString() });
          console.error(`[Notion] ✗ Failed to sync LP lead ${input.email}:`, errorMsg);
        }

        // Notify owner about new landing page lead (include sync errors if any)
        try {
          const syncStatus = syncErrors.length > 0
            ? `\n\n⚠️ SYNC ERRORS:\n${syncErrors.map(e => `- ${e.service}: ${e.error}`).join("\n")}`
            : "\n\n✓ Tutti i sync completati (Mailchimp + Notion)";

          await notifyOwner({
            title: `Nuovo Lead LP: ${lead.name}`,
            content: `LEAD DA LANDING PAGE\n\nNome: ${lead.name}\nEmail: ${lead.email}\nTelefono: ${lead.phone || "N/A"}\nSettore: ${lead.sector}\nFatturato: ${lead.revenue}\nDipendenti: ${lead.employees}\n\nFonte: Landing Page (Formulário Simplificado)${syncStatus}`,
          });
        } catch (err) {
          console.error("[Notification] ✗ Failed to notify owner about LP lead:", err instanceof Error ? err.message : err);
        }

        // Log structured summary
        console.log(`[LandingLead] Summary: email=${input.email}, sector=${input.sector}, revenue=${input.revenue}, employees=${input.employees}, syncErrors=${syncErrors.length}`);
        if (syncErrors.length > 0) {
          console.error(`[LandingLead] Sync failures for ${input.email}:`, JSON.stringify(syncErrors));
        }

        return { success: true, message: "Audit inviato", duplicate: false } as const;
      }),
  }),

  qualifiedLeads: router({
    /**
     * Public endpoint: submit a qualified lead from the Contattaci multi-step form.
     */
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(2, "Nome richiesto"),
          email: z.string().email("Email non valida"),
          phone: z.string().optional(),
          companyName: z.string().optional(),
          revenue: z.string().min(1),
          employees: z.string().min(1),
          sector: z.string().min(1),
          mainObstacle: z.string().min(1),
          dataLocation: z.string().min(1),
          cashFlowChallenge: z.string().optional(),
          delegationChallenge: z.string().optional(),
          currentTools: z.string().optional(),
          usesAI: z.string().min(1),
          aiDetails: z.string().optional(),
          shadowAIConcern: z.string().optional(),
          priority: z.string().min(1),
          successionConcern: z.string().optional(),
          isDecisionMaker: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        // Check for duplicate
        const existing = await getQualifiedLeadByEmail(input.email);
        if (existing) {
          return { success: true, message: "Gi\u00e0 registrato", duplicate: true } as const;
        }

        const lead = await createQualifiedLead({
          name: input.name,
          email: input.email,
          phone: input.phone ?? null,
          companyName: input.companyName ?? null,
          revenue: input.revenue,
          employees: input.employees,
          sector: input.sector,
          mainObstacle: input.mainObstacle,
          dataLocation: input.dataLocation,
          cashFlowChallenge: input.cashFlowChallenge ?? null,
          delegationChallenge: input.delegationChallenge ?? null,
          currentTools: input.currentTools ?? null,
          usesAI: input.usesAI,
          aiDetails: input.aiDetails ?? null,
          shadowAIConcern: input.shadowAIConcern ?? null,
          priority: input.priority,
          successionConcern: input.successionConcern ?? null,
          isDecisionMaker: input.isDecisionMaker,
        });

        // Sync to Mailchimp with tag "Qualificado" + sector tag + all merge fields
        try {
          await syncQualifiedLead({
            name: input.name,
            email: input.email,
            phone: input.phone,
            companyName: input.companyName,
            revenue: input.revenue,
            employees: input.employees,
            sector: input.sector,
            mainObstacle: input.mainObstacle,
            dataLocation: input.dataLocation,
            cashFlowChallenge: input.cashFlowChallenge,
            delegationChallenge: input.delegationChallenge,
            currentTools: input.currentTools,
            usesAI: input.usesAI,
            aiDetails: input.aiDetails,
            shadowAIConcern: input.shadowAIConcern,
            priority: input.priority,
            successionConcern: input.successionConcern,
            isDecisionMaker: input.isDecisionMaker,
          });
        } catch (err) {
          console.warn("[Mailchimp] Failed to sync qualified lead:", err);
        }

        // Sync to Notion CRM with Status = "Qualificado"
        try {
          await syncQualifiedLeadToNotion({
            name: input.name,
            email: input.email,
            phone: input.phone,
            companyName: input.companyName,
            revenue: input.revenue,
            employees: input.employees,
            sector: input.sector,
            mainObstacle: input.mainObstacle,
            dataLocation: input.dataLocation,
            cashFlowChallenge: input.cashFlowChallenge,
            delegationChallenge: input.delegationChallenge,
            currentTools: input.currentTools,
            usesAI: input.usesAI,
            aiDetails: input.aiDetails,
            shadowAIConcern: input.shadowAIConcern,
            priority: input.priority,
            successionConcern: input.successionConcern,
            isDecisionMaker: input.isDecisionMaker,
          });
        } catch (err) {
          console.warn("[Notion] Failed to sync qualified lead:", err);
        }

        // Notify owner about qualified lead
        try {
          await notifyOwner({
            title: `Lead Qualificato: ${lead.name} (${lead.companyName || "N/A"})`,
            content: `LEAD QUALIFICATO\n\nNome: ${lead.name}\nEmail: ${lead.email}\nTelefono: ${lead.phone || "N/A"}\nAzienda: ${lead.companyName || "N/A"}\n\nPROFILO\nFatturato: ${lead.revenue}\nDipendenti: ${lead.employees}\nSettore: ${lead.sector}\n\nCRITICIT\u00c0\nOstacolo: ${lead.mainObstacle}\nDati: ${lead.dataLocation}\nLiquidit\u00e0: ${lead.cashFlowChallenge || "N/A"}\nDelega: ${lead.delegationChallenge || "N/A"}\n\nTECNOLOGIA\nStrumenti: ${lead.currentTools || "N/A"}\nUsa IA: ${lead.usesAI}\nDettagli IA: ${lead.aiDetails || "N/A"}\nShadow AI: ${lead.shadowAIConcern || "N/A"}\n\nURGENZA\nPriorit\u00e0: ${lead.priority}\nSuccessione: ${lead.successionConcern || "N/A"}\nDecision maker: ${lead.isDecisionMaker}`,
          });
        } catch (err) {
          console.warn("[Notification] Failed to notify owner about qualified lead:", err);
        }

        return { success: true, message: "Audit inviato", duplicate: false } as const;
      }),

    /**
     * Protected endpoint: export qualified leads as Excel spreadsheet.
     */
    exportSpreadsheet: protectedProcedure.mutation(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Accesso non autorizzato");
      }

      const qLeads = await getAllQualifiedLeads();

      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Il Consigliere";
      workbook.created = new Date();

      const sheet = workbook.addWorksheet("Lead Qualificati", {
        properties: { defaultColWidth: 20 },
      });

      sheet.columns = [
        { header: "ID", key: "id", width: 8 },
        { header: "Nome", key: "name", width: 25 },
        { header: "Email", key: "email", width: 30 },
        { header: "Telefono", key: "phone", width: 18 },
        { header: "Azienda", key: "companyName", width: 25 },
        { header: "Fatturato", key: "revenue", width: 18 },
        { header: "Dipendenti", key: "employees", width: 14 },
        { header: "Settore", key: "sector", width: 16 },
        { header: "Ostacolo Principale", key: "mainObstacle", width: 35 },
        { header: "Dove Dati", key: "dataLocation", width: 30 },
        { header: "Liquidit\u00e0", key: "cashFlowChallenge", width: 30 },
        { header: "Delega", key: "delegationChallenge", width: 30 },
        { header: "Strumenti Attuali", key: "currentTools", width: 30 },
        { header: "Usa IA", key: "usesAI", width: 10 },
        { header: "Dettagli IA", key: "aiDetails", width: 30 },
        { header: "Shadow AI", key: "shadowAIConcern", width: 30 },
        { header: "Priorit\u00e0", key: "priority", width: 25 },
        { header: "Successione", key: "successionConcern", width: 30 },
        { header: "Decision Maker", key: "isDecisionMaker", width: 16 },
        { header: "Data", key: "createdAt", width: 22 },
      ];

      const headerRow = sheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
      headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1B2A4A" } };
      headerRow.alignment = { vertical: "middle", horizontal: "center" };
      headerRow.height = 28;

      for (const ql of qLeads) {
        sheet.addRow({
          id: ql.id,
          name: ql.name,
          email: ql.email,
          phone: ql.phone || "",
          companyName: ql.companyName || "",
          revenue: ql.revenue,
          employees: ql.employees,
          sector: ql.sector,
          mainObstacle: ql.mainObstacle,
          dataLocation: ql.dataLocation,
          cashFlowChallenge: ql.cashFlowChallenge || "",
          delegationChallenge: ql.delegationChallenge || "",
          currentTools: ql.currentTools || "",
          usesAI: ql.usesAI,
          aiDetails: ql.aiDetails || "",
          shadowAIConcern: ql.shadowAIConcern || "",
          priority: ql.priority,
          successionConcern: ql.successionConcern || "",
          isDecisionMaker: ql.isDecisionMaker,
          createdAt: ql.createdAt.toISOString().replace("T", " ").slice(0, 19),
        });
      }

      for (let i = 2; i <= sheet.rowCount; i++) {
        const row = sheet.getRow(i);
        row.alignment = { vertical: "middle" };
        if (i % 2 === 0) {
          row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF5F5F0" } };
        }
      }

      sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: 20 } };

      const buffer = await workbook.xlsx.writeBuffer();
      const timestamp = new Date().toISOString().slice(0, 10);
      const fileKey = `qualified-leads/ilconsigliere-qualified-leads-${timestamp}-${nanoid(6)}.xlsx`;
      const { url } = await storagePut(
        fileKey,
        Buffer.from(buffer),
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      return { success: true, url } as const;
    }),
   }),

  // ─── Admin Dashboard ──────────────────────────────────────────
  admin: router({
    stats: adminProcedure.query(async () => {
      const leadsStats = await getLeadsStats();
      const financialSummary = await getFinancialSummary();
      return { leads: leadsStats, financial: financialSummary };
    }),

    leads: router({
      list: adminProcedure.query(async () => {
        const [simple, qualified] = await Promise.all([getAllLeads(), getAllQualifiedLeads()]);
        return { simple, qualified };
      }),
    }),

    clients: router({
      list: adminProcedure.query(async () => {
        return getAllClients();
      }),
      create: adminProcedure.input(z.object({
        name: z.string().min(1),
        company: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        notes: z.string().optional(),
      })).mutation(async ({ input }) => {
        return createClient(input);
      }),
      update: adminProcedure.input(z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        company: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        notes: z.string().optional(),
      })).mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateClient(id, data);
      }),
      delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
        await deleteClient(input.id);
        return { success: true } as const;
      }),
    }),

    // ─── Mailchimp Campaigns ────────────────────────────────────
    campaigns: router({
      listStats: adminProcedure.query(async () => {
        try {
          return await getMailchimpListStats();
        } catch (err) {
          console.error("[Admin] Mailchimp list stats error:", err);
          return { memberCount: 0, unsubscribeCount: 0, avgOpenRate: 0, avgClickRate: 0, campaignCount: 0 };
        }
      }),
      list: adminProcedure.query(async () => {
        try {
          return await getMailchimpCampaigns(20);
        } catch (err) {
          console.error("[Admin] Mailchimp campaigns error:", err);
          return [];
        }
      }),
    }),

    // ─── Notion Pipeline CRM ─────────────────────────────────────
    pipeline: router({
      deals: adminProcedure.query(async () => {
        try {
          return await getNotionPipelineDeals();
        } catch (err) {
          console.error("[Admin] Notion pipeline error:", err);
          return [];
        }
      }),
      dealDetail: adminProcedure.input(z.object({
        pageId: z.string().min(1),
      })).query(async ({ input }) => {
        try {
          return await getNotionDealDetail(input.pageId);
        } catch (err) {
          console.error("[Admin] Notion deal detail error:", err);
          return null;
        }
      }),
    }),

    transactions: router({
      list: adminProcedure.input(z.object({
        clientId: z.number().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }).optional()).query(async ({ input }) => {
        if (input?.clientId) return getTransactionsByClient(input.clientId);
        if (input?.startDate && input?.endDate) return getTransactionsByDateRange(input.startDate, input.endDate);
        return getAllTransactions();
      }),
      create: adminProcedure.input(z.object({
        clientId: z.number(),
        type: z.enum(["entrada", "saida"]),
        amount: z.number().positive(),
        description: z.string().min(1),
        category: z.string().optional(),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      })).mutation(async ({ input }) => {
        return createTransaction(input);
      }),
      update: adminProcedure.input(z.object({
        id: z.number(),
        clientId: z.number().optional(),
        type: z.enum(["entrada", "saida"]).optional(),
        amount: z.number().positive().optional(),
        description: z.string().min(1).optional(),
        category: z.string().optional(),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      })).mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateTransaction(id, data);
      }),
      delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
        await deleteTransaction(input.id);
        return { success: true } as const;
      }),
      summary: adminProcedure.query(async () => {
        return getFinancialSummary();
      }),
      balanceByClient: adminProcedure.query(async () => {
        const balances = await getBalanceByClient();
        const allClients = await getAllClients();
        const clientMap = new Map(allClients.map(c => [c.id, c]));
        return balances.map(b => ({
          ...b,
          clientName: clientMap.get(b.clientId)?.name ?? `#${b.clientId}`,
          clientCompany: clientMap.get(b.clientId)?.company ?? "",
        }));
      }),
    }),
  }),
});
export type AppRouter = typeof appRouter;

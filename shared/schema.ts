import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  domain: text("domain").notNull(),
  description: text("description").notNull(),
  stakeholders: jsonb("stakeholders").$type<Stakeholder[]>().notNull().default([]),
  functionalRequirements: jsonb("functional_requirements").$type<FunctionalRequirement[]>().notNull().default([]),
  nonFunctionalRequirements: jsonb("non_functional_requirements").$type<NonFunctionalRequirement[]>().notNull().default([]),
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  domain: true,
  description: true,
  stakeholders: true,
  functionalRequirements: true,
  nonFunctionalRequirements: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Embedded types for the JSON fields
export const stakeholderSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
});

export const functionalRequirementSchema = z.object({
  id: z.string(),
  stakeholderId: z.string(),
  description: z.string(),
});

export const nonFunctionalRequirementSchema = z.object({
  id: z.string(),
  category: z.enum(["security", "performance", "usability", "scalability"]),
  description: z.string(),
});

export type Stakeholder = z.infer<typeof stakeholderSchema>;
export type FunctionalRequirement = z.infer<typeof functionalRequirementSchema>;
export type NonFunctionalRequirement = z.infer<typeof nonFunctionalRequirementSchema>;

import { type Project, type InsertProject } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  getAllProjects(): Promise<Project[]>;
}

export class MemStorage implements IStorage {
  private projects: Map<string, Project>;

  constructor() {
    this.projects = new Map();
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = { 
      id,
      name: insertProject.name,
      domain: insertProject.domain,
      description: insertProject.description,
      stakeholders: Array.isArray(insertProject.stakeholders) ? [...insertProject.stakeholders] : [],
      functionalRequirements: Array.isArray(insertProject.functionalRequirements) ? [...insertProject.functionalRequirements] : [],
      nonFunctionalRequirements: Array.isArray(insertProject.nonFunctionalRequirements) ? [...insertProject.nonFunctionalRequirements] : [],
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const existing = this.projects.get(id);
    if (!existing) return undefined;

    const updated: Project = { 
      ...existing, 
      ...updateData,
      stakeholders: updateData.stakeholders ? Array.isArray(updateData.stakeholders) ? [...updateData.stakeholders] : [] : existing.stakeholders,
      functionalRequirements: updateData.functionalRequirements ? Array.isArray(updateData.functionalRequirements) ? [...updateData.functionalRequirements] : [] : existing.functionalRequirements,
      nonFunctionalRequirements: updateData.nonFunctionalRequirements ? Array.isArray(updateData.nonFunctionalRequirements) ? [...updateData.nonFunctionalRequirements] : [] : existing.nonFunctionalRequirements,
    };
    this.projects.set(id, updated);
    return updated;
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }
}

export const storage = new MemStorage();

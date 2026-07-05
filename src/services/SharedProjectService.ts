import sqlite3 from "sqlite3";

export interface SharedProject {
  id: string;
  name: string;
  description: string;
  module: string; // 'little_olympus' | 'storyforge' | 'boss_listers' | 'crosspost' etc.
  status: string;
  payload: string; // JSON serialized data configurations
  created_at: string;
  updated_at: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG";
  module: string;
  message: string;
  details?: string;
}

export class SharedProjectService {
  private db: sqlite3.Database;

  constructor(db: sqlite3.Database) {
    this.db = db;
  }

  // Promise wrappers for DB operations
  private queryAll(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  private queryGet(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  private queryRun(sql: string, params: any[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // --- Project Management API ---
  public async getProjects(module?: string): Promise<SharedProject[]> {
    if (module) {
      return this.queryAll("SELECT * FROM shared_projects WHERE module = ? ORDER BY updated_at DESC", [module]);
    }
    return this.queryAll("SELECT * FROM shared_projects ORDER BY updated_at DESC");
  }

  public async getProjectById(id: string): Promise<SharedProject | null> {
    return this.queryGet("SELECT * FROM shared_projects WHERE id = ?", [id]);
  }

  public async createOrUpdateProject(project: Omit<SharedProject, "created_at" | "updated_at">): Promise<SharedProject> {
    const existing = await this.getProjectById(project.id);
    const now = new Date().toISOString();
    
    if (existing) {
      await this.queryRun(
        `UPDATE shared_projects 
         SET name = ?, description = ?, status = ?, payload = ?, updated_at = ? 
         WHERE id = ?`,
        [project.name, project.description, project.status, project.payload, now, project.id]
      );
      return {
        ...existing,
        name: project.name,
        description: project.description,
        status: project.status,
        payload: project.payload,
        updated_at: now
      };
    } else {
      await this.queryRun(
        `INSERT INTO shared_projects (id, name, description, module, status, payload, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [project.id, project.name, project.description, project.module, project.status, project.payload, now, now]
      );
      return {
        ...project,
        created_at: now,
        updated_at: now
      } as SharedProject;
    }
  }

  public async deleteProject(id: string): Promise<void> {
    await this.queryRun("DELETE FROM shared_projects WHERE id = ?", [id]);
  }

  // --- Centralized System Logging & Auditing ---
  public async log(level: "INFO" | "WARN" | "ERROR" | "DEBUG", module: string, message: string, details?: string): Promise<void> {
    const id = `log_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();
    await this.queryRun(
      "INSERT INTO system_logs (id, timestamp, level, module, message, details) VALUES (?, ?, ?, ?, ?, ?)",
      [id, timestamp, level, module, message, details || ""]
    ).catch(err => {
      console.error("Failed to write to SQLite system_logs:", err);
    });
  }

  public async getLogs(limit: number = 100, level?: string): Promise<SystemLog[]> {
    if (level) {
      return this.queryAll("SELECT * FROM system_logs WHERE level = ? ORDER BY timestamp DESC LIMIT ?", [level, limit]);
    }
    return this.queryAll("SELECT * FROM system_logs ORDER BY timestamp DESC LIMIT ?", [limit]);
  }

  public async clearLogs(): Promise<void> {
    await this.queryRun("DELETE FROM system_logs");
  }
}

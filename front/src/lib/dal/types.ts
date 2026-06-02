import { UserRole } from "@/app/(withDrawer)/users/types";

export interface SessionData {
  exp: number;
  email: string;
  templateId: string;
  userId: number;
  userRole: UserRole;
}

export const ROUTES_ROLES = {
  PATIENTS: {
    LIST: ["Admin", "Medic"],
    CREATE: ["Medic", "Assistant"],
    GET: ["Medic", "Assistant"],
    UPDATE: ["Assistant"],
  },
  USERS: {
    LIST: ["Admin"],
    GET: ["Admin"],
    UPDATE: ["Admin"],
    PROFILE: ["Admin", "Medic", "Assistant", "Patient", "User"],
  },
  TEMPLATES: {
    LIST: ["Admin", "Medic"],
    GET: ["Admin", "Medic"],
    CREATE: ["Admin"],
    UPDATE: ["Admin"],
  },
  VISITS: {
    LIST: ["Medic"],
    GET: ["Medic", "Patient"],
    CREATE: ["Medic"],
    ME: ["Patient"],
  },
  TRIAGES: {
    CREATE: ["Medic", "Assistant"],
  },
  REPORTS: {
    MEDICAL: ["Medic", "Patient"],
    VISIT: ["Medic", "Patient"],
  },
} as const satisfies Record<string, Record<string, UserRole[]>>;

import { Role } from "@/lib/requireRoles";
import { PatientProfile } from "../patients/types";

export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  userRole: Role;
};

export type MedicProfile = UserProfile & {
  specialty: string;
};

export type Profile =
  | (UserProfile & { userRole: "User" })
  | (MedicProfile & { userRole: "Medic" })
  | (PatientProfile & { userRole: "Patient" });

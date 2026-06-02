"use server";
import axiosInstance from "@/lib/axiosConfig";

export async function reportVisit(id: number) {
  const response = await axiosInstance.get(`/reports/visits/${id}`, {
    responseType: "blob",
  });

  return response.data;
}

export async function reportMedical(patientId: number) {
  const response = await axiosInstance.get(`/reports/medical/${patientId}`, {
    responseType: "blob",
  });

  return response.data;
}

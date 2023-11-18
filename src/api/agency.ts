import axios from "axios";
import { FederalRegisterAgency } from "../types/agency";

export async function getAgency(slug: string) {
  const config = {
    method: "get",
    url: `https://www.federalregister.gov/api/v1/agencies/${slug}`,
  };
  const { data, error } = await axios(config);
  if (error) {
    throw error;
  }
  return data as FederalRegisterAgency;
}

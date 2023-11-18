import axios from "axios";
import { FederalRegisterAgency } from "../types/agency";
import { IDocument } from "../types/federalRegistry.ts/document";
const config = {
  method: "get",
  url: "https://www.federalregister.gov/api/v1/agencies",
};

export async function getAgencies() {
  const { data, error } = await axios(config);
  if (error) {
    throw error;
  }
  return data as FederalRegisterAgency[];
}

// get recent documents for agency  where 'significant' is true
export async function getAgencyDocuments(id: number) {
  const config = {
    method: "get",
    url: `https://www.federalregister.gov/api/v1/documents?conditions%5Bagency_ids%5D%5B%5D=${id}&conditions%5Bsignificant%5D=1&order=newest`,
    Headers: {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
    },
  };
  const { data, error } = await axios(config);
  if (error) {
    throw error;
  }
  console.log(data);
  return data.results as IDocument[];
}

export async function getDocument(document_number: string) {
  const config = {
    method: "get",
    url: `https://www.federalregister.gov/api/v1/documents/${document_number}.json`,
  };
  const { data, error } = await axios(config);
  if (error) {
    throw error;
  }
  return data as IDocument;
}

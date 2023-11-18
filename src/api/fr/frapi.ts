import axios, { AxiosResponse } from "axios";

const API_BASE_URL = "https://www.federalregister.gov/api/v1";

import { SuggestedSearch } from "../../types/federalRegistry.ts/search";

// Function to make a GET request to the API and return the response
async function makeGetRequest(
  endpoint: string,
  params?: object
): Promise<AxiosResponse> {
  try {
    const response = await axios.get(`${API_BASE_URL}/${endpoint}`, { params });
    return response;
  } catch (error) {
    throw new Error(`API Request Error: ${error.message}`);
  }
}

// Fetch a single Federal Register document by document number
async function getFederalRegisterDocument(
  documentNumber: string,
  format: string
): Promise<AxiosResponse> {
  return makeGetRequest(`documents/${documentNumber}.${format}`);
}

// Fetch multiple Federal Register documents by document numbers
async function getMultipleFederalRegisterDocuments(
  documentNumbers: string[],
  format: string
): Promise<AxiosResponse> {
  const documentNumbersString = documentNumbers.join(",");
  return makeGetRequest(`documents/${documentNumbersString}.${format}`);
}

// Search all Federal Register documents published since 1994
async function searchFederalRegisterDocuments(
  format: string,
  queryParams: object
): Promise<AxiosResponse> {
  return makeGetRequest(`documents.${format}`, queryParams);
}

// Fetch counts of matching Federal Register Documents grouped by a facet
async function getDocumentFacets(facet: string): Promise<AxiosResponse> {
  return makeGetRequest(`documents/facets/${facet}`);
}

// Fetch document table of contents based on the print edition
async function getDocumentTableOfContents(
  publicationDate: string,
  format: string
): Promise<AxiosResponse> {
  return makeGetRequest(`issues/${publicationDate}.${format}`);
}

// Fetch a single public inspection document by document number
async function getPublicInspectionDocument(
  documentNumber: string,
  format: string
): Promise<AxiosResponse> {
  return makeGetRequest(
    `public-inspection-documents/${documentNumber}.${format}`
  );
}

// Fetch multiple public inspection documents by document numbers
async function getMultiplePublicInspectionDocuments(
  documentNumbers: string[],
  format: string
): Promise<AxiosResponse> {
  const documentNumbersString = documentNumbers.join(",");
  return makeGetRequest(
    `public-inspection-documents/${documentNumbersString}.${format}`
  );
}

// Fetch all the public inspection documents that are currently on public inspection
async function getCurrentPublicInspectionDocuments(
  format: string
): Promise<AxiosResponse> {
  return makeGetRequest(`public-inspection-documents/current.${format}`);
}

// Search all the public inspection documents that are currently on public inspection
async function searchPublicInspectionDocuments(
  format: string,
  queryParams: object
): Promise<AxiosResponse> {
  return makeGetRequest(`public-inspection-documents.${format}`, queryParams);
}

// Fetch all agency details
async function getAllAgencies(): Promise<AxiosResponse> {
  return makeGetRequest("agencies");
}

// Fetch a particular agency's details by slug
async function getAgencyDetails(slug: string): Promise<AxiosResponse> {
  return makeGetRequest(`agencies/${slug}`);
}

// Fetch the available image variants and their metadata for a single image identifier
async function getImageVariants(identifier: string): Promise<AxiosResponse> {
  return makeGetRequest(`images/${identifier}`);
}

// Fetch all suggested searches or limit by FederalRegister.gov section
async function getAllSuggestedSearches(
  section?: string
): Promise<AxiosResponse<SuggestedSearch[]>> {
  if (section) {
    return makeGetRequest(`suggested_searches/${section}`);
  } else {
    const { data, status, statusText, headers, config } =
      await await makeGetRequest("suggested_searches");
    console.log(data);

    // combine the results (json object) from each section (key) into a single array
    // of SuggestedSearch objects
    let combinedResults: SuggestedSearch[] = [];
    for (const section in data) {
      combinedResults = combinedResults.concat(data[section]);
    }

    return {
      data: combinedResults,
      status,
      statusText,
      headers,
      config,
    };
  }
}

export {
  getFederalRegisterDocument,
  getMultipleFederalRegisterDocuments,
  searchFederalRegisterDocuments,
  getDocumentFacets,
  getDocumentTableOfContents,
  getPublicInspectionDocument,
  getMultiplePublicInspectionDocuments,
  getCurrentPublicInspectionDocuments,
  searchPublicInspectionDocuments,
  getAllAgencies,
  getAgencyDetails,
  getImageVariants,
  getAllSuggestedSearches,
};

// Example usage:
// const documentResponse = await getFederalRegisterDocument('12345', 'json');
// console.log(documentResponse.data);

// You can use these functions to interact with the Federal Register API endpoints as needed.

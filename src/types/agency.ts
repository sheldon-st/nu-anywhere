interface DoDAgency {
  name: string;
  abbreviation: string;
}

/**Example object: {"agency_url":"","child_ids":[],"child_slugs":[],"description":"ACTION was established by Reorganization Plan No. 1 of 1971, effective July 1, 1971. \r\n\r\nACTION's purpose was to mobilize Americans for voluntary service throughout the United States and in developing countries overseas through programs which help meet basic human needs and support the self-help efforts of low-income individuals and communities.\r\n\r\nACTION's functions relating to SCORE and ACT programs were transferred to the Small Business Administration. Other functions exercised by the Director of ACTION prior to March 31, 1995 were transferred to the Corporation for National and Community Service by 107 Stat. 888 and Proclamation 6662 of April 4, 1994. ","id":557,"logo":null,"name":"ACTION","parent_id":null,"recent_articles_url":"https://www.federalregister.gov/api/v1/documents?conditions%5Bagency_ids%5D%5B%5D=557&order=newest","short_name":"ACTION","slug":"action","url":"https://www.federalregister.gov/agencies/action","json_url":"https://www.federalregister.gov/api/v1/agencies/557"} */
export interface FederalRegisterAgency {
  name?: string;
  description?: string;
  id?: number;
  dodID?: string;
  logo?: string | null;
  parent_id?: number | null;
  short_name?: string;
  slug?: string;
  url?: string;
  json_url?: string;
  agency_url?: string;
  child_ids?: number[];
  child_slugs?: string[];
  recent_articles_url?: string;
}

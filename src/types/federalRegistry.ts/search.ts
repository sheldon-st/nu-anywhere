export interface SuggestedSearch {
  description?: string;
  slug?: string;
  search_conditions: {
    term?: string;
    near?: {
      within?: string;
    };
    agency_ids?: string[];
  };
  section?: string;
  title?: string;
  documents_in_last_year?: number;
  documents_with_open_comment_periods?: number;
  position?: number;
  user_tags?: string[];
}

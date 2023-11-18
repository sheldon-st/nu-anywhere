import React, { useState, FC } from "react";
import { getAgencies } from "../../api/documents";
import { Card, Space, Typography } from "antd";
import { FederalRegisterAgency } from "../../types/agency";
import { DocumentTopics } from "../../types/federalRegistry.ts/topics";
import DocumentSearch from "./DocumentsSearch";
import { NavLink } from "react-router-dom";
export const DocumentsHome: FC = () => {
  const [agencies, setAgencies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadAgencies = async () => {
    setLoading(true);
    const agencies = await getAgencies();
    setAgencies(agencies);
    setLoading(false);
  };

  // render card with all field formatted if present
  /**name?: string;
  description?: string;
  id?: number;
  logo?: string | null;
  parent_id?: number | null;
  short_name?: string;
  slug?: string;
  url?: string;
  json_url?: string;
  agency_url?: string;
  child_ids?: number[];
  child_slugs?: string[];
  recent_articles_url?: string; */
  return (
    <div>
      <h1>Documents Home</h1>
      <button onClick={loadAgencies}>Load Agencies</button>
      <DocumentSearch />
      {loading && <p>Loading...</p>}
      <ul>
        {agencies.map((agency: FederalRegisterAgency) => (
          <Card title={agency.name} key={agency.id}>
            <Space direction="vertical">
              <Typography.Text>{agency.description || ""}</Typography.Text>
              <Typography.Text>{agency.id || ""}</Typography.Text>
              {/*  <Typography.Text>{agency.id || ""}</Typography.Text>
              <Typography.Text>{agency.logo || ""}</Typography.Text>
              <Typography.Text>{agency.parent_id || ""}</Typography.Text>
              <Typography.Text>{agency.short_name || ""}</Typography.Text>
              <Typography.Text>{agency.slug || ""}</Typography.Text>
              <Typography.Text>{agency.url || ""}</Typography.Text>
              <Typography.Text>{agency.json_url || ""}</Typography.Text>
              <Typography.Text>{agency.agency_url || ""}</Typography.Text>
              <Typography.Text>
                {agency.recent_articles_url || ""}
              </Typography.Text> */}
              <Typography.Text>
                {agency.recent_articles_url || ""}
              </Typography.Text>
              {agency.child_ids && (
                <ul>
                  {agency.child_ids.map((child_id: number) => (
                    <Typography.Text>{child_id}</Typography.Text>
                  ))}
                </ul>
              )}
            </Space>
            <NavLink to={`/fr/agency/${agency.id}`}>
              <button>View Agency</button>
            </NavLink>
          </Card>
        ))}
      </ul>
    </div>
  );
};

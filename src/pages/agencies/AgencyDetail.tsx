import React, { useState, FC, useEffect } from "react";
import { useParams } from "react-router-dom";

import { getAgency } from "../../api/agency";

import { FederalRegisterAgency } from "../../types/agency";
import {
  Card,
  Descriptions,
  Typography,
  List,
  Space,
  Breadcrumb,
  Divider,
  Layout,
  theme,
} from "antd";
import { getAgencyDocuments } from "../../api/documents";
import { DocumentListItem } from "../documents/DocumentListItem";
import { NavLink } from "react-router-dom";
const { Header, Content, Sider } = Layout;

export const AgencyDetail: FC = () => {
  const [agency, setAgency] = useState<FederalRegisterAgency | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { agencySlug } = useParams();
  const [recentDocuments, setRecentDocuments] = useState<any[]>([]);

  const {
    token: { colorBgContainer, colorFillAlter },
  } = theme.useToken();

  if (!agencySlug) {
    return <p>Agency ID not found</p>;
  }

  const loadAgency = async () => {
    setLoading(true);
    const agency = await getAgency(agencySlug);
    setAgency(agency);
    setLoading(false);
    console.log(agency);

    setRecentDocuments(
      await getAgencyDocuments(agency.id!).then((documents) => {
        return documents.map((document) => {
          return document;
        });
      })
    );
  };

  useEffect(() => {
    loadAgency();
  }, [agencySlug]);

  if (!agency) {
    return <p>Agency not found</p>;
  }

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
    <Space direction="vertical" style={{ width: "100%" }}>
      <Breadcrumb style={{ margin: "0 0 8px 0" }}>
        <Breadcrumb.Item>
          <NavLink to="/agencies">Agencies</NavLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{agency.name}</Breadcrumb.Item>
      </Breadcrumb>
      <Content
        style={{
          backgroundColor: colorFillAlter,
          padding: "24px",
        }}
      >
        <Card
          title={`${agency.name} (${agency.short_name})`}
          style={{ textAlign: "left" }}
          //size=''
        >
          <Space direction="vertical">
            <Descriptions>
              {/* <Descriptions.Item label="Logo">{agency.logo}</Descriptions.Item> */}
              {agency.parent_id && (
                <Descriptions.Item label="Parent ID">
                  {agency.parent_id}
                </Descriptions.Item>
              )}
              {/*  {agency.short_name && (
            <Descriptions.Item label="Acronym">
              {agency.short_name}
            </Descriptions.Item>
          )} */}
              {/* <Descriptions.Item label="Slug">{agency.slug}</Descriptions.Item>
          <Descriptions.Item label="URL">{agency.url}</Descriptions.Item> */}
              {agency.agency_url && (
                <Descriptions.Item label="Agency Home">
                  <a href={agency.agency_url}>{agency.agency_url}</a>
                </Descriptions.Item>
              )}
            </Descriptions>
            <Typography.Text>{agency.description || ""}</Typography.Text>
            {/*         <Typography.Text>{agency.id || ""}</Typography.Text>


        <Typography.Text>{agency.json_url || ""}</Typography.Text>
        <Typography.Text>{agency.agency_url || ""}</Typography.Text>
        <Typography.Text>{agency.recent_articles_url || ""}</Typography.Text>
 */}
            {/* {agency.child_ids && (
          <ul>
            {agency.child_ids.map((child_id: number) => (
              <Typography.Text>{child_id}</Typography.Text>
            ))}
          </ul>
        )} */}
          </Space>
        </Card>
        {recentDocuments && (
          <List
            header={
              <Typography.Title level={5}>
                Recently Published Documents
              </Typography.Title>
            }
            dataSource={recentDocuments}
            renderItem={(item) => (
              <DocumentListItem document={item} key={item.document_number} />
            )}
            //grid={{ gutter: 16, column: 1 }}
            pagination={{
              pageSize: 5,
            }}
            //bordered={false}
            itemLayout="vertical"
            style={{ textAlign: "left" }}
          />
        )}
      </Content>
    </Space>
  );
};

import React, { useState, FC, useEffect } from "react";
import { getAgencies } from "../../api/documents";
import { Card, Space, Typography, List, Divider, Tag } from "antd";
import { FederalRegisterAgency } from "../../types/agency";
import { DocumentTopics } from "../../types/federalRegistry.ts/topics";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/Auth";
import { supabase } from "../../config/supabaseClient";
import { getAgency } from "../../api/agency";
import { getAllSuggestedSearches } from "../../api/fr/frapi";
import { all } from "axios";
import { SuggestedSearch } from "../../types/federalRegistry.ts/search";

export const AgencyHome: FC = () => {
  const [agencies, setAgencies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  //const [faid, setFaid] = useState<string>("");
  const [flaggedAgencies, setFlaggedAgencies] = useState<
    FederalRegisterAgency[]
  >([]);
  const [suggestedSearches, setSuggestedSearches] = useState<SuggestedSearch[]>(
    []
  );
  const userAgencies = ["103", "145", "221"];
  const userTopics = ["money", "health-and-public-welfare"];

  if (!user) {
    return null;
  }

  // returns list of user flagged agency ids
  const fetchFlaggedAgencies = async () => {
    // get list of user flagged agencies from supabase
    /* const { data, error } = await supabase
      .from("profiles")
      .select("flagged_agencies")
      .eq("id", user.id); */
    const data = [{ flagged_agencies: userAgencies }];
    const error = null;

    if (error) {
      console.log(error);
      return;
    } else {
      console.log(data);

      // get list of agencies from federal register api
      return data[0].flagged_agencies;
    }
  };

  // on load fetch flagged agencies and load agency objects
  useEffect(() => {
    const load = async () => {
      // get list of user flagged agencies from supabase
      /* const { data, error } = await supabase
        .from("profiles")
        .select("flagged_agencies")
        .eq("id", user.id); */
      const data = [{ flagged_agencies: userAgencies }];
      const error = null;

      if (error) {
        console.log(error);
        return;
      } else {
        console.log(data);

        // get list of agencies from federal register api
        const flaggedAgencies = data[0].flagged_agencies;
        const agencies = await loadFlaggedAgencies(flaggedAgencies);
        setFlaggedAgencies(agencies);
        setLoading(false);
      }
    };
    load();
  }, []);

  // takes in list of user flagged agency ids and returns list of agency objects
  const loadFlaggedAgencies = async (faid) => {
    const agencies: FederalRegisterAgency[] = await Promise.all(
      faid.map(async (id) => {
        const agency = await getAgency(id);
        return agency;
      })
    );
    return agencies;
  };

  // if signed in filter suggested searches by flagged agencies (search_conditions.agency.ids includes any of user flagged agencies)
  // if not signed in show all suggested searches
  //const loadSuggestedSearches = async () => {
  /*  const data = [{ flagged_agencies: userAgencies }];
    const error = null;

    if (error) {
      console.log(error);
      return;
    } else {
      console.log(data); */
  //const agencyIds = userAgencies;

  // create a flat array of all suggested searches from all topics
  //  const allSearches = (await getAllSuggestedSearches()).data;

  // console.log(allSearches);

  // if (user) {
  // filter and add user_tag for the agency or topic that matches the user's flagged agencies or topics to each suggested search
  //const userAgencyMatches = allSearches.reduce((acc, search) => {

  // section is a topic string not an array
  /* const userTopicMatches = allSearches.map((search) => {
        const topicMatches = userTopics.filter(
          (topic) => search.section === topic
        );

        if (topicMatches && topicMatches.length > 0) {
          if (!search.user_tags) {
            search.user_tags = [];
          }
          search.user_tags = search.user_tags.concat(topicMatches);
        }
        return search;
      }); */
  //  const userTopicMatches = [];

  // const userMatches = userAgencyMatches.concat(userTopicMatches);
  // setSuggestedSearches(userMatches);

  return (
    <div>
      <h1>Loading: {loading.toString()}</h1>
      <h1>Agencies Home</h1>
      {flaggedAgencies.length > 0 && <h2>Flagged Agencies</h2>}
      <List style={{ textAlign: "left" }} loading={loading}>
        {flaggedAgencies.map((agency: FederalRegisterAgency) => (
          <List.Item
            key={agency.id}
            actions={[<NavLink to={`/fr/agency/${agency.id}`}>View</NavLink>]}
          >
            <List.Item.Meta
              title={agency.name}
              description={agency.description}
            />
          </List.Item>
        ))}
      </List>
      <Divider />
      <button
        onClick={() => {
          //loadSuggestedSearches();
        }}
      >
        Load Suggested Searches
      </button>
      <div style={{ textAlign: "left" }}>
        {suggestedSearches.map((suggestedSearch) => (
          <div key={suggestedSearch.id}>
            <h3>{suggestedSearch.title}</h3>
            <p>{suggestedSearch.description}</p>
            <p>{suggestedSearch.search_conditions.agency_ids}</p>
            {suggestedSearch.user_tags?.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        ))}
      </div>
      {/* <button onClick={loadAgencies}>Load All Agencies</button> */}
      <List loading={loading}>
        {agencies.map((agency: FederalRegisterAgency) => (
          <List.Item key={agency.id}>
            <Card title={agency.name}>
              <Space direction="vertical">
                <Typography.Text>{agency.description || ""}</Typography.Text>
                <Typography.Text>{agency.id || ""}</Typography.Text>
                <Typography.Text>
                  {agency.recent_articles_url || ""}
                </Typography.Text>
              </Space>
            </Card>
          </List.Item>
        ))}
      </List>
    </div>
  );
};

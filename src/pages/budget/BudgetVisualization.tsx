import { useState, useEffect } from "react";
import { supabase } from "../../config/supabaseClient";
import { Group } from "@visx/group";
import * as visx from "@visx/shape";
import React from "react";
import {
  Col,
  Table,
  Statistic,
  Space,
  Typography,
  Button,
  Dropdown,
} from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import "./table.scss";
import { useSearchParams } from "react-router-dom";
import { ProgramElement } from "../../types";
import ChartSelected from "./ChartSelected";

const columns: ColumnsType<ProgramElement> = [
  {
    title: "PE Name",
    dataIndex: "name",
    //width: 200,
  },
  {
    title: "BA Code",
    dataIndex: "ba_code",
    width: 100,
  },
  {
    title: "Agency",
    dataIndex: "org",
    width: 100,
  },
  {
    title: "FY 2022",
    dataIndex: "fy_2022",
    sorter: (a, b) => a.fy_2022 - b.fy_2022,
    width: 120,
  },
  {
    title: "FY 2023",
    dataIndex: "fy_2023",
    sorter: (a, b) => a.fy_2023 - b.fy_2023,
    width: 120,
  },
  {
    title: "FY 2024",
    dataIndex: "fy_2024",
    sorter: (a, b) => a.fy_2024 - b.fy_2024,
    width: 120,
  },
  {
    title: "FY 2025*",
    dataIndex: "fy_2025",
    sorter: (a, b) => a.fy_2025 - b.fy_2025,
    width: 120,
  },
  {
    title: "FY 2026*",
    dataIndex: "fy_2026",
    sorter: (a, b) => a.fy_2026 - b.fy_2026,
    width: 120,
  },
  {
    title: "FY 2027*",
    dataIndex: "fy_2027",
    sorter: (a, b) => a.fy_2027 - b.fy_2027,
    width: 120,
  },
  {
    title: "FY 2028*",
    dataIndex: "fy_2028",
    sorter: (a, b) => a.fy_2028 - b.fy_2028,
    width: 120,
  },
];

const BudgetVisualization = () => {
  const [budgets, setBudgets] = useState<ProgramElement[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // get filter state from searchparams
  const agency = searchParams.getAll("agency_code");
  const budgetActivity = searchParams.getAll("budget_activity");
  const keywords = searchParams.getAll("keywords") || [];

  useEffect(() => {
    const fetchBudgets = async () => {
      // build query where if only keywords are present, filter by keywords using select and textSearch, does the same thing for agency and budget activity

      // function that adds '.select().textSearch("description", `"${keywords.map((k) => k).join(" & ")}"`);' to the query if keywords is present
      const addKeywords = (query: any) => {
        console.log(keywords);
        if (keywords && keywords.length > 0) {
          return query.textSearch(
            "content",
            `"${keywords.map((k) => k).join(" & ")}"`
          );
        } else {
          return query;
        }
      };

      // if agencies are present, filter for any agency that is in the agency array
      const addAgency = (query: any) => {
        if (agency && agency.length > 0) {
          console.log(agency);
          return query.in("org", agency);
        }
        return query;
      };

      // if budget activity is present, filter for any budget activity that is in the budget activity array
      const addBudgetActivity = (query: any) => {
        if (budgetActivity && budgetActivity.length > 0) {
          return query.in("ba_code", budgetActivity);
        }
        return query;
      };

      const buildQuery = (query: any) => {
        return addAgency(addBudgetActivity(addKeywords(query)));
      };

      let query;
      if (searchParams.toString() !== "") {
        query = buildQuery(supabase.from("program_budgets").select());
      } else {
        query = supabase.from("program_budgets").select();
      }

      const { data, error } = await query;

      console.log(data);

      const budgets = data?.map((programElement) => {
        return {
          key: programElement["pid"],
          name: programElement["pe_name"],
          agency_code: programElement["agency_code"],
          description: programElement["description"],
          fy_2022: programElement["fy_2022"],
          fy_2023: programElement["fy_2023"],
          fy_2024: programElement["fy_2024"],
          fy_2025: programElement["fy_2025"],
          fy_2026: programElement["fy_2026"],
          fy_2027: programElement["fy_2027"],
          fy_2028: programElement["fy_2028"],
          org: programElement["org"],
          ba_code: programElement["ba_code"],
          appr_code: programElement["appr_code"],
          pid: programElement["pid"],
        };
      });

      /* if (budgets) {
        const filter = budgets.filter((budget) => {
          if (keywords) {
            return budget["description"]
              .toLowerCase()
              .includes(keywords.toLowerCase());
          }
          return true;
        }); */
      console.log(budgets);
      if (budgets) {
        setBudgets(budgets);
      }
    };

    fetchBudgets();
  }, [searchParams]);

  const width = 500;
  const height = 500;

  // calculate number of results
  const results = budgets.length;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };
  const selectedProgramElements = budgets.filter((budget) =>
    //selectedRowKeys.includes(budget.pe_number+"-"+budget.
    selectedRowKeys.includes(budget.pid)
  );

  useEffect(() => {
    console.log(selectedRowKeys);
    console.log(selectedProgramElements);
  }),
    [selectedProgramElements];

  return (
    <Space
      direction="vertical"
      style={{
        width: "100%",
        height: "100%",
        //alignItems: "end",
        padding: "0 !important",
      }}
      className="table-container"
    >
      <ChartSelected programElements={selectedProgramElements} />
      <Space
        direction="horizontal"
        style={{
          justifyContent: "space-between",
          width: "100% !important",
          display: "flex",
          alignItems: "end",
        }}
      >
        {/* dropdown with option export full width */}
        <Space direction="horizontal" style={{ width: "100%" }}>
          <Dropdown.Button
            menu={{
              items: [
                {
                  label: "Export to CSV",
                  key: "csv",
                },
                {
                  label: "Export to Excel",
                  key: "excel",
                },
              ],
            }}
          >
            Export Selected
          </Dropdown.Button>
          <Button>Visualize Selected</Button>
        </Space>

        <Statistic title="Results" value={results} />
      </Space>

      <Table
        //virtual
        //scroll={{ y: 500 }}
        dataSource={budgets}
        columns={columns}
        expandable={{
          expandedRowRender: (record) => (
            <Space direction="vertical">
              <Typography style={{ fontWeight: "bold" }}>
                PE Number: {record["key"]}
              </Typography>
              <Typography>Description: </Typography>
              <Typography>{record["description"]}</Typography>
            </Space>
          ),
          //rowExpandable: (record) => record.description !== "",
        }}
        rowSelection={rowSelection}
        style={{ width: "99%", height: "100%" }}
        // height should be 100% of parent
        //style={{ height: "100%" }}
        scroll={{ y: "100%" }}
        //virtual
        pagination={false}
      />
    </Space>
  );
};

export default BudgetVisualization;

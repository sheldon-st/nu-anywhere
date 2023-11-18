import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import React from "react";

import { supabase } from "../config/supabaseClient";

const AgencyNameMap = {
  "Space Force": "USSF",
  MDA: "MDA",
};

function NewTableFromJson() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  //const [tableName, setTableName] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile) {
      return;
    }

    const fileReader = new FileReader();
    fileReader.readAsText(selectedFile, "UTF-8");
    fileReader.onload = async (event) => {
      console.log(event);
      if (!event.target || typeof event.target.result !== "string") {
        return;
      }

      const jsonData = JSON.parse(event.target.result)["programs"];
      console.log(jsonData);
      // map the json data to the table
      const mappedData = jsonData.map((program) => {
        return {
          pe_number: program["PE Number"],
          pe_name: program["PE Name"],
          description: program["Mission Description"],
          fy_2022: program["Budgets"]["fy_2022"],
          fy_2023: program["Budgets"]["fy_2023"],
          fy_2024: program["Budgets"]["fy_2024total"],
          fy_2025: program["Budgets"]["fy_2025"],
          fy_2026: program["Budgets"]["fy_2026"],
          fy_2027: program["Budgets"]["fy_2027"],
          fy_2028: program["Budgets"]["fy_2028"],
          org: AgencyNameMap[program["Organization"]],
          ba_code: program["appropriation_budget_activity"]["ba_code"],
          appr_code:
            program["appropriation_budget_activity"]["appropriation_code"],
          content: program["content"],
          pid:
            program["PE Number"] +
            program["appropriation_budget_activity"]["ba_code"],
        };
      });

      const { data, error } = await supabase
        .from("program_budgets")
        .insert(mappedData);

      if (error) {
        console.error(error);
        return;
      }

      console.log(data);
    };
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div></div>
      <div>
        <label htmlFor="json-file-input">JSON File:</label>
        <input type="file" id="json-file-input" onChange={handleFileChange} />
      </div>
      <button type="submit">Create Table</button>
    </form>
  );
}

export default NewTableFromJson;

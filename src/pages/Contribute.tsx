import React from "react";
import NewTableFromJson from "./NewBudget";
import BudgetVisualization from "./budget/BudgetVisualization";
import BudgetSearch from "./budget/search/BudgetSearch";
function ContributePage() {
  return (
    <div>
      <h1>Welcome</h1>
      <p>This is the welcome page</p>
      <NewTableFromJson />
    </div>
  );
}

export default ContributePage;

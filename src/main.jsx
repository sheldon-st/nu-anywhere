import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import { PostHogProvider } from "posthog-js/react";
import posthog from "posthog-js";

const options = {
  api_host: import.meta.env.REACT_APP_PUBLIC_POSTHOG_HOST,
};

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

posthog.init("phc_QhC0OlHKlQCZw3jRoxLCqnxtU9KyHR9LVD7cSTKDcAe", {
  api_host: "https://app.posthog.com",
});

root.render(
  <StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.REACT_APP_PUBLIC_POSTHOG_KEY}
      options={options}
    >
      <App />
    </PostHogProvider>
  </StrictMode>
);

import { BrowserRouter, Route, Routes } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import BlogLayout from "./pages/BlogLayout";
import BlogPostsPage from "./pages/BlogPosts";
import NewPostPage from "./pages/NewPost";
import PostDetailPage from "./pages/PostDetail";
import WelcomePage from "./pages/WelcomePage";
import "./App.css";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./hooks/Auth";
import Profile from "./pages/Profile";
import SearchResults from "./pages/budget/Results";
import { BudgetHome } from "./pages/BudgetHome";
import { ConfigProvider, Empty } from "antd";
import ContributePage from "./pages/Contribute";
import { DocumentsHome } from "./pages/documents/DocumentsHome";
import { AgencyDetail } from "./pages/agencies/AgencyDetail";
import { DocumentDetail } from "./pages/documents/DocumentDetail";
import { AgencyHome } from "./pages/agencies/AgencyHome";
import UserRegistration from "./pages/profile/Registration";
import { EventsHome } from "./pages/events/EventsHome";
import CreateEvent from "./pages/events/CreateEvent";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ConfigProvider
          theme={{
            token: {
              // Seed Token
              colorPrimary: "#8338ec",

              // Alias Token
            },
          }}
        >
          <RootLayout>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/events" element={<EventsHome />} />
              <Route
                path="/connections"
                element={
                  <Empty description="The connections page is currently under construction" />
                }
              />
              <Route path="/events/create" element={<CreateEvent />} />
              {/* <Route path="/budget">
                <Route index element={<BudgetHome />} />
                <Route path="search" element={<SearchResults />} />
              </Route>
              <Route path="/documents">
                <Route index element={<DocumentsHome />} />
              </Route>
              <Route path="agency" element={<AgencyHome />} />
              <Route path="/fr">
                <Route path="agency">
                  <Route index element={<AgencyHome />} />
                  <Route path=":agencySlug" element={<AgencyDetail />} />
                </Route>
                <Route path="document">
                  <Route path=":documentId" element={<DocumentDetail />} />
                </Route>
              </Route>
              <Route
                path="blog"
                element={
                  <ProtectedRoute>
                    <BlogLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<BlogPostsPage />} />
                <Route path=":id" element={<PostDetailPage />} />
              </Route>
              <Route path="/blog/new" element={<NewPostPage />} /> */}
              // Pretected Profile page
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <ProtectedRoute>
                    <UserRegistration />
                  </ProtectedRoute>
                }
              />
              {/* <Route
                path="/contribute"
                element={
                  <ProtectedRoute>
                    <ContributePage />
                  </ProtectedRoute>
                }
              /> */}
            </Routes>
          </RootLayout>
        </ConfigProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./Pages/App"
import PrivatePage from "./Pages/PrivatePage"
import Layouts from "./Components/Layouts";
import ErrorPage from "./Pages/ErrorPage";
import Home from "./Pages/Home";
import PostDetail from "./Pages/PostDetail";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import LoginD from "./Pages/LoginD";
import UserProfile from "./Pages/UserProfile";
import Category from "./Pages/Category";
import FullSizePage from "./Pages/FullSizePage";
import Blog from "./Pages/Blog";
import CreatePost from "./Pages/CreatePost";
import EditPost from "./Pages/EditPost";
import CategoryPosts from "./Pages/CategoryPosts";
import AuthorPosts from "./Pages/AuthorPosts";
import Dashboard from "./Pages/Dashboard";
import Logout from "./Pages/Logout";
import ShareUrThoughts from "./Pages/ShareUrThoughts";



const router = createBrowserRouter([
  {
    path: "/",
    element: <Layouts />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "posts/:id", element: <PostDetail /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "loginD", element: <LoginD /> },
      { path: "app", element: <App /> },
      { path: "privatepage", element: <PrivatePage /> },
      { path: "profile/:id", element: <UserProfile /> },
      { path: "category", element: <Category /> },
      { path: "full-size-page/:postId", element: <FullSizePage /> },
      { path: "blog", element: <Blog /> },
      { path: "create", element: <CreatePost /> },
      { path: "editpost/:id", element: <EditPost /> },
      { path: "Posts/categories/:category", element: <CategoryPosts /> },
      { path: "Posts/users/:id", element: <AuthorPosts /> },
      { path: "dashboard", element: <Dashboard /> }, //edit delete pandra page
      { path: "logout", element: <Logout /> },
      { path: "shareurthoughts", element: <ShareUrThoughts /> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


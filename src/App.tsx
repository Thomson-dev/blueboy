import { useState, useEffect } from "react";
import BlueboySite from "./pages/Home";
import Admin from "./pages/Admin";
import { ContentProvider } from "./context/ContentContext";

function getPage() {
  return window.location.hash === "#/admin" ? "admin" : "home";
}

export default function App() {
  const [page, setPage] = useState(getPage);

  useEffect(() => {
    const onHash = () => setPage(getPage());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <ContentProvider>
      {page === "admin" ? <Admin /> : <BlueboySite />}
    </ContentProvider>
  );
}

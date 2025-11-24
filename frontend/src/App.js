import OrangeParticlesBackground from "./components/OrangeParticlesBackground";
import AdvisorsPage from "./pages/AdvisorsPage.jsx";
import AdvisorsDetailPage from "./pages/AdvisorsDetailPage.jsx";
import ScrollToTop from "./ScrollToTop";
// import { useEffect } from "react";
// import { authAPI } from "./utils/authUtils";
// import React from "react";
import React, { useEffect } from "react";
import { authAPI } from "./utils/authUtils";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import PageTransition from "./components/PageTransition";
import ProjectDetails from "./pages/ProjectDetails";
import PartnerDetails from "./pages/PartnerDetails.jsx";
import PartnersPage from "./pages/PartnersPage";
import AuthorsPage from "./pages/AuthorsPage";
import AdminAuthors from "./pages/AdminAuthors";

// Public Pages
import Home from "./pages/Home";
import OurStory from "./pages/OurStory";
import OurTeam from "./pages/OurTeam";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Projects from "./pages/Projects";
import Articles from "./pages/Articles";
import Events from "./pages/Events";

// Admin Components
import TeamMemberPage from "./pages/TeamMemberPage.jsx";
import MemberDetailPage from './pages/team/MemberDetailPage';
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHome from "./pages/AdminHome";
import AdminUsers from "./pages/AdminUsers";
import AdminServices from "./pages/AdminServices";
import AdminProjects from "./pages/AdminProjects";
import AdminEvents from "./pages/AdminEvents";
import AdminArticles from "./pages/AdminArticles";
import AdminMembers from "./pages/AdminMembers";
import AdminPartners from "./pages/AdminPartners";
import AdminAdvisors from "./pages/AdminAdvisors";
import AdminContactMessages from "./pages/AdminContactMessages";

// Authentication
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  useEffect(() => {
    authAPI.scheduleAutoLogout();
  }, []);
  return (
    <>
      <ScrollToTop />
      <OrangeParticlesBackground />
      <PageTransition>
        <div style={{ width: "85%", margin: "0 auto", minWidth: "320px" }}>
          <Routes>
            {/* Public Routes - All wrapped with Layout */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/about" element={<Layout><OurStory /></Layout>} />
            <Route path="/team" element={<Layout><OurTeam /></Layout>} />
            <Route path="/team/:id" element={<Layout><MemberDetailPage /></Layout>} />
            <Route path="/services" element={<Layout><Services /></Layout>} />
            <Route path="/projects" element={<Layout><Projects /></Layout>} />
            <Route path="/projects/:id" element={<Layout><ProjectDetails /></Layout>} />
            <Route path="/partners-list" element={<Layout><PartnersPage /></Layout>} />
            <Route path="/authors-list" element={<Layout><AuthorsPage /></Layout>} />
            <Route path="/partners/:id" element={<Layout><PartnerDetails /></Layout>} />
            <Route path="/advisors" element={<Layout><AdvisorsPage /></Layout>} />
            <Route path="/advisors/:id" element={<Layout><AdvisorsDetailPage /></Layout>} />
            <Route path="/articles" element={<Layout><Articles /></Layout>} />
            <Route path="/events" element={<Layout><Events /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />

            {/* Admin Login Route - Also wrapped with Layout */}
            <Route path="/admin/login" element={<Layout><Login /></Layout>} />

            {/* Protected Admin Routes - Also wrapped with Layout */}
            <Route path="/admin" element={<Layout><ProtectedRoute><AdminDashboard /></ProtectedRoute></Layout>}>
              <Route index element={<AdminHome />} />
              <Route path="admin-management" element={<AdminUsers />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="members" element={<AdminMembers />} />
              <Route path="partners" element={<AdminPartners />} />
              <Route path="advisors" element={<AdminAdvisors />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="authors" element={<AdminAuthors />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="articles" element={<AdminArticles />} />
              <Route path="contact-messages" element={<AdminContactMessages />} />
            </Route>
          </Routes>
        </div>
      </PageTransition>
    </>
  );
}

export default App;
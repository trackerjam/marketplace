import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Docs from './pages/Docs';
import Support from './pages/Support';
import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import FAQ from './pages/FAQ';
import Careers from './pages/Careers';
import Freelancers from './pages/Freelancers';
import FreelancerProfile from './pages/FreelancerProfile';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import PostJob from './pages/PostJob';
import Payments from './pages/Payments';
import Pricing from './pages/Pricing';
import Comparison from './pages/Comparison';
import Admin from './pages/Admin';
import Messages from './pages/Messages';
import ProductivityAnalytics from './pages/docs/ProductivityAnalytics';
import FreelancerGuide from './pages/docs/FreelancerGuide';
import BusinessGuide from './pages/docs/BusinessGuide';
import PaymentDocs from './pages/docs/PaymentDocs';
import SecurityDocs from './pages/docs/SecurityDocs';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/post-job" element={<PostJob />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/docs/analytics" element={<ProductivityAnalytics />} />
              <Route path="/docs/freelancers/getting-started" element={<FreelancerGuide />} />
              <Route path="/docs/businesses/getting-started" element={<BusinessGuide />} />
              <Route path="/docs/payments" element={<PaymentDocs />} />
              <Route path="/docs/security" element={<SecurityDocs />} />
              <Route path="/support" element={<Support />} />
              <Route path="/about" element={<About />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/comparison" element={<Comparison />} />
              <Route path="/freelancers" element={<Freelancers />} />
              <Route path="/freelancers/:id" element={<FreelancerProfile />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
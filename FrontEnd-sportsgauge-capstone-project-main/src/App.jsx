import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { PageTransition } from './components/Motion.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Programs from './pages/Programs.jsx'
import Stories from './pages/Stories.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx'
import TestsDashboard from './pages/TestsDashboard.jsx'
import UploadCenter from './pages/UploadCenter.jsx'
import Admin from './pages/Admin.jsx'
import Coaches from './pages/Coaches.jsx'
import CoachDetail from './pages/CoachDetail.jsx'
import CoachRegister from './pages/CoachRegister.jsx'
import News from './pages/News.jsx'
import NewsDetail from './pages/NewsDetail.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import Talent from './pages/Talent.jsx'
import Events from './pages/Events.jsx'
import Academies from './pages/Academies.jsx'
import Scholarships from './pages/Scholarships.jsx'
import AthletePublic from './pages/AthletePublic.jsx'
import FAQ from './pages/FAQ.jsx'
import Resources from './pages/Resources.jsx'
import Legal from './pages/Legal.jsx'
import CoachLogin from './pages/CoachLogin.jsx'
import CoachDashboard from './pages/CoachDashboard.jsx'
import Notifications from './pages/Notifications.jsx'
import Messages from './pages/Messages.jsx'

export default function App() {
  const location = useLocation()
  
  return (
    <div className="w-full min-h-screen page-shell">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/programs" element={<PageTransition><Programs /></PageTransition>} />
          <Route path="/stories" element={<PageTransition><Stories /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
          <Route path="/dashboard" element={<PageTransition><TestsDashboard /></PageTransition>} />
          <Route path="/tests" element={<PageTransition><TestsDashboard /></PageTransition>} />
          <Route path="/assessment" element={<PageTransition><UploadCenter /></PageTransition>} />
          <Route path="/upload" element={<Navigate to="/assessment" replace />} />
          <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
          <Route path="/coaches" element={<PageTransition><Coaches /></PageTransition>} />
          <Route path="/coaches/login" element={<PageTransition><CoachLogin /></PageTransition>} />
          <Route path="/coaches/register" element={<PageTransition><CoachRegister /></PageTransition>} />
          <Route path="/coach/dashboard" element={<PageTransition><CoachDashboard /></PageTransition>} />
          <Route path="/coaches/:slug" element={<PageTransition><CoachDetail /></PageTransition>} />
          <Route path="/news" element={<PageTransition><News /></PageTransition>} />
          <Route path="/news/:slug" element={<PageTransition><NewsDetail /></PageTransition>} />
          <Route path="/leaderboard" element={<PageTransition><Leaderboard /></PageTransition>} />
          <Route path="/talent" element={<PageTransition><Talent /></PageTransition>} />
          <Route path="/events" element={<PageTransition><Events /></PageTransition>} />
          <Route path="/academies" element={<PageTransition><Academies /></PageTransition>} />
          <Route path="/scholarships" element={<PageTransition><Scholarships /></PageTransition>} />
          <Route path="/athlete/:username" element={<PageTransition><AthletePublic /></PageTransition>} />
          <Route path="/faq" element={<PageTransition><FAQ /></PageTransition>} />
          <Route path="/resources" element={<PageTransition><Resources /></PageTransition>} />
          <Route path="/legal/:doc" element={<PageTransition><Legal /></PageTransition>} />
          <Route path="/notifications" element={<PageTransition><Notifications /></PageTransition>} />
          <Route path="/messages" element={<PageTransition><Messages /></PageTransition>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}
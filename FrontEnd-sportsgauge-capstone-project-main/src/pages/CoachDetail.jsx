import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FadeInSection } from '../components/Motion';
import CoachProfileHeader from '../components/coaches/CoachProfileHeader';
import CoachAboutSection from '../components/coaches/CoachAboutSection';
import CoachCertifications from '../components/coaches/CoachCertifications';
import CoachStatsBar from '../components/coaches/CoachStatsBar';
import CoachSpecializations from '../components/coaches/CoachSpecializations';
import CoachSuccessStories from '../components/coaches/CoachSuccessStories';
import CoachReviews from '../components/coaches/CoachReviews';
import CoachContactPanel from '../components/coaches/CoachContactPanel';
import { fetchCoachFull } from '../utils/ecosystemApi';
import { mergeCoachProfile } from '../constants/content/coachProfiles';

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-72 rounded-2xl" />
      <div className="grid grid-cols-5 gap-3">{[1,2,3,4,5].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}</div>
      <div className="skeleton h-64 rounded-2xl" />
    </div>
  );
}

export default function CoachDetail() {
  const { slug } = useParams();
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCoachFull(slug)
      .then(data => setCoach(mergeCoachProfile(data, slug)))
      .catch(() => setCoach(mergeCoachProfile(null, slug)))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="page-shell">
      <Navbar />
      <section className="pt-24 pb-16 max-w-7xl mx-auto px-4">
        <Link to="/coaches" className="text-sm text-ki-saffron mb-6 inline-block hover:underline">← All Coaches</Link>
        {loading ? (
          <ProfileSkeleton />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <FadeInSection><CoachProfileHeader coach={coach} /></FadeInSection>
              <FadeInSection><CoachStatsBar stats={coach.stats} /></FadeInSection>
              <FadeInSection><CoachAboutSection coach={coach} /></FadeInSection>
              <FadeInSection><CoachCertifications certifications={coach.certifications} /></FadeInSection>
              <FadeInSection><CoachSpecializations cards={coach.specialization_cards} /></FadeInSection>
              <FadeInSection><CoachSuccessStories stories={coach.success_stories} /></FadeInSection>
              <FadeInSection><CoachReviews reviews={coach.reviews} /></FadeInSection>
            </div>
            <div className="lg:col-span-1">
              <CoachContactPanel coach={coach} />
            </div>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}

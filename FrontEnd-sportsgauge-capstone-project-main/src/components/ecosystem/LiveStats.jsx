import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { fetchPlatformStats } from '../../utils/ecosystemApi';

function Counter({ value }) {
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, v => Math.round(v).toLocaleString());
  useEffect(() => { spring.set(value || 0); }, [value, spring]);
  return <motion.span>{display}</motion.span>;
}

export default function LiveStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchPlatformStats().then(setStats).catch(() => setStats({}));
  }, []);

  const items = [
    { label: 'Athletes Registered', key: 'athletes_registered' },
    { label: 'Assessments Done', key: 'assessments_completed' },
    { label: 'Coaches', key: 'coaches_registered' },
    { label: 'Events', key: 'events_conducted' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map(({ label, key }) => (
        <div key={key} className="glass-card p-6 text-center glow-border">
          <p className="text-2xl md:text-3xl font-display font-bold text-ki-saffron">
            <Counter value={stats?.[key] ?? 0} />
          </p>
          <p className="text-xs text-theme-muted mt-2 uppercase tracking-wider">{label}</p>
        </div>
      ))}
    </div>
  );
}

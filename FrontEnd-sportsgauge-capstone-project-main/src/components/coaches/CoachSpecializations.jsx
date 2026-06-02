import { FaRunning, FaDumbbell, FaHeartbeat, FaChild } from 'react-icons/fa';

const ICONS = {
  Athletics: FaRunning,
  'Sprint Training': FaRunning,
  'Strength & Conditioning': FaDumbbell,
  'Endurance Training': FaHeartbeat,
  'Youth Development': FaChild,
};

export default function CoachSpecializations({ cards = [] }) {
  const list = cards.length ? cards : [
    { name: 'Athletics', active: true },
    { name: 'Sprint Training', active: true },
    { name: 'Strength & Conditioning', active: true },
    { name: 'Endurance Training', active: false },
    { name: 'Youth Development', active: true },
  ];

  return (
    <div className="glass-card p-6 md:p-8">
      <h2 className="text-xl font-display font-bold mb-6">Sports Specializations</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(({ name, active }) => {
          const Icon = ICONS[name] || FaRunning;
          return (
            <div
              key={name}
              className={`p-5 rounded-xl border transition-all card-hover ${
                active ? 'bg-ki-saffron/10 border-ki-saffron/30' : 'bg-theme-elevated/50 border-theme opacity-60'
              }`}
            >
              <Icon className={`text-2xl mb-3 ${active ? 'text-ki-saffron' : 'text-theme-muted'}`} />
              <p className="font-semibold">{name}</p>
              {active && <span className="text-[10px] text-ki-saffron mt-1 inline-block">Active specialty</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

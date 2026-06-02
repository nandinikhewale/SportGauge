import { Counter } from '../Motion';

const ITEMS = [
  { key: 'athletes_trained', label: 'Athletes Trained', suffix: '' },
  { key: 'assessments_reviewed', label: 'Assessments Reviewed', suffix: '' },
  { key: 'success_rate', label: 'Success Rate', suffix: '%' },
  { key: 'improvement_pct', label: 'Avg Improvement', suffix: '%' },
  { key: 'national_athletes', label: 'National Athletes', suffix: '' },
];

export default function CoachStatsBar({ stats = {} }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {ITEMS.map(({ key, label, suffix }) => (
        <div key={key} className="glass-card p-5 text-center glow-border card-hover">
          <p className="text-2xl md:text-3xl font-display font-bold text-ki-saffron">
            <Counter end={stats[key] ?? 0} suffix={suffix} decimals={key.includes('rate') || key.includes('pct') ? 1 : 0} />
          </p>
          <p className="text-[10px] uppercase tracking-wider text-theme-muted mt-2">{label}</p>
        </div>
      ))}
    </div>
  );
}

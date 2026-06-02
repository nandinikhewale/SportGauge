import { Counter } from '../../Motion';

const METRICS = [
  { key: 'total_athletes', label: 'Total Athletes' },
  { key: 'active_athletes', label: 'Active Athletes' },
  { key: 'assessments_reviewed', label: 'Assessments Reviewed' },
  { key: 'monthly_progress', label: 'Monthly Progress', suffix: '%', decimals: 1 },
  { key: 'success_rate', label: 'Success Rate', suffix: '%', decimals: 1 },
];

export default function CoachQuickStats({ stats = {} }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {METRICS.map(({ key, label, suffix = '', decimals = 0 }) => (
        <div key={key} className="glass-card p-5 text-center card-hover glow-border">
          <p className="text-2xl font-display font-bold text-ki-saffron">
            <Counter end={stats[key] ?? 0} suffix={suffix} decimals={decimals} />
          </p>
          <p className="text-[10px] uppercase tracking-wider text-theme-muted mt-2">{label}</p>
        </div>
      ))}
    </div>
  );
}

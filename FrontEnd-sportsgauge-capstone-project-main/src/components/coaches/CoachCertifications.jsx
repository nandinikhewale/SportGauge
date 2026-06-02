import { HiAcademicCap } from 'react-icons/hi';

const TYPE_LABELS = {
  Coaching: 'Coaching Certification',
  SAI: 'Sports Authority Certification',
  National: 'National Credential',
  International: 'International Certification',
};

export default function CoachCertifications({ certifications = [] }) {
  const grouped = certifications.reduce((acc, c) => {
    const t = TYPE_LABELS[c.cert_type] || c.cert_type || 'Coaching Certification';
    if (!acc[t]) acc[t] = [];
    acc[t].push(c);
    return acc;
  }, {});

  return (
    <div className="glass-card p-6 md:p-8">
      <h2 className="text-xl font-display font-bold mb-6">Certifications</h2>
      <div className="space-y-6">
        {Object.entries(grouped).map(([type, certs]) => (
          <div key={type}>
            <h3 className="text-xs font-semibold text-theme-muted uppercase tracking-wider mb-3">{type}</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {certs.map((c, i) => (
                <div key={i} className="p-4 rounded-xl bg-theme-elevated border border-theme card-hover flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-ki-saffron/15 flex items-center justify-center shrink-0">
                    <HiAcademicCap className="text-ki-saffron" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{c.title}</p>
                    <p className="text-xs text-theme-muted mt-0.5">{c.issuer}{c.year ? ` · ${c.year}` : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

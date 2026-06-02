import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../components/Toast.jsx';
import { fetchAssessments, updateUser, uploadAvatar } from '../utils/api.js';
import UserAvatar, { profileCompletionPercent } from '../components/UserAvatar.jsx';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlinePencil,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineIdentification,
  HiBadgeCheck,
  HiStar,
  HiOutlinePhotograph,
} from 'react-icons/hi';
import { FadeInSection, StaggerContainer, StaggerItem } from '../components/Motion';
import LazyImage from '../components/LazyImage';
import { IMAGES } from '../constants/media';

const SPORTS = ['Athletics', 'Football', 'Cricket', 'Basketball', 'Volleyball', 'Kabaddi', 'Gymnastics', 'Weightlifting'];

export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser, refreshUser } = useApp();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [assessments, setAssessments] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [pendingAvatarFile, setPendingAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    full_name: '', age: '', gender: '', state: '', district: '',
    sports_interest: '', height: '', weight: '', bio: '',
  });

  useEffect(() => {
    if (!user?.id) {
      navigate('/login');
      return;
    }
    setFormData({
      full_name: user.full_name || '',
      age: user.age ?? '',
      gender: user.gender || '',
      state: user.state || '',
      district: user.district || '',
      sports_interest: user.sports_interest || '',
      height: user.height ?? '',
      weight: user.weight ?? '',
      bio: user.bio || '',
    });
    fetchAssessments(user.id).then(setAssessments).catch(() => setAssessments([]));
  }, [user, navigate]);

  const completion = profileCompletionPercent(
    pendingAvatarFile ? { ...user, ...formData, profile_photo: 'pending' } : { ...user, ...formData }
  );

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoSelect = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      showToast('Use JPG, PNG, or WEBP only.', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be under 5MB.', 'error');
      return;
    }
    setPendingAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    showToast('Preview ready. Save to upload.', 'info');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (pendingAvatarFile) {
        setUploadingPhoto(true);
        const avatarRes = await uploadAvatar(user.id, pendingAvatarFile);
        setPendingAvatarFile(null);
        if (avatarPreview) URL.revokeObjectURL(avatarPreview);
        setAvatarPreview(null);
        setUploadingPhoto(false);
        showToast('Profile picture updated.', 'success');
        await refreshUser(user.id);
      }
      const updated = await updateUser(user.id, {
        ...formData,
        age: Number(formData.age),
        height: Number(formData.height),
        weight: Number(formData.weight),
      });
      setUser(updated);
      setIsEditing(false);
      showToast('Profile updated successfully.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to save profile.', 'error');
    } finally {
      setSaving(false);
      setUploadingPhoto(false);
    }
  };

  const getBadges = () => {
    const badges = [];
    if (assessments.length > 0) badges.push({ name: 'First Step', icon: '🎯', desc: 'Completed first assessment' });
    if (assessments.length >= 5) badges.push({ name: 'Consistent', icon: '🔥', desc: 'Completed 5+ assessments' });
    if (assessments.some(a => a.score > 90)) badges.push({ name: 'Elite Performer', icon: '⭐', desc: 'Scored 90+ in any test' });
    if (assessments.every(a => a.validation_status === 'Valid') && assessments.length > 0) {
      badges.push({ name: 'Clean Record', icon: '🛡️', desc: '100% valid assessments' });
    }
    if (badges.length === 0) badges.push({ name: 'Registered', icon: '👋', desc: 'Joined SportsGauge' });
    return badges;
  };

  const displayUser = user ? { ...user, ...(avatarPreview ? { _preview: avatarPreview } : {}) } : null;

  return (
    <div className="page-shell pb-20">
      <Navbar />

      <div className="relative h-64 md:h-80 w-full overflow-hidden mt-16">
        <LazyImage src={IMAGES.training} alt="Athlete profile banner" seed="profile-banner" wrapperClassName="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-theme-base via-theme-base/60 to-transparent transition-colors duration-500" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <FadeInSection>
              <div className="glass-card-strong p-6 sm:p-8 relative">
                <button
                  type="button"
                  onClick={() => {
                    if (isEditing) {
                      setPendingAvatarFile(null);
                      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
                      setAvatarPreview(null);
                    }
                    setIsEditing(!isEditing);
                  }}
                  className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-gray-400 hover:text-white"
                >
                  {isEditing ? <HiOutlineX /> : <HiOutlinePencil />}
                </button>

                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative mb-4">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Preview" className="w-28 h-28 rounded-full object-cover border-4 border-ki-dark" />
                    ) : (
                      <UserAvatar user={displayUser} size="lg" className="border-4 border-ki-dark" />
                    )}
                    <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-ki-dark flex items-center justify-center">
                      <HiBadgeCheck size={12} className="text-white" />
                    </div>
                  </div>

                  {isEditing && (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handlePhotoSelect}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingPhoto}
                        className="btn-secondary w-auto px-4 py-2 text-xs mb-4 flex items-center gap-2 mx-auto"
                      >
                        <HiOutlinePhotograph size={16} />
                        {uploadingPhoto ? 'Uploading…' : 'Change Profile Picture'}
                      </button>
                    </>
                  )}

                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="text-xs text-ki-saffron hover:text-white mb-3 transition-colors"
                    >
                      Edit Profile
                    </button>
                  )}

                  {isEditing ? (
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="input-field text-center font-display font-bold text-xl py-2 mb-2"
                    />
                  ) : (
                    <h1 className="text-2xl font-display font-bold mb-1">{formData.full_name}</h1>
                  )}

                  {isEditing ? (
                    <select name="sports_interest" value={formData.sports_interest} onChange={handleChange} className="input-field text-center text-sm py-1.5 px-3">
                      {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  ) : (
                    <>
                      <span className="badge badge-saffron text-xs">{formData.sports_interest} Athlete</span>
                      {user?.username && (
                        <Link to={`/athlete/${user.username}`} className="block text-xs text-ki-saffron mt-2 hover:underline">
                          Public profile: /athlete/{user.username}
                        </Link>
                      )}
                    </>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-500 font-medium uppercase tracking-wider">Profile Completion</span>
                    <span className="text-ki-saffron font-bold">{completion}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-ki-saffron to-ki-accent transition-all duration-500"
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2">
                    {completion < 50 && 'Add more details to improve your athlete profile.'}
                    {completion >= 50 && completion < 80 && 'Good progress — complete remaining fields.'}
                    {completion >= 80 && completion < 100 && 'Almost there! Add a photo or bio to reach 100%.'}
                    {completion === 100 && 'Your profile is complete.'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">About</h3>
                    {isEditing ? (
                      <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} className="input-field text-sm resize-none" placeholder="Tell coaches about your goals…" />
                    ) : (
                      <p className="text-sm text-gray-300 leading-relaxed italic">"{formData.bio || 'No bio yet.'}"</p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/[0.05] space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <HiOutlineLocationMarker className="text-ki-saffron shrink-0" size={16} />
                      {isEditing ? (
                        <div className="flex gap-2 w-full">
                          <input type="text" name="district" value={formData.district} onChange={handleChange} className="input-field py-1.5 px-3 flex-1" placeholder="District" />
                          <input type="text" name="state" value={formData.state} onChange={handleChange} className="input-field py-1.5 px-3 flex-1" placeholder="State" />
                        </div>
                      ) : (
                        <span>{formData.district}, {formData.state}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <HiOutlineCalendar className="text-ki-saffron shrink-0" size={16} />
                      {isEditing ? (
                        <div className="flex gap-2 w-full">
                          <input type="number" name="age" value={formData.age} onChange={handleChange} className="input-field py-1.5 px-3 w-20" placeholder="Age" />
                          <select name="gender" value={formData.gender} onChange={handleChange} className="input-field py-1.5 px-3 flex-1">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      ) : (
                        <span>{formData.age} years old ({formData.gender})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <HiOutlineIdentification className="text-ki-saffron shrink-0" size={16} />
                      {isEditing ? (
                        <div className="flex gap-2 w-full">
                          <input type="number" name="height" value={formData.height} onChange={handleChange} className="input-field py-1.5 px-3 flex-1" placeholder="Ht (cm)" />
                          <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="input-field py-1.5 px-3 flex-1" placeholder="Wt (kg)" />
                        </div>
                      ) : (
                        <span>{formData.height}cm / {formData.weight}kg</span>
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isEditing && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <button
                          type="button"
                          onClick={handleSave}
                          disabled={saving}
                          className="btn-primary py-3 mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {saving ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <><HiOutlineCheck /> Save Changes</>
                          )}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.1}>
              <div className="glass-card p-6">
                <h3 className="text-sm font-display font-semibold mb-4 uppercase tracking-wider">Achievements & Badges</h3>
                <div className="grid grid-cols-2 gap-3">
                  {getBadges().map((badge, i) => (
                    <div key={i} className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 flex flex-col items-center text-center">
                      <span className="text-2xl mb-2">{badge.icon}</span>
                      <span className="text-xs font-semibold">{badge.name}</span>
                      <span className="text-[9px] text-gray-500">{badge.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInSection>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <FadeInSection delay={0.2}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 lg:mt-0">
                <div className="glass-card p-5 text-center">
                  <div className="text-xs text-gray-500 uppercase mb-1">Total Tests</div>
                  <div className="text-3xl font-display font-bold">{assessments.length}</div>
                </div>
                <div className="glass-card p-5 text-center">
                  <div className="text-xs text-gray-500 uppercase mb-1">Best Score</div>
                  <div className="text-3xl font-display font-bold text-ki-saffron">
                    {assessments.length > 0 ? Math.max(...assessments.map(a => a.score)) : 0}
                  </div>
                </div>
                <div className="glass-card p-5 text-center">
                  <div className="text-xs text-gray-500 uppercase mb-1">Valid Rate</div>
                  <div className="text-3xl font-display font-bold text-emerald-400">
                    {assessments.length > 0
                      ? Math.round((assessments.filter(a => a.validation_status === 'Valid').length / assessments.length) * 100)
                      : 0}%
                  </div>
                </div>
                <div className="glass-card p-5 text-center border-ki-saffron/20">
                  <div className="text-xs text-ki-saffron/80 uppercase mb-1">Profile</div>
                  <div className="text-3xl font-display font-bold">{completion}%</div>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.3}>
              <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-white/[0.05] flex justify-between items-center">
                  <h2 className="text-lg font-display font-semibold">Complete Assessment History</h2>
                  <Link to="/assessment" className="text-xs text-ki-saffron hover:text-white">New Assessment</Link>
                </div>
                <div className="p-2">
                  {assessments.length > 0 ? (
                    <StaggerContainer className="space-y-2">
                      {[...assessments].sort((a, b) => new Date(b.date) - new Date(a.date)).map(a => (
                        <StaggerItem key={a.id}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-ki-saffron/10 flex items-center justify-center font-bold text-ki-saffron">
                                {a.score}
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold capitalize">{a.test_name} Assessment</h4>
                                <p className="text-xs text-gray-500">{new Date(a.date).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <span className="text-xs text-gray-400">{a.ai_confidence}% confidence</span>
                          </div>
                        </StaggerItem>
                      ))}
                    </StaggerContainer>
                  ) : (
                    <div className="py-12 text-center">
                      <p className="text-gray-500 text-sm mb-4">No assessment history yet.</p>
                      <Link to="/assessment" className="btn-primary w-auto inline-flex px-6 py-2.5 text-sm no-underline">
                        Start First Assessment
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </div>
    </div>
  );
}

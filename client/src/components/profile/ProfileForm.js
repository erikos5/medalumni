import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import AuthContext from '../../context/auth/AuthContext';
import AlertContext from '../../context/alert/AlertContext';
import Spinner from '../layout/Spinner';

const ProfileForm = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const { user, loading } = authContext;
  const { setAlert } = alertContext;

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    school: '',
    graduationYear: '',
    degree: '',
    bio: '',
    location: '',
    currentPosition: '',
    company: '',
    website: '',
    skills: '',
    linkedin: '',
    twitter: '',
    facebook: '',
    instagram: '',
    profileImage: ''
  });

  const [schools, setSchools] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    school,
    graduationYear,
    degree,
    bio,
    location,
    currentPosition,
    company,
    website,
    skills,
    linkedin,
    twitter,
    facebook,
    instagram,
    profileImage
  } = formData;

  useEffect(() => {
    const getSchools = async () => {
      try {
        const res = await api.get('/api/schools');
        setSchools(res.data);
      } catch (err) {
        setAlert('Σφάλμα κατά τη φόρτωση των σχολών', 'danger');
      }
    };

    const getCurrentProfile = async () => {
      try {
        const res = await api.get('/api/profiles/me');
        setProfile(res.data);

        setFormData({
          school: res.data.school._id,
          graduationYear: res.data.graduationYear,
          degree: res.data.degree,
          bio: res.data.bio || '',
          location: res.data.location || '',
          currentPosition: res.data.currentPosition || '',
          company: res.data.company || '',
          website: res.data.website || '',
          skills: res.data.skills ? res.data.skills.join(', ') : '',
          linkedin: res.data.social?.linkedin || '',
          twitter: res.data.social?.twitter || '',
          facebook: res.data.social?.facebook || '',
          instagram: res.data.social?.instagram || '',
          profileImage: res.data.profileImage || ''
        });
      } catch (err) {
        if (err.response && err.response.status === 400) {
          // Δεν υπάρχει προφίλ
          setProfile(null);
        } else {
          setAlert('Σφάλμα κατά τη φόρτωση του προφίλ', 'danger');
        }
      }
      setIsLoading(false);
    };

    getSchools();
    getCurrentProfile();
  }, [setAlert]);

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/api/profiles', formData);
      setAlert('Το προφίλ ενημερώθηκε επιτυχώς', 'success');
      if (!profile) {
        // Αν είναι νέο προφίλ, ανακατεύθυνση στο dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      setAlert('Σφάλμα κατά την αποθήκευση του προφίλ', 'danger');
    }
  };

  if (loading || isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container">
      <h1 className="large text-primary">
        {profile ? 'Επεξεργασία Προφίλ' : 'Δημιουργία Προφίλ'}
      </h1>
      <p className="lead">
        <i className="fas fa-user"></i>{' '}
        {profile
          ? 'Ενημερώστε τις πληροφορίες του προφίλ σας'
          : 'Προσθέστε πληροφορίες για το προφίλ σας'}
      </p>
      <small>* = απαιτούμενο πεδίο</small>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <select
            name="school"
            value={school}
            onChange={onChange}
            required
          >
            <option value="">* Επιλέξτε Σχολή</option>
            {schools.map(s => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <input
            type="number"
            placeholder="* Έτος Αποφοίτησης"
            name="graduationYear"
            value={graduationYear}
            onChange={onChange}
            required
            min="1950"
            max={new Date().getFullYear()}
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="* Πτυχίο"
            name="degree"
            value={degree}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <textarea
            placeholder="Σύντομη Βιογραφία"
            name="bio"
            value={bio}
            onChange={onChange}
          ></textarea>
          <small className="form-text">Λίγα λόγια για εσάς</small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Τοποθεσία"
            name="location"
            value={location}
            onChange={onChange}
          />
          <small className="form-text">
            Πόλη & Χώρα (π.χ. Αθήνα, Ελλάδα)
          </small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Τρέχουσα Θέση"
            name="currentPosition"
            value={currentPosition}
            onChange={onChange}
          />
          <small className="form-text">Η επαγγελματική σας θέση</small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Εταιρεία"
            name="company"
            value={company}
            onChange={onChange}
          />
          <small className="form-text">Η εταιρεία στην οποία εργάζεστε</small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Ιστοσελίδα"
            name="website"
            value={website}
            onChange={onChange}
          />
          <small className="form-text">
            Η προσωπική σας ιστοσελίδα ή της εταιρείας σας
          </small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Δεξιότητες"
            name="skills"
            value={skills}
            onChange={onChange}
          />
          <small className="form-text">
            Χρησιμοποιήστε κόμματα για να διαχωρίσετε τις δεξιότητές σας (π.χ. HTML, CSS, JavaScript)
          </small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Εικόνα Προφίλ (URL)"
            name="profileImage"
            value={profileImage}
            onChange={onChange}
          />
          <small className="form-text">URL για την εικόνα του προφίλ σας</small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="LinkedIn URL"
            name="linkedin"
            value={linkedin}
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Twitter URL"
            name="twitter"
            value={twitter}
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Facebook URL"
            name="facebook"
            value={facebook}
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Instagram URL"
            name="instagram"
            value={instagram}
            onChange={onChange}
          />
        </div>

        <input type="submit" className="btn btn-primary my-1" value="Αποθήκευση" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Πίσω
        </Link>
      </form>
    </div>
  );
};

export default ProfileForm; 
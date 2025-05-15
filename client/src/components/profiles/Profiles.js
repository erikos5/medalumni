import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../utils/api';
import Spinner from '../layout/Spinner';

const Profiles = () => {
  const location = useLocation();
  const [profiles, setProfiles] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    school: '',
    graduationYear: ''
  });

  useEffect(() => {
    // Ελέγχουμε για query parameters στο URL
    const queryParams = new URLSearchParams(location.search);
    const schoolId = queryParams.get('school');
    
    if (schoolId) {
      setFilter(prevFilter => ({
        ...prevFilter,
        school: schoolId
      }));
    }
    
    const getProfiles = async () => {
      try {
        const res = await api.get('/api/profiles');
        // Φιλτράρουμε μόνο τα εγκεκριμένα προφίλ για δημόσια προβολή
        const approvedProfiles = res.data.filter(
          profile => profile.status === 'approved'
        );
        setProfiles(approvedProfiles);
      } catch (err) {
        console.error(err);
      }
    };

    const getSchools = async () => {
      try {
        const res = await api.get('/api/schools');
        setSchools(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    Promise.all([getProfiles(), getSchools()]).then(() => {
      setLoading(false);
    });
  }, [location.search]);

  const { school, graduationYear } = filter;

  const onChange = e => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilter({
      school: '',
      graduationYear: ''
    });
  };

  // Φιλτράρισμα προφίλ
  const filteredProfiles = profiles.filter(profile => {
    let matchesSchool = true;
    let matchesYear = true;

    if (school && school !== '') {
      matchesSchool = profile.school._id === school;
    }

    if (graduationYear && graduationYear !== '') {
      matchesYear = profile.graduationYear.toString() === graduationYear;
    }

    return matchesSchool && matchesYear;
  });

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container">
      <h1 className="large text-primary">Κατάλογος Αποφοίτων</h1>
      <p className="lead">
        <i className="fab fa-connectdevelop"></i> Συνδεθείτε με άλλους αποφοίτους του Mediterranean College
      </p>

      <div className="profiles-filter bg-light p-2 my-2">
        <h4>Φίλτρα Αναζήτησης</h4>
        <div className="form">
          <div className="form-group">
            <select name="school" value={school} onChange={onChange}>
              <option value="">Όλες οι Σχολές</option>
              {schools.map(s => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Έτος Αποφοίτησης"
              name="graduationYear"
              value={graduationYear}
              onChange={onChange}
            />
          </div>
          <button onClick={resetFilters} className="btn btn-light">
            Επαναφορά Φίλτρων
          </button>
        </div>
      </div>

      <div className="profiles">
        {filteredProfiles.length > 0 ? (
          filteredProfiles.map(profile => (
            <div key={profile._id} className="profile bg-light">
              <div>
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt=""
                    className="round-img"
                  />
                ) : (
                  <i className="fas fa-user fa-4x"></i>
                )}
              </div>
              <div>
                <h2>{profile.user.name}</h2>
                <p>
                  {profile.currentPosition}{' '}
                  {profile.company && <span> στην {profile.company}</span>}
                </p>
                <p>{profile.location && <span>{profile.location}</span>}</p>
                <p>Σχολή: {profile.school.name}</p>
                <p>Έτος Αποφοίτησης: {profile.graduationYear}</p>
                <Link to={`/profile/${profile.user._id}`} className="btn btn-primary">
                  Προβολή Προφίλ
                </Link>
              </div>

              <ul>
                {profile.skills.slice(0, 4).map((skill, index) => (
                  <li key={index} className="text-primary">
                    <i className="fas fa-check"></i> {skill}
                  </li>
                ))}
                {profile.skills.length > 4 && (
                  <li className="text-primary">
                    <i className="fas fa-ellipsis-h"></i> και άλλες {profile.skills.length - 4}
                  </li>
                )}
              </ul>
            </div>
          ))
        ) : (
          <h4>Δεν βρέθηκαν προφίλ με βάση τα επιλεγμένα φίλτρα...</h4>
        )}
      </div>
    </div>
  );
};

export default Profiles; 
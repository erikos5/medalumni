import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../utils/api';
import Spinner from '../layout/Spinner';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { id } = useParams();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await api.get(`/api/profiles/user/${id}`);
        setProfile(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    getProfile();
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  if (!profile) {
    return (
      <div className="container">
        <h1 className="large text-primary">Προφίλ</h1>
        <p>Δεν βρέθηκε προφίλ για αυτόν τον χρήστη.</p>
        <Link to="/profiles" className="btn">
          Επιστροφή στα Προφίλ
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <Link to="/profiles" className="btn">
        Επιστροφή στα Προφίλ
      </Link>

      <div className="profile-grid my-1">
        <div className="profile-top bg-primary p-2">
          {profile.profileImage ? (
            <img className="round-img my-1" src={profile.profileImage} alt="" />
          ) : (
            <i className="fas fa-user fa-6x"></i>
          )}
          <h1 className="large">{profile.user.name}</h1>
          <p className="lead">
            {profile.currentPosition} {profile.company && `στην ${profile.company}`}
          </p>
          <p>{profile.location && <span>{profile.location}</span>}</p>
          <div className="icons my-1">
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer">
                <i className="fas fa-globe fa-2x"></i>
              </a>
            )}
            {profile.social && profile.social.linkedin && (
              <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin fa-2x"></i>
              </a>
            )}
            {profile.social && profile.social.twitter && (
              <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter fa-2x"></i>
              </a>
            )}
            {profile.social && profile.social.facebook && (
              <a href={profile.social.facebook} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook fa-2x"></i>
              </a>
            )}
            {profile.social && profile.social.instagram && (
              <a href={profile.social.instagram} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram fa-2x"></i>
              </a>
            )}
          </div>
        </div>

        <div className="profile-about bg-light p-2">
          {profile.bio && (
            <>
              <h2 className="text-primary">Σχετικά με {profile.user.name.split(' ')[0]}</h2>
              <p>{profile.bio}</p>
              <div className="line"></div>
            </>
          )}
          
          <h2 className="text-primary">Ακαδημαϊκές Πληροφορίες</h2>
          <div className="academics">
            <div>
              <strong>Σχολή:</strong> {profile.school.name}
            </div>
            <div>
              <strong>Πτυχίο:</strong> {profile.degree}
            </div>
            <div>
              <strong>Έτος Αποφοίτησης:</strong> {profile.graduationYear}
            </div>
          </div>

          {profile.skills.length > 0 && (
            <>
              <div className="line"></div>
              <h2 className="text-primary">Δεξιότητες</h2>
              <div className="skills">
                {profile.skills.map((skill, index) => (
                  <div key={index} className="p-1">
                    <i className="fas fa-check"></i> {skill}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 
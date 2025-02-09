import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import './ProfilePage.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/user/profile');
        console.log('Profile data:', response.data); // For debugging
        if (response.data && response.data.data) {
          setProfile(response.data.data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile information');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="profile-loading">Loading...</div>;
  if (error) return <div className="profile-error">{error}</div>;
  if (!profile) return <div className="profile-error">Profile not found</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>Profile Information</h1>
        </div>
        
        <div className="profile-content">
          <div className="profile-section">
            <h2>Personal Information</h2>
            <div className="profile-field">
              <label>Name</label>
              <p>{profile.name || 'Not provided'}</p>
            </div>
            <div className="profile-field">
              <label>Email</label>
              <p>{profile.email || 'Not provided'}</p>
            </div>
            <div className="profile-field">
              <label>Phone</label>
              <p>{profile.phone || 'Not provided'}</p>
            </div>
          </div>

          <div className="profile-section">
            <h2>Address Information</h2>
            <div className="profile-field">
              <label>Address</label>
              <p>{profile.address?.address || 'Not provided'}</p>
            </div>
            <div className="profile-field">
              <label>City</label>
              <p>{profile.address?.city || 'Not provided'}</p>
            </div>
            <div className="profile-field">
              <label>State</label>
              <p>{profile.address?.state || 'Not provided'}</p>
            </div>
            <div className="profile-field">
              <label>Zip Code</label>
              <p>{profile.address?.zip_code || 'Not provided'}</p>
            </div>
          </div>

          <div className="profile-section">
            <h2>Account Information</h2>
            <div className="profile-field">
              <label>Member Since</label>
              <p>{profile.created_on ? new Date(profile.created_on).toLocaleDateString() : 'Not available'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 
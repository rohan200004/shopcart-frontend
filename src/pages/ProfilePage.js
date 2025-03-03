import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import './ProfilePage.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    address: '',
    city: '',
    state: '',
    zip_code: '',
    name: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      setProfile(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const response = await api.put(`/user/address/${addressId}/default`);
      if (response.data.message === "Success") {
        // Update the local state to reflect the change
        setProfile(prevProfile => ({
          ...prevProfile,
          address: prevProfile.address.map(addr => ({
            ...addr,
            selected: addr.id === addressId
          }))
        }));
      }
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address.id);
    setAddressForm({
      address: address.address,
      city: address.city,
      state: address.state,
      zip_code: address.zip_code,
      name: address.name
    });
  };

  const handleUpdateAddress = async (addressId) => {
    try {
      const response = await api.put(`/user/address/${addressId}`, addressForm);
      if (response.data.message === "Success") {
        // Update the local state
        setProfile(prevProfile => ({
          ...prevProfile,
          address: prevProfile.address.map(addr => 
            addr.id === addressId ? { ...addr, ...addressForm } : addr
          )
        }));
        setEditingAddress(null); // Close edit form
      }
    } catch (error) {
      console.error('Error updating address:', error);
      alert('Failed to update address. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingAddress(null);
    setAddressForm({
      address: '',
      city: '',
      state: '',
      zip_code: '',
      name: ''
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile</h1>
      </div>

      <div className="profile-content">
        <div className="profile-section user-info">
          <div className="profile-pic-container">
            <img 
              src={profile.profile_pic || 'https://via.placeholder.com/150'} 
              alt={profile.name} 
              className="profile-pic"
            />
          </div>
          <div className="user-details">
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
        </div>

        <div className="profile-section">
          <h2>Addresses</h2>
          <div className="addresses-grid">
            {profile.address && profile.address.map((addr) => (
              <div key={addr.id} className={`address-card ${addr.selected ? 'selected' : ''}`}>
                {editingAddress === addr.id ? (
                  <div className="address-edit-form">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        value={addressForm.name}
                        onChange={(e) => setAddressForm({...addressForm, name: e.target.value})}
                        placeholder="Address Name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Address</label>
                      <input
                        type="text"
                        value={addressForm.address}
                        onChange={(e) => setAddressForm({...addressForm, address: e.target.value})}
                        placeholder="Street Address"
                      />
                    </div>
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                        placeholder="City"
                      />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                        placeholder="State"
                      />
                    </div>
                    <div className="form-group">
                      <label>ZIP Code</label>
                      <input
                        type="text"
                        value={addressForm.zip_code}
                        onChange={(e) => setAddressForm({...addressForm, zip_code: e.target.value})}
                        placeholder="ZIP Code"
                      />
                    </div>
                    <div className="form-actions">
                      <button 
                        className="save-btn"
                        onClick={() => handleUpdateAddress(addr.id)}
                      >
                        Save
                      </button>
                      <button 
                        className="cancel-btn"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="address-header">
                      <div className="address-title">
                        <h3>{addr.name}</h3>
                        {addr.selected && <span className="default-badge">Default</span>}
                      </div>
                      <div className="address-actions">
                        <button 
                          className="edit-btn"
                          onClick={() => handleEditAddress(addr)}
                        >
                          Edit
                        </button>
                        <button className="delete-btn">Delete</button>
                      </div>
                    </div>
                    <div className="address-details">
                      <p className="street">{addr.address}</p>
                      <p className="city-state">
                        {addr.city}, {addr.state}
                      </p>
                      <p className="zip">{addr.zip_code}</p>
                    </div>
                    {!addr.selected && (
                      <button 
                        className="make-default-btn" 
                        onClick={() => handleSetDefault(addr.id)}
                      >
                        Make Default
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
            <div className="add-address-card">
              <button className="add-address-btn">
                <span>+</span>
                <p>Add New Address</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 
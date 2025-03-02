import React, { useState } from 'react';
import { updateProfile, requestAccountDeletion } from '../lib/api';

const Profile = () => {
    const [username, setUsername] = useState('');
    const [status, setStatus] = useState('');

    const handleUpdate = async () => {
        const result = await updateProfile(1, { name: username });
        if (result.success) {
            setStatus('Profile updated successfully!');
        } else {
            setStatus('Failed to update profile.');
        }
    };

    const handleDelete = async () => {
        const result = await requestAccountDeletion(1);
        if (result.success) {
            setStatus('Account deletion requested.');
        } else {
            setStatus('Failed to request account deletion.');
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Profile</h1>
            <input 
                type="text"
                placeholder="Enter new username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ marginBottom: '10px', padding: '8px' }}
            />
            <br />
            <button 
                onClick={handleUpdate} 
                style={{ margin: '10px', padding: '10px', cursor: 'pointer' }}
            >
                Update Profile
            </button>
            <button 
                onClick={handleDelete} 
                style={{ margin: '10px', padding: '10px', background: 'red', color: 'white', cursor: 'pointer' }}
            >
                Delete Account
            </button>
            {status && <p>{status}</p>}
        </div>
    );
};

export default Profile;

import React, { useState } from 'react';

const CandidateProfile = () => {
  const [profile, setProfile] = useState({
    bio: '',
    experience: '',
    education: ''
  });

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [message, setMessage] = useState('');

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setMessage('✅ Profili u ruajt me sukses!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    setSkills([...skills, newSkill]);
    setNewSkill('');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', color: 'white' }}>
      <h2>👤 Profili i Kandidatit</h2>
      {message && <p style={{ fontWeight: 'bold', color: '#48bb78' }}>{message}</p>}

      <form onSubmit={handleProfileSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Biografia (Bio):</label>
          <textarea 
            value={profile.bio} 
            onChange={(e) => setProfile({...profile, bio: e.target.value})}
            style={{ width: '100%', height: '80px', padding: '8px', backgroundColor: '#2d3748', color: 'white', border: '1px solid #4a5568', borderRadius: '4px' }}
            placeholder="Shkruaj diçka për veten..."
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Eksperienca:</label>
          <input 
            type="text" 
            value={profile.experience} 
            onChange={(e) => setProfile({...profile, experience: e.target.value})}
            style={{ width: '100%', padding: '8px', backgroundColor: '#2d3748', color: 'white', border: '1px solid #4a5568', borderRadius: '4px' }}
            placeholder="P.sh. 2 vite si React Developer"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Edukimi:</label>
          <input 
            type="text" 
            value={profile.education} 
            onChange={(e) => setProfile({...profile, education: e.target.value})}
            style={{ width: '100%', padding: '8px', backgroundColor: '#2d3748', color: 'white', border: '1px solid #4a5568', borderRadius: '4px' }}
            placeholder="P.sh. Fakulteti i Shkencave Kompjuterike"
          />
        </div>

        <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Ruaj Profilin
        </button>
      </form>

      <hr style={{ margin: '30px 0', borderColor: '#4a5568' }} />

      <h3>🛠️ Aftësitë (Skills)</h3>
      <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <input 
          type="text" 
          value={newSkill} 
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Shto një aftësi (p.sh. Cyber Security)" 
          style={{ flex: 1, padding: '8px', backgroundColor: '#2d3748', color: 'white', border: '1px solid #4a5568', borderRadius: '4px' }}
        />
        <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Shto
        </button>
      </form>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {skills.length === 0 ? (
          <p style={{ color: '#a0aec0' }}>Nuk ka aftësi të shtuara ende.</p>
        ) : (
          skills.map((skill, index) => (
            <span key={index} style={{ backgroundColor: '#4a5568', color: 'white', padding: '5px 10px', borderRadius: '15px', fontSize: '14px', border: '1px solid #4a5568' }}>
              {skill}
            </span>
          ))
        )}
      </div>
    </div>
  );
};

export default CandidateProfile;
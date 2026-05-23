import React, { useState } from 'react';

const SavedAndAppliedJobs = () => {
  // 1. Lista e punëve të disponueshme në sistem (Mock Data)
  const availableJobs = [
    { id: 101, title: "React Frontend Developer", company: "TechKosovo", location: "Prishtinë" },
    { id: 102, title: "Node.js Backend Engineer", company: "HireFlow Inc", location: "Remote" },
    { id: 103, title: "Cyber Security Analyst", company: "KosovoSec", location: "Mitrovicë" },
  ];

  // States
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null); 
  const [coverLetter, setCoverLetter] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  //  Ruajtja/Heqja e punës (Saved Jobs)
  const toggleSaveJob = (job) => {
    if (savedJobs.some(j => j.id === job.id)) {
      setSavedJobs(savedJobs.filter(j => j.id !== job.id)); 
    } else {
      setSavedJobs([...savedJobs, job]); 
    }
  };

  // Dorëzimi i Aplikimit
  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!coverLetter.trim()) return;

    const newApplication = {
      id: Date.now(),
      jobTitle: selectedJob.title,
      company: selectedJob.company,
      coverLetter: coverLetter,
      status: "Në Shqyrtim" 
    };

    setAppliedJobs([...appliedJobs, newApplication]);
    setSelectedJob(null);
    setSuccessMessage(`✅ Aplikimi për "${selectedJob.title}" u dërgua me sukses!`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', color: 'white', fontFamily: 'sans-serif' }}>
      
      {successMessage && <p style={{ backgroundColor: '#2f855a', padding: '10px', borderRadius: '4px', fontWeight: 'bold' }}>{successMessage}</p>}

      {/* 💼 SEKSIONI 1: LISTA E PUNËVE TË DISPONUESHME */}
      <h2>💼 Pozitat e lira të Punës</h2>
      <div style={{ display: 'grid', gap: '15px' }}>
        {availableJobs.map(job => {
          const isSaved = savedJobs.some(j => j.id === job.id);
          const isApplied = appliedJobs.some(a => a.jobTitle === job.title);

          return (
            <div key={job.id} style={{ border: '1px solid #4a5568', padding: '15px', borderRadius: '6px', backgroundColor: '#2d3748', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#63b3ed' }}>{job.title}</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e0' }}>{job.company} • {job.location}</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => toggleSaveJob(job)}
                  style={{ padding: '8px 12px', backgroundColor: isSaved ? '#e53e3e' : '#4a5568', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  {isSaved ? '❤️ E Ruajtur' : '💾 Ruaj Punën'}
                </button>
                <button 
                  onClick={() => setSelectedJob(job)}
                  disabled={isApplied}
                  style={{ padding: '8px 12px', backgroundColor: isApplied ? '#718096' : '#3182ce', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  {isApplied ? '🔒 Aplikuar' : '📩 Apliko Tani'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <hr style={{ margin: '40px 0', borderColor: '#4a5568' }} />

      {/* ⭐ SEKSIONI I RI: PUNËT E RUAJTURA (SAVED JOBS) */}
      <h2>❤️ Punët e Ruajtura ({savedJobs.length})</h2>
      {savedJobs.length === 0 ? <p style={{ color: '#a0aec0' }}>Nuk keni asnjë punë të ruajtur.</p> : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {savedJobs.map(job => (
            <div key={job.id} style={{ backgroundColor: '#4a5568', padding: '10px 15px', borderRadius: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>📌 <b>{job.title}</b> - {job.company}</span>
              <button onClick={() => toggleSaveJob(job)} style={{ background: 'none', border: 'none', color: '#fc8181', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
            </div>
          ))}
        </div>
      )}

      <hr style={{ margin: '40px 0', borderColor: '#4a5568' }} />

      
      <h2>📋 Statusi i Aplikimeve Tua (Tracking Status)</h2>
      {appliedJobs.length === 0 ? <p style={{ color: '#a0aec0' }}>Nuk keni aplikuar në asnjë pozitë ende.</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#4a5568', textAlign: 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #718096' }}>Pozita</th>
              <th style={{ padding: '10px', border: '1px solid #718096' }}>Kompania</th>
              <th style={{ padding: '10px', border: '1px solid #718096' }}>Statusi i Aplikimit</th>
            </tr>
          </thead>
          <tbody>
            {appliedJobs.map(app => (
              <tr key={app.id} style={{ backgroundColor: '#2d3748' }}>
                <td style={{ padding: '10px', border: '1px solid #4a5568' }}>{app.jobTitle}</td>
                <td style={{ padding: '10px', border: '1px solid #4a5568' }}>{app.company}</td>
                <td style={{ padding: '10px', border: '1px solid #4a5568', color: '#ecc94b', fontWeight: 'bold' }}>
                  ⏳ {app.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* MODAL / POP-UP */}
      {selectedJob && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#2d3748', padding: '25px', borderRadius: '8px', width: '450px', border: '1px solid #63b3ed' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>Aplikimi për: {selectedJob.title}</h3>
            <form onSubmit={handleApplySubmit}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Letër Motivimi (Cover Letter):</label>
              <textarea 
                required
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Shkruaj diçka..."
                style={{ width: '100%', height: '120px', padding: '10px', backgroundColor: '#1a202c', color: 'white', border: '1px solid #4a5568', borderRadius: '4px', marginBottom: '15px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setSelectedJob(null)} style={{ padding: '8px 15px', backgroundColor: '#718096', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Anulo</button>
                <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#48bb78', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Dërgo</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SavedAndAppliedJobs;
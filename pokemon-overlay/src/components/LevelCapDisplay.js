import React, { useState } from 'react';

const LevelCapDisplay = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const gymLeaders = [
    { gym: 1, level: 14 },
    { gym: 2, level: 22 },
    { gym: 3, level: 26 },
    { gym: 4, level: 32 },
    { gym: 5, level: 37 },
    { gym: 6, level: 41 },
    { gym: 7, level: 44 },
    { gym: 8, level: 50 }
  ];

 /* const gymLeaders = [
    { gym: 1, level: 13 },
    { gym: 2, level: 18 },
    { gym: 3, level: 24 },
    { gym: 4, level: 30 },
    { gym: 5, level: 33 },
    { gym: 6, level: 39 },
    { gym: 7, level: 48 },
    { gym: 8, level: 51 }
  ];*/

  const eliteFour = [
    { name: "Top 4 Herbaro", level: 53 },
    { name: "Top 4 Teresa", level: 55 },
    { name: "Top 4 Ignaz", level: 57},
    { name: "Top 4 Lucian", level: 59 },
    { name: "Champ Cynthia", level: 62 }
  ];

 /* const eliteFour = [
    { name: "Top 4 Shauntal", level: 58 },
    { name: "Top 4 Grimsley", level: 58 },
    { name: "Top 4 Caitlin", level: 58 },
    { name: "Top 4 Marshal", level: 58 },
    { name: "Champ Iris", level: 59 }
  ]; */

  return (
    <div style={styles.container}>
      <div style={styles.header} onClick={() => setIsExpanded(!isExpanded)}>
        <span style={styles.title}>📊 Level Caps</span>
        <span style={styles.toggleIcon}>{isExpanded ? '▼' : '▶'}</span>
      </div>
      
      {isExpanded && (
        <div style={styles.content}>
          {/* Gyms */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Arenaleiter</h4>
            <div style={styles.grid}>
              {gymLeaders.map((gym) => (
                <div key={gym.gym} style={styles.item}>
                  <span style={styles.gymLabel}>Gym {gym.gym}:</span>
                  <span style={styles.levelValue}>Lv. {gym.level}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Elite Four & Champion */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Top 4 & Champion</h4>
            <div style={styles.grid}>
              {eliteFour.map((member, index) => (
                <div key={index} style={styles.item}>
                  <span style={styles.gymLabel}>{member.name}:</span>
                  <span style={styles.levelValue}>Lv. {member.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #e0e0e0',
    overflow: 'hidden'
  },
  header: {
    padding: '12px 16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#45a049'
    }
  },
  title: {
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  toggleIcon: {
    fontSize: '14px'
  },
  content: {
    padding: '16px',
    backgroundColor: 'white'
  },
  section: {
    marginBottom: '16px'
  },
  sectionTitle: {
    margin: '0 0 12px 0',
    color: '#333',
    fontSize: '14px',
    fontWeight: 'bold',
    borderBottom: '2px solid #4CAF50',
    paddingBottom: '4px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '8px'
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    fontSize: '13px'
  },
  gymLabel: {
    color: '#666',
    fontWeight: '500'
  },
  levelValue: {
    color: '#4CAF50',
    fontWeight: 'bold'
  }
};

export default LevelCapDisplay;
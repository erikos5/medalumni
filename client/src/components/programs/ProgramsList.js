import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';

// Mock data - will be replaced with API calls when backend is ready
import { mockSchools } from '../admin/AdminDashboard';

const ProgramsList = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    schoolId: '',
    programType: ''
  });

  useEffect(() => {
    // Loading mock data
    setSchools(mockSchools);
    setLoading(false);

    // When we have the backend ready:
    // const fetchSchools = async () => {
    //   try {
    //     const res = await axios.get('/api/schools');
    //     setSchools(res.data);
    //     setLoading(false);
    //   } catch (err) {
    //     console.error(err);
    //     setLoading(false);
    //   }
    // };
    // fetchSchools();
  }, []);

  const { schoolId, programType } = filter;

  const onChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilter({
      schoolId: '',
      programType: ''
    });
  };

  // Filtering schools and programs
  const filteredSchools = schools.filter(school => {
    if (schoolId && schoolId !== '' && school._id !== schoolId) {
      return false;
    }
    
    if (programType && programType !== '') {
      // Check if the school has programs of the selected type
      return school.programs && 
        school.programs[programType] && 
        school.programs[programType].length > 0;
    }
    
    return true;
  });

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container">
      <h1 className="large text-primary">Study Programs Catalog</h1>
      <p className="lead">
        <i className="fas fa-graduation-cap"></i> All study programs offered by Mediterranean College
      </p>

      <div className="programs-filter bg-light p-2 my-2">
        <h4>Search Filters</h4>
        <div className="form">
          <div className="form-group">
            <select name="schoolId" value={schoolId} onChange={onChange}>
              <option value="">All Schools</option>
              {schools.map(s => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <select name="programType" value={programType} onChange={onChange}>
              <option value="">All Program Types</option>
              <option value="undergraduate">Undergraduate</option>
              <option value="postgraduate">Postgraduate</option>
              <option value="professional">Professional Specialization</option>
            </select>
          </div>
          <button onClick={resetFilters} className="btn btn-light">
            Reset Filters
          </button>
        </div>
      </div>

      <div className="schools-programs">
        {filteredSchools.length > 0 ? (
          filteredSchools.map(school => (
            <div key={school._id} className="school-card bg-light p-2 my-2">
              <h2 className="text-primary">{school.name}</h2>
              <p>{school.description}</p>
              
              {programType === '' && (
                <div className="programs-container">
                  {school.programs.undergraduate && school.programs.undergraduate.length > 0 && (
                    <div className="program-category">
                      <h3>Undergraduate</h3>
                      <ul>
                        {school.programs.undergraduate.map((program, index) => (
                          <li key={index} className="program-item">
                            <i className="fas fa-book"></i> {program}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {school.programs.postgraduate && school.programs.postgraduate.length > 0 && (
                    <div className="program-category">
                      <h3>Postgraduate</h3>
                      <ul>
                        {school.programs.postgraduate.map((program, index) => (
                          <li key={index} className="program-item">
                            <i className="fas fa-book"></i> {program}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {school.programs.professional && school.programs.professional.length > 0 && (
                    <div className="program-category">
                      <h3>Professional Specialization</h3>
                      <ul>
                        {school.programs.professional.map((program, index) => (
                          <li key={index} className="program-item">
                            <i className="fas fa-book"></i> {program}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {programType !== '' && school.programs[programType] && (
                <div className="programs-container">
                  <div className="program-category">
                    <h3>
                      {programType === 'undergraduate' && 'Undergraduate'}
                      {programType === 'postgraduate' && 'Postgraduate'}
                      {programType === 'professional' && 'Professional Specialization'}
                    </h3>
                    <ul>
                      {school.programs[programType].map((program, index) => (
                        <li key={index} className="program-item">
                          <i className="fas fa-book"></i> {program}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              <div className="buttons">
                <Link to={`/profiles?school=${school._id}`} className="btn btn-primary">
                  <i className="fas fa-users"></i> School Alumni
                </Link>
              </div>
            </div>
          ))
        ) : (
          <h4>No programs found based on the selected filters...</h4>
        )}
      </div>
    </div>
  );
};

export default ProgramsList; 
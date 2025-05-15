import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import AlertContext from '../../context/alert/AlertContext';
import Spinner from '../layout/Spinner';
import { mockSchools } from './AdminDashboard';

const SchoolsManagement = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const { user, loading } = authContext;
  const { setAlert } = alertContext;

  const [schools, setSchools] = useState([]);
  const [schoolForm, setSchoolForm] = useState({
    name: '',
    description: '',
    image: '',
    programs: {
      undergraduate: [],
      postgraduate: [],
      professional: []
    }
  });

  const { name, description, image, programs } = schoolForm;
  const [programInput, setProgramInput] = useState({
    undergraduate: '',
    postgraduate: '',
    professional: ''
  });

  const loadSchools = async () => {
    try {
      // For development, load mock data
      setSchools(mockSchools);
      
      // When backend is available:
      // const res = await api.get('/api/schools');
      // setSchools(res.data);
    } catch (err) {
      setAlert('Error loading schools', 'danger');
    }
  };

  useEffect(() => {
    loadSchools();
    // eslint-disable-next-line
  }, []);

  const onChange = e =>
    setSchoolForm({ ...schoolForm, [e.target.name]: e.target.value });

  const onProgramInputChange = e => {
    setProgramInput({
      ...programInput,
      [e.target.name]: e.target.value
    });
  };

  const addProgram = (type) => {
    if (!programInput[type].trim()) return;
    
    setSchoolForm({
      ...schoolForm,
      programs: {
        ...schoolForm.programs,
        [type]: [...schoolForm.programs[type], programInput[type]]
      }
    });
    
    setProgramInput({
      ...programInput,
      [type]: ''
    });
  };

  const removeProgram = (type, index) => {
    const updatedPrograms = [...schoolForm.programs[type]];
    updatedPrograms.splice(index, 1);
    
    setSchoolForm({
      ...schoolForm,
      programs: {
        ...schoolForm.programs,
        [type]: updatedPrograms
      }
    });
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      // For development, just add to local state
      const newSchool = {
        _id: `school${Date.now()}`,
        ...schoolForm
      };
      
      setSchools([...schools, newSchool]);
      setAlert('School added successfully', 'success');
      
      // When backend is available:
      // await api.post('/api/schools', schoolForm);
      // loadSchools();
      
      setSchoolForm({
        name: '',
        description: '',
        image: '',
        programs: {
          undergraduate: [],
          postgraduate: [],
          professional: []
        }
      });
      
      setProgramInput({
        undergraduate: '',
        postgraduate: '',
        professional: ''
      });
    } catch (err) {
      setAlert('Error adding school', 'danger');
    }
  };

  if (loading || !user) {
    return <Spinner />;
  }

  return (
    <div className="container">
      <h1 className="large text-primary">School Management</h1>
      <p className="lead">
        <i className="fas fa-university"></i> Add and edit schools
      </p>

      <div className="dash-buttons">
        <Link to="/admin-dashboard" className="btn">
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </Link>
        <Link to="/admin/pending-profiles" className="btn">
          <i className="fas fa-users"></i> Pending Profiles
        </Link>
      </div>

      <div className="admin-section my-2">
        <div className="schools-container">
          <div className="add-school-form">
            <h3>Add New School</h3>
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="School Name"
                  name="name"
                  value={name}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Description"
                  name="description"
                  value={description}
                  onChange={onChange}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Image URL"
                  name="image"
                  value={image}
                  onChange={onChange}
                />
              </div>
              
              <div className="programs-section">
                <h4>Study Programs</h4>
                
                {/* Undergraduate */}
                <div className="form-group program-form">
                  <label>Undergraduate</label>
                  <div className="program-input-group">
                    <input
                      type="text"
                      placeholder="Program name"
                      name="undergraduate"
                      value={programInput.undergraduate}
                      onChange={onProgramInputChange}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => addProgram('undergraduate')}
                    >
                      Add
                    </button>
                  </div>
                  
                  {programs.undergraduate.length > 0 && (
                    <ul className="program-list">
                      {programs.undergraduate.map((program, idx) => (
                        <li key={idx}>
                          {program}
                          <button
                            type="button"
                            className="btn-sm btn-danger"
                            onClick={() => removeProgram('undergraduate', idx)}
                          >
                            x
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                {/* Postgraduate */}
                <div className="form-group program-form">
                  <label>Postgraduate</label>
                  <div className="program-input-group">
                    <input
                      type="text"
                      placeholder="Program name"
                      name="postgraduate"
                      value={programInput.postgraduate}
                      onChange={onProgramInputChange}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => addProgram('postgraduate')}
                    >
                      Add
                    </button>
                  </div>
                  
                  {programs.postgraduate.length > 0 && (
                    <ul className="program-list">
                      {programs.postgraduate.map((program, idx) => (
                        <li key={idx}>
                          {program}
                          <button
                            type="button"
                            className="btn-sm btn-danger"
                            onClick={() => removeProgram('postgraduate', idx)}
                          >
                            x
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                {/* Professional */}
                <div className="form-group program-form">
                  <label>Professional Development</label>
                  <div className="program-input-group">
                    <input
                      type="text"
                      placeholder="Program name"
                      name="professional"
                      value={programInput.professional}
                      onChange={onProgramInputChange}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => addProgram('professional')}
                    >
                      Add
                    </button>
                  </div>
                  
                  {programs.professional.length > 0 && (
                    <ul className="program-list">
                      {programs.professional.map((program, idx) => (
                        <li key={idx}>
                          {program}
                          <button
                            type="button"
                            className="btn-sm btn-danger"
                            onClick={() => removeProgram('professional', idx)}
                          >
                            x
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              
              <input type="submit" className="btn btn-primary" value="Add School" />
            </form>
          </div>
          <div className="schools-list">
            <h3>Existing Schools</h3>
            {schools.length === 0 ? (
              <p>No schools have been added yet.</p>
            ) : (
              schools.map(school => (
                <div key={school._id} className="school bg-light p-1 my-1">
                  <h4>{school.name}</h4>
                  <p>{school.description}</p>
                  
                  {school.programs && (
                    <div className="programs-container">
                      {school.programs.undergraduate && school.programs.undergraduate.length > 0 && (
                        <div className="program-category">
                          <h5>Undergraduate</h5>
                          <ul>
                            {school.programs.undergraduate.map((program, idx) => (
                              <li key={idx}>{program}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {school.programs.postgraduate && school.programs.postgraduate.length > 0 && (
                        <div className="program-category">
                          <h5>Postgraduate</h5>
                          <ul>
                            {school.programs.postgraduate.map((program, idx) => (
                              <li key={idx}>{program}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {school.programs.professional && school.programs.professional.length > 0 && (
                        <div className="program-category">
                          <h5>Professional Development</h5>
                          <ul>
                            {school.programs.professional.map((program, idx) => (
                              <li key={idx}>{program}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="school-actions">
                    <button className="btn btn-dark">
                      <i className="fas fa-edit"></i> Edit
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolsManagement; 
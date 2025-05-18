import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import AlertContext from '../../context/alert/AlertContext';
import Spinner from '../layout/Spinner';
import api from '../../utils/api';

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
  const [editMode, setEditMode] = useState(false);
  const [currentSchoolId, setCurrentSchoolId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { name, description, image, programs } = schoolForm;
  const [programInput, setProgramInput] = useState({
    undergraduate: '',
    postgraduate: '',
    professional: ''
  });

  const loadSchools = async () => {
    try {
      setIsSubmitting(true);
      // Use real data from the database
      const res = await api.get('/api/schools');
      
      // Transform the data to match the expected structure
      const transformedSchools = res.data.map(school => {
        // If the school doesn't have programs property, create it
        if (!school.programs) {
          school.programs = {
            undergraduate: [],
            postgraduate: [],
            professional: []
          };
        }
        return school;
      });
      
      setSchools(transformedSchools);
      setIsSubmitting(false);
    } catch (err) {
      console.error('Error loading schools:', err);
      setAlert('Error loading schools', 'danger');
      setIsSubmitting(false);
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

  const resetForm = () => {
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
    setEditMode(false);
    setCurrentSchoolId(null);
  };

  const startEditMode = (school) => {
    setEditMode(true);
    setCurrentSchoolId(school._id);
    
    // Set the form values with the current school data
    setSchoolForm({
      name: school.name,
      description: school.description,
      image: school.image || '',
      programs: {
        undergraduate: school.programs?.undergraduate || [],
        postgraduate: school.programs?.postgraduate || [],
        professional: school.programs?.professional || []
      }
    });
    
    // Scroll to the form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleDeleteSchool = async (schoolId) => {
    if (window.confirm('Are you sure you want to delete this school?')) {
      try {
        setIsSubmitting(true);
        await api.delete(`/api/schools/${schoolId}`);
        
        // Update the state by removing the deleted school
        setSchools(schools.filter(school => school._id !== schoolId));
        setAlert('School deleted successfully', 'success');
        setIsSubmitting(false);
      } catch (err) {
        console.error('Error deleting school:', err);
        setAlert('Error deleting school', 'danger');
        setIsSubmitting(false);
      }
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      if (editMode) {
        // Update existing school
        const res = await api.put(`/api/schools/${currentSchoolId}`, schoolForm);
        
        // Update the schools state with the updated school
        setSchools(
          schools.map(school => (school._id === currentSchoolId ? res.data : school))
        );
        
        setAlert('School updated successfully', 'success');
        resetForm();
      } else {
        // Create new school
        const res = await api.post('/api/schools', schoolForm);
        
        // Add the new school to the schools state
        setSchools([...schools, res.data]);
        setAlert('School added successfully', 'success');
        resetForm();
      }
      setIsSubmitting(false);
    } catch (err) {
      console.error('Error saving school:', err);
      setAlert(
        err.response?.data?.msg || 'Error saving school',
        'danger'
      );
      setIsSubmitting(false);
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
            <h3>{editMode ? 'Edit School' : 'Add New School'}</h3>
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
              
              <div className="form-actions">
                <input 
                  type="submit" 
                  className="btn btn-primary" 
                  value={editMode ? 'Update School' : 'Add School'}
                  disabled={isSubmitting} 
                />
                
                {editMode && (
                  <button
                    type="button"
                    className="btn btn-light ml-2"
                    onClick={resetForm}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
          <div className="schools-list">
            <h3>Existing Schools</h3>
            {isSubmitting ? (
              <Spinner />
            ) : schools.length === 0 ? (
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
                    <button 
                      className="btn btn-dark" 
                      onClick={() => startEditMode(school)}
                      disabled={isSubmitting}
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button 
                      className="btn btn-danger ml-2"
                      onClick={() => handleDeleteSchool(school._id)}
                      disabled={isSubmitting}
                    >
                      <i className="fas fa-trash"></i> Delete
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
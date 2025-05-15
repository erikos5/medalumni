import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import AlertContext from '../../context/alert/AlertContext';
import Spinner from '../layout/Spinner';
import './PhotoManagement.css';

// Mock data for albums
const mockAlbums = [
  {
    id: 1,
    title: 'Graduation Ceremony 2023',
    date: '2023-06-25',
    description: 'Photos from the graduation ceremony of the class of 2023',
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
    photos: [
      {
        id: 101,
        url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
        caption: 'Graduation day celebration'
      },
      {
        id: 102,
        url: 'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78',
        caption: 'Graduates throwing caps'
      },
      {
        id: 103,
        url: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b',
        caption: 'Proud graduates with their diplomas'
      },
      {
        id: 104,
        url: 'https://images.unsplash.com/photo-1591987645957-ba96cf01e366',
        caption: 'Speech by the Dean'
      }
    ]
  },
  {
    id: 2,
    title: 'Career Fair 2023',
    date: '2023-04-15',
    description: 'Photos from our annual career fair event',
    coverImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b',
    photos: [
      {
        id: 201,
        url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b',
        caption: 'Company booths at the career fair'
      },
      {
        id: 202,
        url: 'https://images.unsplash.com/photo-1560439514-4e9645039924',
        caption: 'Students networking with employers'
      },
      {
        id: 203,
        url: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0',
        caption: 'Resume review workshop'
      }
    ]
  },
  {
    id: 3,
    title: 'Campus Life',
    date: '2023-05-10',
    description: 'A glimpse into daily life at our campus',
    coverImage: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a',
    photos: [
      {
        id: 301,
        url: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a',
        caption: 'Main campus building'
      },
      {
        id: 302,
        url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f',
        caption: 'Students in the library'
      },
      {
        id: 303,
        url: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0',
        caption: 'Campus garden'
      }
    ]
  }
];

const PhotoManagement = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const { user, loading } = authContext;
  const { setAlert } = alertContext;

  const [albums, setAlbums] = useState([]);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [albumForm, setAlbumForm] = useState({
    title: '',
    description: '',
    coverImage: ''
  });
  const [photoForm, setPhotoForm] = useState({
    url: '',
    caption: ''
  });
  const [showAddAlbumForm, setShowAddAlbumForm] = useState(false);

  useEffect(() => {
    // Simulate loading albums
    setAlbums(mockAlbums);
  }, []);

  const { title, description, coverImage } = albumForm;
  const { url, caption } = photoForm;

  const onAlbumFormChange = e => {
    setAlbumForm({ ...albumForm, [e.target.name]: e.target.value });
  };

  const onPhotoFormChange = e => {
    setPhotoForm({ ...photoForm, [e.target.name]: e.target.value });
  };

  const handleAddAlbum = e => {
    e.preventDefault();
    if (!title || !description) {
      setAlert('Please fill all required fields', 'danger');
      return;
    }

    const newAlbum = {
      id: Date.now(),
      title,
      description,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1508896694512-1eade558679c',
      date: new Date().toISOString().split('T')[0],
      photos: []
    };

    setAlbums([...albums, newAlbum]);
    setAlert('Album added successfully', 'success');
    setAlbumForm({
      title: '',
      description: '',
      coverImage: ''
    });
    setShowAddAlbumForm(false);
  };

  const handleAddPhoto = e => {
    e.preventDefault();
    if (!url) {
      setAlert('Please provide a photo URL', 'danger');
      return;
    }

    if (!currentAlbum) {
      setAlert('Please select an album first', 'danger');
      return;
    }

    const newPhoto = {
      id: Date.now(),
      url,
      caption
    };

    const updatedAlbum = {
      ...currentAlbum,
      photos: [...currentAlbum.photos, newPhoto]
    };

    setAlbums(albums.map(album => 
      album.id === currentAlbum.id ? updatedAlbum : album
    ));
    
    setCurrentAlbum(updatedAlbum);
    setAlert('Photo added successfully', 'success');
    setPhotoForm({
      url: '',
      caption: ''
    });
  };

  const handleDeleteAlbum = albumId => {
    if (window.confirm('Are you sure you want to delete this album?')) {
      setAlbums(albums.filter(album => album.id !== albumId));
      if (currentAlbum && currentAlbum.id === albumId) {
        setCurrentAlbum(null);
      }
      setAlert('Album deleted successfully', 'success');
    }
  };

  const handleDeletePhoto = photoId => {
    if (!currentAlbum) return;

    if (window.confirm('Are you sure you want to delete this photo?')) {
      const updatedPhotos = currentAlbum.photos.filter(photo => photo.id !== photoId);
      const updatedAlbum = { ...currentAlbum, photos: updatedPhotos };
      
      setAlbums(albums.map(album => 
        album.id === currentAlbum.id ? updatedAlbum : album
      ));
      
      setCurrentAlbum(updatedAlbum);
      setAlert('Photo deleted successfully', 'success');
    }
  };

  const handleSelectAlbum = album => {
    setCurrentAlbum(album);
  };

  const formatDate = dateString => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading || !user) {
    return <Spinner />;
  }

  return (
    <div className="container">
      <h1 className="large text-primary">Photo Management</h1>
      <p className="lead">
        <i className="fas fa-images"></i> Add and manage photo albums
      </p>

      <div className="back-button">
        <Link to="/admin-dashboard" className="btn btn-light">
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </Link>
      </div>

      <div className="album-container">
        <div className="albums-section">
          <h2 className="section-title">Albums</h2>
          
          {!showAddAlbumForm ? (
            <div className="add-album-button">
              <button
                className="btn btn-primary"
                onClick={() => setShowAddAlbumForm(true)}
              >
                <i className="fas fa-plus"></i> Add New Album
              </button>
            </div>
          ) : (
            <div className="new-album-form bg-light">
              <h3>Add New Album</h3>
              <form onSubmit={handleAddAlbum}>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Album Title"
                    name="title"
                    value={title}
                    onChange={onAlbumFormChange}
                  />
                </div>
                <div className="form-group">
                  <textarea
                    placeholder="Album Description"
                    name="description"
                    value={description}
                    onChange={onAlbumFormChange}
                  ></textarea>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Cover Image URL (optional)"
                    name="coverImage"
                    value={coverImage}
                    onChange={onAlbumFormChange}
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Create Album
                  </button>
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setShowAddAlbumForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="albums-list">
            {albums.length === 0 ? (
              <p className="no-albums-message">No albums have been created yet.</p>
            ) : (
              albums.map(album => (
                <div 
                  key={album.id} 
                  className={`album-card ${currentAlbum && currentAlbum.id === album.id ? 'album-selected' : ''}`}
                  onClick={() => handleSelectAlbum(album)}
                >
                  <div className="album-card-image">
                    <img src={album.coverImage} alt={album.title} />
                  </div>
                  <div className="album-card-content">
                    <h3>{album.title}</h3>
                    <p className="album-date">{formatDate(album.date)}</p>
                    <p className="album-photos-count">{album.photos.length} photos</p>
                    <button 
                      className="btn btn-danger btn-sm delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAlbum(album.id);
                      }}
                    >
                      <i className="fas fa-trash-alt"></i> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="photos-section">
          {currentAlbum ? (
            <>
              <div className="photos-header">
                <h2 className="section-title">{currentAlbum.title}</h2>
                <p className="photos-description">{currentAlbum.description}</p>
              </div>
              
              <div className="add-photo-form bg-light">
                <h3>Add New Photo</h3>
                <form onSubmit={handleAddPhoto}>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Photo URL"
                      name="url"
                      value={url}
                      onChange={onPhotoFormChange}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Caption (optional)"
                      name="caption"
                      value={caption}
                      onChange={onPhotoFormChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-plus"></i> Add Photo
                  </button>
                </form>
              </div>
              
              <div className="photos-grid">
                {currentAlbum.photos.length === 0 ? (
                  <p className="no-photos-message">No photos in this album yet.</p>
                ) : (
                  currentAlbum.photos.map(photo => (
                    <div key={photo.id} className="photo-card">
                      <div className="photo-card-image">
                        <img src={photo.url} alt={photo.caption || 'Photo'} />
                        <div className="photo-card-actions">
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeletePhoto(photo.id)}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>
                      {photo.caption && (
                        <div className="photo-card-caption">
                          <p>{photo.caption}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="select-album-message">
              <i className="fas fa-info-circle"></i> 
              <p>Please select an album to manage photos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoManagement; 
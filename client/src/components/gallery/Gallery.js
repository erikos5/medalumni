import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Gallery.css';

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
      },
      {
        id: 304,
        url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7',
        caption: 'Science lab'
      },
      {
        id: 305,
        url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
        caption: 'Computer lab'
      }
    ]
  }
];

const Gallery = () => {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Reference to store the handleKeyDown function
  const handleKeyDownRef = useRef(null);

  useEffect(() => {
    // Simulate API call with loading state
    setIsLoading(true);
    setTimeout(() => {
      setAlbums(mockAlbums);
      setIsLoading(false);
    }, 800);
  }, []);

  const openAlbum = (albumId) => {
    const album = albums.find(a => a.id === albumId);
    setSelectedAlbum(album);
  };

  const closeAlbum = () => {
    setSelectedAlbum(null);
  };

  const navigatePhoto = useCallback((direction) => {
    if (!selectedAlbum || !selectedPhoto) return;
    
    const currentIndex = selectedAlbum.photos.findIndex(photo => photo.id === selectedPhoto.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % selectedAlbum.photos.length;
    } else {
      newIndex = (currentIndex - 1 + selectedAlbum.photos.length) % selectedAlbum.photos.length;
    }
    
    setSelectedPhoto(selectedAlbum.photos[newIndex]);
  }, [selectedAlbum, selectedPhoto]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowRight') {
      navigatePhoto('next');
    } else if (e.key === 'ArrowLeft') {
      navigatePhoto('prev');
    } else if (e.key === 'Escape') {
      setPhotoModalOpen(false);
      setSelectedPhoto(null);
    }
  }, [navigatePhoto]);

  // Store the latest handleKeyDown function in a ref
  useEffect(() => {
    handleKeyDownRef.current = handleKeyDown;
  }, [handleKeyDown]);

  // Manage event listeners when modal opens/closes
  useEffect(() => {
    const currentHandleKeyDown = (e) => {
      if (handleKeyDownRef.current) {
        handleKeyDownRef.current(e);
      }
    };

    if (photoModalOpen) {
      document.addEventListener('keydown', currentHandleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', currentHandleKeyDown);
    };
  }, [photoModalOpen]);

  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo);
    setPhotoModalOpen(true);
  };

  const closePhotoModal = useCallback(() => {
    setPhotoModalOpen(false);
    setSelectedPhoto(null);
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatMonthDay = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleString('en-US', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`;
  };

  if (isLoading) {
    return (
      <div className="container loading-container">
        <div className="loading-spinner"></div>
        <p>Loading gallery...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Photo Gallery</h1>
      
      {selectedAlbum ? (
        <div className="album-view">
          <div className="album-header">
            <button className="btn" onClick={closeAlbum}>
              <i className="fas fa-arrow-left"></i> Back to Albums
            </button>
            <h2>{selectedAlbum.title}</h2>
            <p className="lead">
              <i className="fas fa-calendar-alt"></i> {formatDate(selectedAlbum.date)}
            </p>
            <p>{selectedAlbum.description}</p>
          </div>
          
          <div className="photos-grid">
            {selectedAlbum.photos.map(photo => (
              <div 
                key={photo.id} 
                className="photo-card" 
                onClick={() => openPhotoModal(photo)}
              >
                <img src={photo.url} alt={photo.caption} loading="lazy" />
                <div className="photo-overlay">
                  <div className="overlay-icon">
                    <i className="fas fa-search-plus"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="albums-grid">
          {albums.map(album => (
            <div key={album.id} className="album-card">
              <div className="album-cover">
                <img src={album.coverImage} alt={album.title} loading="lazy" />
              </div>
              <div className="album-info">
                <h3>{album.title}</h3>
                <p className="album-date">
                  <i className="fas fa-calendar-alt"></i> {formatMonthDay(album.date)}
                </p>
                <p>{album.description}</p>
                <span className="album-count">
                  <i className="fas fa-images"></i> {album.photos.length} photos
                </span>
              </div>
              <div className="view-album-btn" onClick={() => openAlbum(album.id)}>
                View Album
              </div>
            </div>
          ))}
        </div>
      )}
      
      {photoModalOpen && selectedPhoto && (
        <div className="photo-modal" onClick={closePhotoModal}>
          <div className="photo-modal-content" onClick={e => e.stopPropagation()}>
            <div className="photo-modal-header">
              <button className="close-btn" onClick={closePhotoModal} title="Close (Esc)">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="photo-modal-body">
              <button 
                className="nav-btn prev-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  navigatePhoto('prev');
                }}
                title="Previous (Left Arrow)"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              
              <div className="full-photo">
                <img src={selectedPhoto.url} alt={selectedPhoto.caption} />
                {selectedPhoto.caption && (
                  <div className="photo-caption">{selectedPhoto.caption}</div>
                )}
              </div>
              
              <button 
                className="nav-btn next-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  navigatePhoto('next');
                }}
                title="Next (Right Arrow)"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
            
            <div className="photo-counter">
              {selectedAlbum && 
                `${selectedAlbum.photos.findIndex(p => p.id === selectedPhoto.id) + 1} / ${selectedAlbum.photos.length}`
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery; 
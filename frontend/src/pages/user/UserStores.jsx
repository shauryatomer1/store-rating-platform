import { useState, useEffect } from 'react';
import { userAPI } from '../../api';
import '../../styles/components/RatingModal.css';
const UserStores = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    useEffect(() => {
        fetchStores();
    }, [search]);
    const fetchStores = async () => {
        try {
            const response = await userAPI.getStores({ search, sortBy: 'rating', order: 'desc' });
            setStores(response.data.data.stores);
        } catch (error) {
            console.error('Error fetching stores:', error);
        } finally {
            setLoading(false);
        }
    };
    const openRatingModal = (store, editMode = false) => {
        setSelectedStore(store);
        setIsEditMode(editMode);
        setRating(editMode ? store.userRating : 0);
        setHoverRating(0);
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
        setSelectedStore(null);
        setRating(0);
        setHoverRating(0);
        setIsEditMode(false);
    };
    const handleSubmitRating = async () => {
        if (!rating || rating < 1 || rating > 5) {
            alert('Please select a rating between 1 and 5 stars');
            return;
        }
        setSubmitting(true);
        try {
            if (isEditMode) {
                await userAPI.updateRating(selectedStore.userRatingId, { rating });
            } else {
                await userAPI.submitRating({ storeId: selectedStore.id, rating });
            }
            fetchStores();
            closeModal();
            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 3000);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit rating');
        } finally {
            setSubmitting(false);
        }
    };
    if (loading) return <div className="loading-screen">Loading...</div>;
    return (
        <div>
            <h1>Browse Stores</h1>
            <p className="text-secondary">Find and rate stores on the platform</p>
            <div className="form-group" style={{ maxWidth: '400px', marginTop: '2rem' }}>
                <input
                    type="text"
                    placeholder="Search by name or address..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                {stores.length === 0 ? (
                    <p>No stores found</p>
                ) : (
                    stores.map((store) => (
                        <div key={store.id} className="card">
                            <h3>{store.name}</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{store.address}</p>
                            <div style={{ marginTop: '1rem' }}>
                                <p><strong>Average Rating:</strong> ⭐ {store.averageRating.toFixed(1)} ({store.totalRatings} ratings)</p>
                                {store.userRating ? (
                                    <div>
                                        <p><strong>Your Rating:</strong> ⭐ {store.userRating}</p>
                                        <button
                                            className="btn btn-secondary"
                                            style={{ marginTop: '1rem', width: '100%' }}
                                            onClick={() => openRatingModal(store, true)}
                                        >
                                            ✏️ Edit Rating
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="btn btn-primary"
                                        style={{ marginTop: '1rem', width: '100%' }}
                                        onClick={() => openRatingModal(store, false)}
                                    >
                                        Rate this Store
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
            {}
            {showModal && (
                <div className="rating-modal-overlay" onClick={closeModal}>
                    <div className="rating-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="rating-modal-header">
                            <h2>{isEditMode ? 'Edit Rating' : 'Rate'} {selectedStore?.name}</h2>
                            <button className="close-btn" onClick={closeModal}>✕</button>
                        </div>
                        <div className="rating-modal-body">
                            <p>{isEditMode ? 'Update your rating' : 'How would you rate your experience?'}</p>
                            <div className="star-rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={`star ${star <= (hoverRating || rating) ? 'active' : ''}`}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                            <p className="rating-text">
                                {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select a rating'}
                            </p>
                        </div>
                        <div className="rating-modal-footer">
                            <button className="btn btn-secondary" onClick={closeModal} disabled={submitting}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleSubmitRating}
                                disabled={submitting || !rating}
                            >
                                {submitting ? (isEditMode ? 'Updating...' : 'Submitting...') : (isEditMode ? 'Update Rating' : 'Submit Rating')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {}
            {showSuccessModal && (
                <div className="rating-modal-overlay">
                    <div className="success-modal">
                        <div className="success-icon">✓</div>
                        <h2>{isEditMode ? 'Rating Updated!' : 'Rating Submitted!'}</h2>
                        <p>Thank you for your feedback</p>
                    </div>
                </div>
            )}
        </div>
    );
};
export default UserStores;

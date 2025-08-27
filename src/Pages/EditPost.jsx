// src/Pages/EditPost.js
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage, auth } from "../Components/Firebase";
import Header from "../Components/Header";

const POST_CATEGORIES = [
  "Information",
  "Gadget",
  "Health",
  "Wealth",
  "Uncategorized",
];

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [post, setPost] = useState({
    title: "",
    category: "",
    image: "",
    description: "",
    published_date: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [localImagePreview, setLocalImagePreview] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost(docSnap.data());
        } else {
          console.log("No such document!");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching post: ", error);
        setError("Failed to load post data");
      }
    };

    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      if (user) {
        fetchPost();
      } else {
        navigate("/login");
      }
    });

    return () => {
      if (localImagePreview) {
        URL.revokeObjectURL(localImagePreview);
      }
      unsubscribe();
    };
  }, [id, navigate, localImagePreview]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");

    const localURL = URL.createObjectURL(file);
    setLocalImagePreview(localURL);

    try {
      if (!file.type.match('image.*')) {
        throw new Error("Please select an image file (JPEG, PNG, GIF)");
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size exceeds 5MB limit");
      }

      const storageRef = ref(storage, `posts/${currentUser.uid}/${Date.now()}_${file.name}`);
      const oldImageUrl = post.image;

      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      setPost(prev => ({ ...prev, image: downloadURL }));

      if (oldImageUrl && !oldImageUrl.includes("via.placeholder.com")) {
        try {
          const oldImageRef = ref(storage, oldImageUrl);
          await deleteObject(oldImageRef);
        } catch (deleteError) {
          console.warn("Could not delete old image:", deleteError);
        }
      }

      URL.revokeObjectURL(localURL);
      setLocalImagePreview(null);

    } catch (error) {
      console.error("Upload error:", error);
      setError(error.message);
      URL.revokeObjectURL(localURL);
      setLocalImagePreview(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const postRef = doc(db, "posts", id);

      // FIX: Explicitly specify all fields to update
      await updateDoc(postRef, {
        title: post.title,
        category: post.category,
        image: post.image,
        description: post.description,
        published_date: post.published_date
      });

      setSuccessMessage("Changes saved successfully! Redirecting...");
      setTimeout(() => {
        navigate("/dashboard", { state: { updated: true } });
      }, 2000);
    } catch (error) {
      console.error("Error updating document: ", error);
      setError("Failed to save changes. Please try again.");
      setIsSaving(false);
    }
  };

  return (
    <>
      <Header />

      <section className="dashboard">
        <style>
          {`
            .dashboard {
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 2rem;
              min-height: 100vh;
              color: #fff;
            }
            
            .form-container {
              width: 90%;
              max-width: 800px;
              background: #121212;
              border-radius: 10px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
              padding: 2rem;
              margin-top: 2rem;
              position: relative;
            }
            
            .form-group {
              margin-bottom: 1.5rem;
            }
            
            label {
              display: block;
              margin-bottom: 0.5rem;
              color: #e0e0e0;
              font-weight: 500;
            }
            
            input, textarea, select {
              width: 100%;
              padding: 0.8rem;
              border-radius: 4px;
              border: 1px solid #444;
              background: #2d2d2d;
              color: white;
              font-size: 1rem;
            }

            select {
              appearance: none;
              background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
              background-repeat: no-repeat;
              background-position: right 0.7rem top 50%;
              background-size: 1.2rem;
            }
            
            textarea {
              min-height: 200px;
              resize: vertical;
            }
            
            .btn-group {
              display: flex;
              gap: 1rem;
              margin-top: 1rem;
            }
            
            .btn {
              padding: 0.8rem 1.5rem;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-weight: 500;
              transition: all 0.3s ease;
              font-size: 1rem;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            
            .btn.save {
              background: #4CAF50;
              color: white;
            }
            
            .btn.save:disabled {
              background: #2d6b2f;
              cursor: not-allowed;
              opacity: 0.7;
            }
            
            .btn.cancel {
              background: #f44336;
              color: white;
            }
            
            .btn.upload {
              background: #2196F3;
              color: white;
              margin-top: 0.5rem;
            }
            
            .btn:hover:not(:disabled) {
              opacity: 0.9;
              transform: translateY(-2px);
            }
            
            .spinner {
              border: 2px solid rgba(255, 255, 255, 0.3);
              border-radius: 50%;
              border-top: 2px solid white;
              width: 16px;
              height: 16px;
              animation: spin 1s linear infinite;
              margin-right: 8px;
            }
            
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            
            .image-preview {
              margin-top: 1rem;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            
            .image-preview img {
              max-width: 100%;
              max-height: 300px;
              border-radius: 8px;
              margin-bottom: 1rem;
              border: 2px solid #444;
            }
            
            .error-message {
              color: #f44336;
              margin-top: 0.5rem;
              font-size: 0.9rem;
            }
            
            .success-message {
              color: #4CAF50;
              margin-top: 0.5rem;
              font-size: 0.9rem;
              text-align: center;
            }
            
            .file-input {
              display: none;
            }
            
            .upload-section {
              display: flex;
              flex-direction: column;
              gap: 0.5rem;
            }
          `}
        </style>

        <div className="form-container">
          <h2>Edit Post</h2>
          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={post.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={post.category}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select a category</option>
                {POST_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Published Date</label>
              <input
                type="date"
                name="published_date"
                value={post.published_date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={post.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Image</label>
              <div className="upload-section">
                <button
                  type="button"
                  className="btn upload"
                  onClick={triggerFileInput}
                >
                  Upload New Image
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="file-input"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>

              <div className="image-preview">
                <img
                  src={localImagePreview || post.image || "https://via.placeholder.com/300x200?text=No+Image"}
                  alt="Preview"
                />
              </div>

              {error && <div className="error-message">{error}</div>}
            </div>

            <div className="btn-group">
              <button
                type="submit"
                className="btn save"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="spinner"></span>
                    Saving...
                  </>
                ) : "Save Changes"}
              </button>
              <button
                type="button"
                className="btn cancel"
                onClick={() => navigate("/dashboard")}
                disabled={isSaving}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default EditPost;
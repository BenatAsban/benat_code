import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { deleteDoc, doc, getDocs, collection, updateDoc } from "firebase/firestore";
import { db, auth } from "../Components/Firebase";
import Header from "../Components/Header";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [refresh, ] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Authentication check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoading(true);
      setError(null);
      try {
        if (currentUser) {
          // Optional: Add specific email check
          if (currentUser.email === "benatcode@gmail.com") {
            setUser(currentUser);
          } else {
            throw new Error("Unauthorized access");
          }
        } else {
          throw new Error("Not authenticated");
        }
      } catch (err) {
        setError(err.message);
        signOut(auth);
        navigate("/loginD", { replace: true });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Fetch posts only when authenticated
  useEffect(() => {
    if (!user) return;

    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };

    if (location.state?.updated) {
      fetchPosts();
      navigate(location.pathname, { replace: true, state: {} });
    } else {
      fetchPosts();
    }
  }, [refresh, user, location, navigate]);

  const handleDateChange = async (postId, newDate) => {
    try {
      await updateDoc(doc(db, "posts", postId), {
        published_date: newDate
      });

      setPosts(posts.map(post =>
        post.id === postId ? { ...post, published_date: newDate } : post
      ));
    } catch (error) {
      console.error("Error updating date: ", error);
    }
  };

  const deletePost = async (id) => {
    try {
      await deleteDoc(doc(db, "posts", id));
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/loginD", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#fff',
        background: '#121212'
      }}>
        <div className="spinner"></div>
        <style>
          {`
                        .spinner {
                            width: 40px;
                            height: 40px;
                            border: 4px solid rgba(255,255,255,0.3);
                            border-radius: 50%;
                            border-top: 4px solid #4CAF50;
                            animation: spin 1s linear infinite;
                            margin-right: 15px;
                        }
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}
        </style>
        <p>Verifying credentials...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#fff',
        background: '#121212'
      }}>
        <p>Error: {error}. Redirecting to login...</p>
      </div>
    );
  }

  return (
    <>
      <Header handleLogout={handleLogout} />

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
                            background: #333;
                        }
                        
                        .table-container {
                            width: 90%;
                            max-width: 1200px;
                            overflow-x: auto;
                            background: #1e1e1e;
                            border-radius: 10px;
                            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                            padding: 1.5rem;
                            margin-top: 2rem;
                        }
                        
                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        
                        th {
                            background: #1a1a1a;
                            color: #e0e0e0;
                            padding: 1.2rem;
                            text-align: left;
                            font-weight: 600;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                            border-bottom: 2px solid #333;
                        }
                        
                        td {
                            padding: 1.2rem;
                            border-bottom: 1px solid #333;
                            vertical-align: middle;
                        }
                        
                        tr:last-child td {
                            border-bottom: none;
                        }
                        
                        tr:hover {
                            background: #252525;
                        }
                        
                        .post-thumbnail img {
                            width: 60px;
                            height: 40px;
                            border-radius: 4px;
                            object-fit: cover;
                        }
                        
                        .post-title {
                            max-width: 300px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        
                        .category-tag {
                            display: inline-block;
                            background: #333;
                            color: #fff;
                            padding: 0.3rem 0.8rem;
                            border-radius: 20px;
                            font-size: 0.8rem;
                            text-transform: capitalize;
                        }
                        
                        .action-buttons {
                            display: flex;
                            gap: 0.8rem;
                        }
                        
                        .btn {
                            padding: 0.5rem 1rem;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-weight: 500;
                            transition: all 0.3s ease;
                            font-size: 0.85rem;
                            min-width: 70px;
                            text-align: center;
                        }

                        .btn.create {
                            background: #4CAF50;
                            color: white;
                            margin-bottom: 20px;
                            text-decoration: none;
                            display: inline-block;
                        }
                        
                        .btn.edit {
                            background: #4CAF50;
                            color: white;
                            text-decoration: none;
                        }
                        
                        .btn.view {
                            background: #333;
                            color: white;
                            text-decoration: none;
                        }

                        .btn.delete {
                            background: #f44336;
                            color: white;
                        }
                        
                        .btn:hover {
                            opacity: 0.9;
                            transform: translateY(-2px);
                        }
                        
                        .center-messages {
                            text-align: center;
                            padding: 2rem;
                            color: #888;
                            font-size: 1.2rem;
                        }

                        .center-message {
                          display: none;
                        }

                        .date-input {
                            background: #2d2d2d;
                            color: white;
                            border: 1px solid #444;
                            padding: 0.5rem;
                            border-radius: 4px;
                            font-size: 0.9rem;
                        }


                        .mobile-card {
              display: none;
              background: #252525;
              border-radius: 8px;
              padding: 1rem;
              margin-bottom: 1rem;
            }
            
            .mobile-card-header {
              display: flex;
              align-items: center;
              margin-bottom: 0.8rem;
            }
            
            .mobile-thumbnail {
              width: 50px;
              height: 35px;
              border-radius: 4px;
              object-fit: cover;
              margin-right: 0.8rem;
            }
            
            .mobile-title {
              font-weight: bold;
              flex: 1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            
            .mobile-card-body {
              margin-bottom: 0.8rem;
            }
            
            .mobile-field {
              display: flex;
              margin-bottom: 0.5rem;
            }
            
            .mobile-label {
              font-weight: bold;
              min-width: 100px;
              color: #e0e0e0;
            }
            
            .mobile-value {
              flex: 1;
            }
            
            .mobile-actions {
              display: flex;
              justify-content: space-between;
              gap: 0.5rem;
            }
            
            .mobile-btn {
              flex: 1;
              text-align: center;
              padding: 0.6rem;
            }
            
            /* Media queries */
            @media (max-width: 600px) {
              .dashboard {
                padding: 0.5rem;
              }
              
              .table-container {
                padding: 0.5rem;
              }
              
              table {
                display: none;
              }
              
              .mobile-card {
                display: block;
              }
              
              .btn.create {
                padding: 1rem;
                font-size: 1rem;
              }

              .center-message {
                text-align: center;
                padding: 2rem;
                color: #888;
                font-size: 1.2rem;
              }
            }
                    `}
        </style>

        <div className="table-container">
          <Link to="/create" className="btn create">Create +</Link>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Published Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length > 0 ? (
                posts.map((post, index) => (
                  <tr key={post.id}>
                    <td>{index + 1}</td>
                    <td className="post-thumbnail">
                      <img src={post.image} alt={post.title} />
                    </td>
                    <td className="post-title">{post.title}</td>
                    <td>
                      <span className="category-tag">{post.category}</span>
                    </td>
                    <td>
                      <input
                        type="date"
                        value={post.published_date || ""}
                        onChange={(e) => handleDateChange(post.id, e.target.value)}
                        className="date-input"
                      />
                    </td>
                    <td className="action-buttons">
                      <Link to={`/editpost/${post.id}`} className="btn edit">
                        Update
                      </Link>

                      <Link to={`/posts/${post.id}`} className="btn view">
                        View
                      </Link>

                      <button
                        onClick={() => deletePost(post.id)}
                        className="btn delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="center-messages">
                    Wait..! Your Posts is Loading....
                  </td>
                </tr>
              )}
            </tbody>
          </table>






          {/* Mobile card view */}
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <div className="mobile-card" key={post.id}>
                <div className="mobile-card-header">
                  <img src={post.image} alt={post.title} className="mobile-thumbnail" />
                  <div className="mobile-title">{post.title}</div>
                </div>
                <div className="mobile-card-body">
                  <div className="mobile-field">
                    <span className="mobile-label">ID:</span>
                    <span className="mobile-value">{index + 1}</span>
                  </div>
                  <div className="mobile-field">
                    <span className="mobile-label">Category:</span>
                    <span className="mobile-value">
                      <span className="category-tag">{post.category}</span>
                    </span>
                  </div>
                  <div className="mobile-field">
                    <span className="mobile-label">Date:</span>
                    <span className="mobile-value">
                      <input
                        type="date"
                        value={post.published_date || ""}
                        onChange={(e) => handleDateChange(post.id, e.target.value)}
                        className="date-input"
                      />
                    </span>
                  </div>
                </div>
                <div className="mobile-actions">
                  <Link to={`/editpost/${post.id}`} className="btn edit mobile-btn">
                    Update
                  </Link>
                  <Link to={`/posts/${post.id}`} className="btn view mobile-btn">
                    View
                  </Link>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="btn delete mobile-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="center-message">
              Wait..! Your Posts is Loading....
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Dashboard;
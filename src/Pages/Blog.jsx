import React, { useState, useEffect, useMemo} from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import Category1 from "../Images/avatar1.jpg";
import Category2 from "../Images/avatar2.jpg";
import Category3 from "../Images/avatar3.jpg";
import Category4 from "../Images/avatar4.jpg";
import Category5 from "../Images/avatar5.jpg";
import Logo from "../Images/logo.png";
import { auth } from "../Components/Firebase";
import { db } from '../Components/Firebase';
import { getDocs, collection } from 'firebase/firestore';
import PostAuthor from "../Components/PostAuthor";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { X } from 'lucide-react';

const categoryData = [
  { id: 1, avatar: Category1, name: "Information" },
  { id: 2, avatar: Category2, name: "Gadget" },
  { id: 3, avatar: Category3, name: "Health" },
  { id: 4, avatar: Category4, name: "Wealth" },
  { id: 5, avatar: Category5, name: "Uncategorized" },
];

const Categories = () => {
  const [categories] = useState(categoryData);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postLists, setPostList] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const postCollectionRef = collection(db, "posts");
  const navigate = useNavigate();

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  }

  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postCollectionRef);
      const posts = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setPostList(posts);
      setFilteredPosts(posts); 
    };
    getPosts();
  }, [postCollectionRef]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("authToken");
      localStorage.removeItem("keepLoggedIn");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const filterPostsByCategory = (categoryName) => {
    if (activeCategory === categoryName) {
      setFilteredPosts(postLists);
      setActiveCategory(null);
    } else {
      const filtered = postLists.filter(post =>
        post.category &&
        post.category.trim().toLowerCase() === categoryName.trim().toLowerCase()
      );
      setFilteredPosts(filtered);
      setActiveCategory(categoryName);
    }
  };

  return (
    <div>
      <Outlet />
      <header>
        <nav style={styles.nav}>
          <div className="container nav__container" style={styles.nav__container}>
            <Link to="/privatepage" className="nav__logo">
              <img src={Logo} alt="Navbar Logo" style={styles.navLogo} />
            </Link>
            <ul className="nav__links" style={styles.navLinks}>
              <li>
                <Link to="/privatepage">Dashboard</Link>
              </li>
              <li>
                <Link to="/category">Categories</Link>
              </li>
            </ul>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        </nav>
      </header>

      {/* Categories Section */}
      <section className="categories">
        <style>
          {`
            .categories__container {
              display: flex;
              gap: 20px;
              place-content: center;
            }

            .Category {
              background: #121212;
              padding: 1rem;
              border-radius: var(--radius-3);
              display: inline-block;
              width: 120px;
              height: 40px;
              gap: 1rem;
              transition: all 0.3s ease;
              cursor: pointer;
            }

            .Category.active {
              background: #b19cd9;
            }

            .Category:hover {
              box-shadow: 0 1rem 1.5rem rgba(0, 0, 0, 0.07);
              transform: translateY(-0.3rem);
            }

            .category__avatar {
              width: 5rem;
              min-width: 5rem;
              aspect-ratio: 1/1;
              border-radius: 50%;
              border: 0.2rem solid var(--color-bg);
              overflow: hidden;
            }

            .category__avatar img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .category__info {
              display: flex;
              flex-direction: column;
              justify-content: center;
              position: relative;
              right: 10px;
              bottom: 10px;
            }

            .category__info p {
              margin-top: 0.5rem;
              font-size: 0.5rem;
              position: relative;
              bottom: 5px;
            }

            .post {
              background: #121212;
              box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
              padding: 1rem;
              border-radius: var(--radius-4);
              padding-bottom: 2rem;
              transition: var(--transition);
              cursor: default;
            }

            .post:hover {
              transform: translateY(-0.3rem);
            }

            .post__thumbnail img {
              width: 100%;
              height: 200px;
              object-fit: cover;
            }

            .post__content {
            margin-top: 1.5rem;
            }

            .post__footer {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              margin-top: 2rem;
            }

            .btn.category {
              background: #b19cd9;
              color: white;
              padding: 0.3rem 0.6rem;
              border-radius: 0.3rem;
              font-size: 0.8rem;
            }

            .posts__container {
            display: grid;
            grid-template-columns: repeat(3, 1fr);  // Fixed 3 columns
            gap: 2rem;
            margin-top: 2rem;
          }

            .posts__container {
              grid-template-columns: repeat(2, 1fr);  // Maintain 2 columns
            }
          }
            
            .Category {
              padding: 0.8rem;
              gap: 0.8rem;
            }
            .category__avatar {
              width: 4rem;
              min-width: 4rem;
            }
            .posts__container {
              grid-template-columns: 1fr;  // Single column on mobile
            }       
          }
        `}
        </style>

        {/* Categories Grid */}
        <div className="container categories__container">
          {categories.map(({ id, avatar, name }) => (
            <div
              key={id}
              className={`Category ${activeCategory === name ? 'active' : ''}`}
              onClick={() => filterPostsByCategory(name)}
            >
              <div className="category__info">
                <h4 style={{ fontSize: '0.9rem' }}>{name}</h4>
                <p>Posts: {postLists.filter(post => post.category === name).length}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Posts Section */}
        <Container>
          <div style={{
            padding: "50px 0 0 30px",
            filter: showModal ? 'blur(4px)' : 'none',
            transition: 'filter 0.3s ease',
          }}>
            <article className="posts__container">
              {filteredPosts.map((post) => {
                const shortDescription =
                  post.description.length > 150
                    ? post.description.substr(0, 150) + "..."
                    : post.description;
                const postTitle =
                  post.title.length > 30
                    ? post.title.substr(0, 30) + "..."
                    : post.title;

                return (
                  <div className="post" key={post.id} onClick={() => handlePostClick(post)}>
                    <div className="post__thumbnail">
                      <img
                        src={post.image}
                        className="card-img-top"
                        alt={post.image}
                      />
                    </div>
                    <div className="post__content">
                      <h3 style={{ cursor: "pointer" }}>
                        {postTitle}
                      </h3>
                      <p>
                        {shortDescription.replace(/<p>|<\/p>|<br\s*\/?>/g, '')}
                      </p>
                      <div className="post__footer">
                        <PostAuthor />
                        <div className="btn category">{post.category}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </article>

            {/* Post Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} style={{
              position: 'fixed',
              width: '400px',
              height: '530px',
              background: '#121212',
              margin: 'auto',
              top: '60px',
              bottom: '0',
              left: '0',
              right: '0',
              borderRadius: '1.5rem'
            }}>
              <Modal.Header style={{
                position: 'relative',
                top: '20px',
                left: '20px'
              }}>
                <PostAuthor />
              </Modal.Header>

              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)} style={{
                  background: 'transparent',
                  position: 'relative',
                  left: '350px',
                  bottom: '30px',
                  color: '#fff'
                }}>
                  <X />
                </Button>
              </Modal.Footer>

              <Modal.Title style={{
                fontFamily: 'sans-serif',
                fontSize: '1rem',
                fontWeight: 'bold',
                position: 'relative',
                bottom: '10px',
                left: '20px'
              }}>
                {selectedPost?.title}
              </Modal.Title>

              <Modal.Body>
                {selectedPost?.image && (
                  <img
                    src={selectedPost.image}
                    alt="Post"
                    style={{
                      position: 'fixed',
                      width: '350px',
                      height: '180px',
                      margin: 'auto',
                      top: '0',
                      bottom: '50px',
                      left: '0',
                      right: '0',
                    }} />
                )}
                <div
                  dangerouslySetInnerHTML={{ __html: selectedPost?.description }}
                  style={{
                    position: 'fixed',
                    width: '350px',
                    height: '180px',
                    margin: 'auto',
                    top: '400px',
                    bottom: '50px',
                    left: '0',
                    right: '0',
                    textAlign: 'justify',
                    overflowY: 'scroll',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    '&::-webkit-scrollbar': {
                      display: 'none'
                    }
                  }}
                />
              </Modal.Body>
            </Modal>
          </div>
        </Container>
      </section >
    </div >
  );
};

const styles = {
  nav: {
    backgroundColor: "#121212",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "2200px",
    margin: "0 auto",
  },
  navLogo: {
    display: "block",
    maxWidth: "100%",
    height: "auto",
    position: "relative",
    left: "344px",
  },
  nav__container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "1rem 2rem",
  },
  navLinks: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "2rem",
    position: "relative",
    left: "940px",
  },
  logoutButton: {
    color: "#fff",
    background: "#b19cd9",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    marginLeft: "auto",
    position: "relative",
    right: "13px",
    transition: "background-color 0.3s ease",
    ":hover": {
      backgroundColor: "#b19cd9",
    },
  },
};

export default Categories;
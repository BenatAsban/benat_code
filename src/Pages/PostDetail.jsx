// src/Pages/PostDetail.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Components/Firebase";
import PostAuthor from "../Components/PostAuthor";
import Header from "../Components/Header";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost(docSnap.data());
        } else {
          setError("Post not found");
        }
      } catch (err) {
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Function to clean HTML content
  const cleanHtmlContent = (html) => {
    if (!html) return "No content available";

    // Remove empty paragraphs and line breaks
    return html
      .replace(/<p><br><\/p>/gi, '')  // Remove <p><br></p>
      .replace(/<p[^>]*>\s*<\/p>/gi, '')  // Remove empty paragraphs
      .replace(/<br>\s*<br>/gi, '<br>')  // Reduce consecutive line breaks
      .trim();  // Trim whitespace
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!post) return <div>No post data</div>;

  return (
    <>
      <Header />
      <section className="post-detail">
        <style>
          {`
          // .post-detail {
          //   padding: 4rem 0;
          //   background: #121212;
          //   min-height: 100vh;
          //   color: #fff;
          // }
          
          // .container {
          //   margin: 0 auto;
          // }
          
          // .post-detail__header {
          //   margin-bottom: 2rem;
          // }
          
          // .post-detail__thumbnail {
          //   margin: 2rem 0;
          //   border-radius: 8px;
          //   overflow: hidden;
          //   box-shadow: 0 4px 15px rgba(0,0,0,0.5);
          // }
          
          // .post-detail__thumbnail img {
          //   width: 100%;
          //   max-height: 500px;
          //   object-fit: cover;
          //   display: block;
          // }
          
          .post-content {
            color: #ccc;
            font-size: 1rem;
          }

          .h1{
          font-size: 1rem;
          }
          
          .loading, .error {
            text-align: center;
            padding: 4rem;
            font-size: 1.5rem;
          }
          
          .post-meta {
            display: flex;
            gap: 2rem;
            margin-bottom: 1.5rem;
            color: #aaa;
            font-size: 0.9rem;
          }
          
          .category-badge {
            background: #2196F3;
            color: white;
            height:30px;
            padding: 0.3rem 0.8rem;
            border-radius: 10px;
            font-size: 0.8rem;
            position: relative;
            left: 350px;
          }

          .date{
          position: relative;
          top: 40px;
            left: 228px;
          }

          @media (max-width: 600px) {
                .post-detail {
                background: #121212;
                width:450px;
                padding: 2.5rem 0 1rem 0;
                margin-bottom: -70px;
                }
                }



        `}
        </style>

        <div className="container post-detail__container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <PostAuthor />
            <div>
              <span style={{
                background: '#b19cd9',
                padding: '0.3rem 0.6rem',
                borderRadius: '4px',
                fontSize: '0.9rem'
              }}>
                {post.category}
              </span>
            </div>
          </div>

          <p style={{ color: '#aaa', marginBottom: '1rem' }}>
            Published: {post.published_date}
          </p>

          <h1>{post.title || "Untitled Post"}</h1>

          {post.image && (
            <div className="post-detail__thumbnail">
              <img src={post.image} alt={post.title || "Post thumbnail"} />
            </div>
          )}

          <div
            className="post-content"
            dangerouslySetInnerHTML={{
              __html: cleanHtmlContent(post.description)
            }}
          />
        </div>
      </section>
    </>
  );
};

export default PostDetail;
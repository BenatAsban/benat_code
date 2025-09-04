import React, { useState, useEffect } from "react";
import PostItems from "./PostItems";
import { DUMMY_POSTS } from "../Data.js";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import { motion } from "framer-motion";


const Posts = () => {
  const [posts,] = useState(DUMMY_POSTS);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);


  //light-mode start code

  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const updateTheme = () => {
      setTheme(document.body.classList.contains("dark-mode") ? "dark" : "light");
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();


  }, []);


  //light-mode End code


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 420);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const fadeUpVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };


  const styles = {
    postsContainer: {
      width: isMobile ? "100vw" : "72vw",
      height: isMobile ? "120vw" : "undefined",
      zIndex: 0,
    },
    swiperSlide: {
      backgroundPosition: "center",
      backgroundSize: "cover",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "12px",
      overflow: "hidden",
    },
    swiperSlideActive: {
      transform: "scale(1.05)",
      zIndex: 0,
    },
  };


  return (
    <section style={{ height: isMobile ? "80vh" : "70vh", marginTop: isMobile ? "30px" : undefined }}>
      <motion.div variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible" style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2 style={{
          fontSize: isMobile ? "30px" : undefined,
          fontWeight: 700,
          marginBottom: "16px",
          color: theme === "light" ? "#121212" : "#fff",
        }}>
          Featured Posts
        </h2>

        <p style={{
          color: theme === "light" ? "#121212" : "#fff",
          maxWidth: "42rem",
          margin: "0 auto",
          lineHeight: 1.5,
        }}>
          Hand-picked articles that showcase the best of our content across various categories.
        </p>
      </motion.div>

      <div className="posts">
        {posts.length > 0 ? (
          <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            coverflowEffect={{
              rotate: 30,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            modules={[EffectCoverflow, Autoplay]}
            style={styles.postsContainer}
            spaceBetween={-5}
          >
            {posts.map(({ id, thumbnail, category, title, desc, authorID }) => (
              <SwiperSlide key={id} style={{
                width: isMobile ? '280px' : '350px',
                height: isMobile ? '400px' : '500px',
              }}>
                <PostItems
                  postID={id}
                  thumbnail={thumbnail}
                  category={category}
                  title={title}
                  description={desc}
                  authorID={authorID}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <h2 className="center">No Posts Found</h2>
        )}
      </div>
    </section>
  );
};


export default Posts;
import React from "react";
import PostAuthor from "./PostAuthor";
import { motion } from "framer-motion";

const PostItems = ({
  postID,
  category,
  title,
  description,
  authorID,
  thumbnail,
}) => {
  const shortDescription =
    description.length > 150 ? description.substr(0, 145) + "..." : description;
  const postTitle = title.length > 40 ? title.substr(0, 30) + "..." : title;

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };


  return (
    <motion.article
      className="post"
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible"
    >

      <div className="post__thumbnail">
        <img src={thumbnail} alt={title} />
      </div>
      <div className="post__content">
        <div>
          <h3>{postTitle}</h3>
        </div>
        <p>{shortDescription}</p>
        <div className="post__footer">
          <PostAuthor authorID={authorID} />
          <div className="btn category">{category}</div>
        </div>
      </div>
    </motion.article>
  );
};

export default PostItems;

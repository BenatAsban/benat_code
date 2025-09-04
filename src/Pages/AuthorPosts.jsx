import React, { useState } from "react";
import { DUMMY_POSTS } from "../Data";
import PostItems from "../Components/PostItems";

const AuthorPosts = () => {
  const [posts,] = useState(DUMMY_POSTS);
  return (
    <section className="posts">
      {posts.length > 0 ? (
        <div className="container posts-container">
          {posts.map(({ id, thumbnail, category, title, desc, authorID }) => (
            <PostItems
              key={id}
              postID={id}
              thumbnail={thumbnail}
              category={category}
              title={title}
              description={desc}
              authorID={authorID}
            />
          ))}
        </div>
      ) : (
        <h2 className="center"> No Posts Found</h2>
      )}
    </section>
  );
};

export default AuthorPosts;

import React from "react";
import Avatar from "../Images/logo.png";

const PostAuthor = () => {
  return (
    <div className="post__author">

      <style>{`
       @media (max-width: 600px) {
          .post__author {
          height:10px;
            display: flex;
            align-items: center;
            gap: 8px;
            position: relative;
            bottom:5px;
            width: 100%;
          }
          
          .post__author-avatar img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            object-fit: cover;
          }
          
          .post__author-details {
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          
          .post__author-details h5 {
            font-size: 10px;
            margin: 0;
            line-height: 1.2;
          }
          
          .post__author-details small {
            font-size: 8px;
            opacity: 0.8;
          }
      }

            @media (max-width: 320px) {
            .post__author {
                height: 8px;
                gap: 6px;
                bottom: 3px;
            }
            
            .post__author-avatar img {
                width: 25px;
                height: 25px;
                border-width: 2px;
            }
            
            .post__author-details h5 {
                font-size: 9px;
            }
            
            .post__author-details small {
                font-size: 7px;
            }
        }
    

      
      `}</style>





      <div className="post__author-avatar">
        <img src={Avatar} alt="" />
      </div>
      <div className="post__author-details">
        <h5>By: Benat Code</h5>
        <small>Author</small>
      </div>
    </div>
  );
};

export default PostAuthor;

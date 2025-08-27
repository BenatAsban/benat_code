import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { addDoc, collection } from "firebase/firestore";
import { db, auth, storage } from "../Components/Firebase";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const CreatePost = ({ isAuthenticated }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [description, setDescription] = useState("");
  const [per, setPerc] = useState(null);
  const [file, ] = useState("");
  const [data, setData] = useState({});
  const [image, setImage] = useState(null)

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result)
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }


  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name

      console.log(name)
      const storageRef = ref(storage, file.name);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {

          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          setPerc(progress)
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error)

        },
        () => {

          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, img: downloadURL }))
          });
        }
      );

    }
    file && uploadFile();
  }, [file]);

  console.log(data)


  const postCollectionRef = collection(db, "posts");
  let navigate = useNavigate();

  const createPost = async (e) => {
    e.preventDefault();
    try {
      await addDoc(postCollectionRef, {
        image,
        title,
        category,
        description,
        author: {
          name: auth.currentUser.displayName,
          id: auth.currentUser.uid,
        },
      });
      navigate("/category"); // Moved navigate after successful submission
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const POST_CATEGORIES = [
    "Information",
    "Gadget",
    "Health",
    "Wealth",
    "Uncategorized",
  ];

  return (
    <section className="create-post" style={{ backgroundcolor: "#000" }}>
      <div className="container">
        <h2>Create Post</h2>
        <form className="form create-post__form" onSubmit={createPost}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {POST_CATEGORIES.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <ReactQuill value={description} onChange={setDescription} />
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/png, image/jpg, image/jpeg"
          />
          <button
            disabled={per !== null && per < 100}
            type="submit"
            className="btn"
            style={{
              backgroundColor: (per !== null && per < 100)
                ? "rgba(3, 92, 92, 0.322)"
                : "#b19cd9",
              cursor: (per !== null && per < 100) ? "not-allowed" : "pointer"
            }}
          >Create
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreatePost;

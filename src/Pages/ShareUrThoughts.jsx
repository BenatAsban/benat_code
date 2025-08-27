import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeading, faFolder, faComment } from "@fortawesome/free-solid-svg-icons";

const ShareUrThoughts = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Information',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const serviceId = 'service_nzoy6hf';
    const templateId = 'template_gclb8al';
    const userId = 'D-GzKRfoGtHdyLwLv';

    emailjs.send(serviceId, templateId, formData, userId)
      .then(() => {
        setMessage({ type: 'success', text: 'Thought shared successfully!' });
        setFormData({ title: '', category: 'Information', description: '' });
      })
      .catch((error) => {
        console.error('Email sending failed:', error);
        setMessage({
          type: 'error',
          text: error.text || 'Failed to share. Please try again later.'
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="share-thoughts-container">
      <div className="share-thoughts-card">
        <div className="share-thoughts-header">
          <h2>Share Your Thoughts</h2>
          <p>Tell us what's on your mind</p>
        </div>

        {message && (
          <div className={`message-box ${message.type === 'success' ? 'message-success' : 'message-error'}`}>
            {message.text}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="title">Title</label>
            <div className="input-with-icon">
              <FontAwesomeIcon icon={faHeading} className="input-icon" />
              <input
                type="text"
                id="title"
                className='title'
                placeholder="Enter a title for your thought"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category" className="category">Category</label>
            <div className="input-with-icon">
              <FontAwesomeIcon icon={faFolder} className="input-icon" />
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="Information" className='select-name'>Information</option>
                <option value="Gadget" className='select-name'>Gadget</option>
                <option value="Health" className='select-name'>Health</option>
                <option value="Wealth" className='select-name'>Wealth</option>
                <option value="Uncategorized" className='select-name'>Uncategorized</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="description">Description</label>
            <div className="input-with-icon">
              <FontAwesomeIcon icon={faComment} className="input-icon textarea-icon" />
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                required
                placeholder="Share your thoughts minimum 250 words..."
              />
            </div>
          </div>

          <button
            type="submit"
            className={`login-btn ${isSubmitting ? 'submitting' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Submit Thought'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .share-thoughts-container {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
          margin: 100px auto;
          overflow: hidden;
          max-width: 1200px;
        }
        
        .share-thoughts-card {
          background: #121212;
          border-radius: 20px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
          width: 100%;
          max-width: 550px;
          padding: 40px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .share-thoughts-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .share-thoughts-header h2 {
          color: #e1d9d1;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        
        .share-thoughts-header p {
          color: #7f8c8d;
          font-size: 16px;
        }
        
        .form-group {
          margin-bottom: 25px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #e1d9d1;
          font-weight: 600;
          font-size: 14px;
        }
        
        .input-with-icon {
          position: relative;
        }
        
        .input-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #7f8c8d;
          font-size: 18px;
          z-index: 0;
        }
        
        .textarea-icon {
          top: 22px;
          transform: none;
        }
        
        .input-with-icon input,
        .input-with-icon select,
        .input-with-icon textarea {
          width: 100%;
          padding: 15px 15px 15px 50px;
          border: 2px solid #333;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s ease;
          outline: none;
          background: #1e1e1e;
          color: #e1d9d1;
          font-family: inherit;
        }
        
        .input-with-icon textarea {
          min-height: 150px;
          resize: vertical;
          padding-top: 15px;
        }
        
        .input-with-icon select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237f8c8d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1em;
        }
        
        .input-with-icon input:focus,
        .input-with-icon select:focus,
        .input-with-icon textarea:focus {
          border-color: #b19cd9;
          box-shadow: 0 0 0 3px rgba(177, 156, 217, 0.3);
        }
        
        .login-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #b19cd9 0%, #b19cd9 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
          box-shadow: 0 4px 15px rgba(177, 156, 217, 0.3);
        }
        
        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(177, 156, 217, 0.4);
        }
        
        .login-btn:disabled {
          background: #cccccc;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        .message-box {
          padding: 15px;
          border-radius: 12px;
          margin-bottom: 25px;
          text-align: center;
          font-weight: 500;
          border: 1px solid transparent;
        }
        
        .message-success {
          background: rgba(212, 237, 218, 0.15);
          color: #d4edda;
          border-color: rgba(195, 230, 203, 0.3);
        }
        
        .message-error {
          background: rgba(248, 215, 218, 0.15);
          color: #f8d7da;
          border-color: rgba(245, 198, 203, 0.3);
        }
        
        @media (max-width: 600px) {
          .share-thoughts-card {
            padding: 30px 20px;
          }
          
          .share-thoughts-header h2 {
            font-size: 26px;
          }
        }
      `}</style>
    </div>
  );
};

export default ShareUrThoughts;
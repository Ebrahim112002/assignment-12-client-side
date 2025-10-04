// ErrorPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa', 
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{ 
        fontSize: '8rem', 
        color: '#dc3545', 
        marginBottom: '20px' 
      }}>
        404
      </div>
      <h1 style={{ color: '#333', marginBottom: '10px' }}>Oops! Page Not Found</h1>
      <p style={{ color: '#666', marginBottom: '30px', maxWidth: '500px' }}>
        It seems like the page you're looking for has eloped. Let's get you back on track to finding your perfect match.
      </p>
      <Link 
        to="/" 
        style={{ 
          backgroundColor: '#28a745', 
          color: 'white', 
          padding: '12px 24px', 
          textDecoration: 'none', 
          borderRadius: '5px', 
          fontWeight: 'bold' 
        }}
      >
        Back to LoveMatrimony Home
      </Link>
    </div>
  );
};

export default ErrorPage;
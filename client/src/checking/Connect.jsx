import React from 'react';

function Connect() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/api/v1/users/auth/google";
  };

  return (
    <div>
      <button onClick={handleGoogleLogin}>Connect with Google</button>
    </div>
  );
}

export default Connect;

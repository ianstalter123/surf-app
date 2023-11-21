import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "./firebase";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, onValue } from "firebase/database";

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [usersData, setUsersData] = useState([]);
  const navigate = useNavigate();

  const firebaseConfig = {
    apiKey: "AIzaSyBDNAh5CJBZO5VRrbfpX1e0gOpTd6vahJM",
    authDomain: "surf-app-auth.firebaseapp.com",
    projectId: "surf-app-auth",
    storageBucket: "surf-app-auth.appspot.com",
    messagingSenderId: "696151062124",
    appId: "1:696151062124:web:90643f1bfad5bd670b8a49",
    measurementId: "G-NBJ8CCQLBM",
  };

  const app = initializeApp(firebaseConfig);

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");

    const usersRef = ref(db, 'users');
    onValue(usersRef, (snapshot) => {
      const users = [];
      snapshot.forEach((childSnapshot) => {
        const userData = childSnapshot.val();
        users.push(userData);
      });
      setUsersData(users);
    });
  }, [user, loading, navigate]);

  return (
    <div className="dashboard">
      <div className="dashboard__container">
        <h1>Welcome, {user?.displayName || "User"}!</h1>
        <p>Email: {user?.email}</p>
        <p>UID: {user?.uid}</p>
        {usersData.length > 0 && (
          <>
            <p>Additional Information for All Users:</p>
            <ul>
              {usersData.map((userData) => (
            
                  <li><strong>{userData.name || "Unnamed User"}:</strong></li>
  
                
               
              ))}
            </ul>
          </>
        )}
        <button className="dashboard__btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;

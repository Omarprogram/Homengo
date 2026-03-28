import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar.jsx";
import UserSideBar from "../../components/user/UserSideBar.jsx";
import BookingHistory from "../../components/user/BookingHistory.jsx";
import UserSettings from "../../components/user/UserSettings.jsx";
import '../../assets/styles/UserPage.css';
import { API_BASE_URL } from '../../api.js';

const UserPage = () => {
  const [historyOrSettings, setHistoryOrSettings] = useState('history');
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoadingUser(true);
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("No token found, redirecting to login");
        window.location.href = "/login";
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.success) setUser(data.user);
      else console.error("Failed to fetch user:", data.message);

    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      setLoadingUser(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="userpageContainer">
        <UserSideBar setHistoryOrSettings={setHistoryOrSettings} user={user} />

        <div className="userpageContent">
          {loadingUser ? (
            <p>Loading user info...</p>
          ) : (
            <>
              {historyOrSettings === 'history' && <BookingHistory user={user} />}
              {historyOrSettings === 'settings' && <UserSettings user={user} setUser={setUser} />}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserPage;

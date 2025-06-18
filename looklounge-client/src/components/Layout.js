import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    setCurrentUser(user);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/");
  };

  // ✅ /signup, / (로그인 페이지)일 때는 nav 숨기기
  const hideNav = location.pathname === "/signup" || location.pathname === "/";

  return (
    <>
      {/* 🔽 nav를 조건부 렌더링 */}
      {!hideNav && (
        <nav className="nav">
          <h1 className="nav-logo">
            <Link to="/posts">Look Lounge</Link>
          </h1>

          <div className="nav-links">
            {currentUser ? (
              <>
                <span style={{ marginRight: "1rem", fontWeight: "500" }}>
                  👋 {currentUser}님
                </span>
                <button onClick={handleLogout} className="logout-btn">
                  로그아웃
                </button>
              </>
            ) : (
              <Link to="/">로그아웃</Link>
            )}
          </div>
        </nav>
      )}

      <main>
        <Outlet />
      </main>
    </>
  );
}

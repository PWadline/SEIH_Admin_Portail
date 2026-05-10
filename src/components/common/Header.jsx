import { Sun, Moon, UserCircle } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePopover from "./ProfilePopover";
import seihLogo from "../../assets/Logo_seih.png";

const Header = ({ onToggleSidebar }) => {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [profileVisible, setProfileVisible] = useState(false);
  const [profilePos, setProfilePos] = useState({ top: 0, left: 0 });
  const [profileKey, setProfileKey] = useState(0);
  const profileRef = useRef();
  const profilePopoverRef = useRef();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileVisible &&
        profileRef.current &&
        profilePopoverRef.current &&
        !profileRef.current.contains(event.target) &&
        !profilePopoverRef.current.contains(event.target)
      ) {
        setProfileVisible(false);
        setProfileKey(prev => prev + 1);
      }
    };

    const handleResize = () => {
      if (profileVisible) {
        setProfileVisible(false);
        setProfileKey(prev => prev + 1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [profileVisible]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const toggleProfilePopover = () => {
    const rect = profileRef.current.getBoundingClientRect();
    setProfilePos({ top: rect.bottom + 6, left: rect.right - 288 });
    setProfileVisible((v) => !v);
  };

  return (
    <header className="fixed top-0 left-0 w-full h-[60px] z-50 flex items-center justify-between px-4 dark:bg-white bg-[#1D2635]">
      <div className="flex items-center gap-3 h-full">
        <img
          src={seihLogo}
          alt="SEIH Logo"
          className="w-20 h-20 object-contain"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="p-2 rounded-full dark:text-gray-800 text-white hover:scale-110 hover:bg-white/20 transition-transform duration-200"
          title="Changer le thème"
        >

          {darkMode ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <div
          ref={profileRef}
          onClick={toggleProfilePopover}
          className="p-1 rounded-full border dark:border-gray-300 border-gray-600 cursor-pointer hover:scale-110 transition-transform duration-200"
          title="Profil"
        >
          <UserCircle className="w-8 h-8 text-white dark:text-gray-800" />
        </div>

      </div>

      {profileVisible && (
        <div
          ref={profilePopoverRef}
          className="absolute z-50"
          style={{ top: profilePos.top, left: profilePos.left }}
        >
          <ProfilePopover
            key={profileKey}
            onLogout={handleLogout}
            servicesUrl="http://localhost:5173/"
          />
        </div>
      )}

    </header>
  );
};

export default Header;


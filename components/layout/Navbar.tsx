import React from 'react';
import Icon from '../Icon';

interface NavbarProps {
  userImage?: string;
  onSettingsClick?: () => void;
}

const Navbar: React.FC<{ onSettingsClick?: () => void }> = ({ onSettingsClick }) => {
  const [userName, setUserName] = React.useState("Viajante");
  const [userAvatar, setUserAvatar] = React.useState("");

  React.useEffect(() => {
    const loadData = () => {
      const data = localStorage.getItem('user_birth_data');
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (parsed.full_name) setUserName(parsed.full_name);
          if (parsed.avatar) setUserAvatar(parsed.avatar);
        } catch (e) { }
      }
    };

    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  return (
    <header className="flex items-center justify-between px-6 py-4 z-40 relative w-full max-w-7xl mx-auto">
      {/* Removed User Info per request (Redundant with Sidebar) */}
      <div className="flex items-center gap-3 opacity-0 pointer-events-none">
        {/* Placeholder to keep layout if needed, or just hidden */}
      </div>

    </header>
  );
};

export default Navbar;

// ProfilePopup.jsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectAuth } from '@/store/features/authSlice';
import { getProfilePath } from '@/lib/getProfilePath';
import { FiUser, FiGrid, FiLogOut } from 'react-icons/fi';

function ProfilePopup({ onClose }: any) {
  const { user_type, user } = useSelector(selectAuth);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
    onClose?.();
  };

  const profilePath = getProfilePath(user_type);

  const menuItems = [
    {
      icon: <FiUser className="w-4 h-4" />,
      label: 'View Profile',
      href: profilePath,
      action: null,
    },
    {
      icon: <FiGrid className="w-4 h-4" />,
      label: 'Dashboard',
      href: '/dashboard',
      action: null,
    },
    {
      icon: <FiLogOut className="w-4 h-4" />,
      label: 'Logout',
      href: null,
      action: handleLogout,
      danger: true,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed w-fit z-40 "
        onClick={onClose}
      />

      {/* Popup Menu */}
      <div className="absolute top-16 right-[1%] z-50 w-64 animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm">
          {/* User Info Section */}
          {user && (
            <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {user.name || user.email}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          )}

          {/* Menu Items */}
          <ul className="py-2">
            {menuItems.map((item: any, index: number) => (
              <li
                key={index}
                className="group"
                style={{
                  animation: `slideIn 0.3s ease-out ${index * 0.05}s both`
                }}
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-4 py-2.5 
                      transition-all duration-200 
                      hover:bg-gradient-to-r 
                      ${item.danger
                        ? 'hover:from-red-50 hover:to-red-100 text-red-600'
                        : 'hover:from-blue-50 hover:to-indigo-50 text-gray-700 hover:text-blue-600'
                      }
                      group-hover:translate-x-1
                    `}
                    onClick={onClose}
                  >
                    <span className={`
                      transition-transform duration-200 
                      group-hover:scale-110
                      ${item.danger ? 'text-red-500' : 'text-gray-500 group-hover:text-blue-600'}
                    `}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ) : (
                  <button
                    onClick={item?.action}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2.5 
                      transition-all duration-200 
                      hover:bg-gradient-to-r 
                      ${item.danger
                        ? 'hover:from-red-50 hover:to-red-100 text-red-600'
                        : 'hover:from-blue-50 hover:to-indigo-50 text-gray-700 hover:text-blue-600'
                      }
                      group-hover:translate-x-1
                    `}
                  >
                    <span className={`
                      transition-transform duration-200 
                      group-hover:scale-110
                      ${item.danger ? 'text-red-500' : 'text-gray-500 group-hover:text-blue-600'}
                    `}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}

export default ProfilePopup;









// // ProfilePopup.jsx
// import React from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useDispatch, useSelector } from 'react-redux';
// import { logout, selectAuth } from '@/store/features/authSlice';
// import { getProfilePath } from '@/lib/getProfilePath';

// function ProfilePopup() {
//   const { user_type } = useSelector(selectAuth);
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const handleLogout = () => {
//     dispatch(logout())
//     router.push('/')
//   };

//   const profilePath = getProfilePath(user_type);
//   return (
//     <div className="absolute top-14 right-[1%] z-50 bg-white border rounded shadow-lg w-48">
//       <ul>
//         <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
//           <Link href={profilePath} className="block w-full">View Profile</Link>
//         </li>
//         <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
//           <Link href="/dashboard" className="block w-full">Dashboard</Link>
//         </li>
//         <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//           onClick={handleLogout}
//         >
//           Logout
//         </li>
//       </ul>
//     </div>
//   );
// }

// export default ProfilePopup;

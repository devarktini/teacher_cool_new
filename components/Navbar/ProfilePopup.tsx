// ProfilePopup.jsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/features/authSlice';

function ProfilePopup() {
    const router = useRouter();
    const dispatch = useDispatch();
     const handleLogout = () => {
    dispatch(logout())
    router.push('/login')
  };
  return (
    <div className="absolute top-14 right-[1%] z-50 bg-white border rounded shadow-lg w-48">
      <ul>
        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
          <Link href="/profile" className="block w-full">View Profile</Link>
        </li>
        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
          <Link href="/dashboard" className="block w-full">Dashboard</Link>
        </li>
        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
             onClick={handleLogout}
        >
          Logout
        </li>
      </ul>
    </div>
  );
}

export default ProfilePopup;

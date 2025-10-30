'use client';

import React, { useState } from 'react';
import StudentRegistration from './StudentRegistration';
import TeacherRegistration from './TeacherRegistration';
import CorporateRegistration from './CorporateRegistration';
import UniversityRegistration from './UniversityRegistration';

function Registration({ onclose }: { onclose?: () => void }) {
  const [selectedRole, setSelectedRole] = useState('');

  const roles = [
    {
      id: 'student',
      label: 'Student',
      icon: '👨‍🎓',
      description: 'Learn and grow with our platform',
      color: 'from-blue-500 to-cyan-500',
      lightColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
    },
    {
      id: 'teacher',
      label: 'Teacher',
      icon: '👨‍🏫',
      description: 'Share your knowledge and expertise',
      color: 'from-purple-500 to-pink-500',
      lightColor: 'bg-purple-50',
      borderColor: 'border-purple-300',
    },
    {
      id: 'corporate',
      label: 'Corporate',
      icon: '🏢',
      description: 'Train your workforce efficiently',
      color: 'from-orange-500 to-red-500',
      lightColor: 'bg-orange-50',
      borderColor: 'border-orange-300',
    },
    {
      id: 'university',
      label: 'University',
      icon: '🏫',
      description: 'Manage academic programs',
      color: 'from-green-500 to-emerald-500',
      lightColor: 'bg-green-50',
      borderColor: 'border-green-300',
    },
  ];

  const renderFormComponent = () => {
    switch (selectedRole) {
      case 'student':
        return <StudentRegistration onclose={onclose} />;
      case 'teacher':
        return <TeacherRegistration onclose={onclose}/>;
      case 'corporate':
        return <CorporateRegistration onclose={onclose}/>;
      case 'university':
        return <UniversityRegistration onclose={onclose}/>;
      default:
        return null;
    }
  };

  const currentRole = roles.find((r) => r.id === selectedRole);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onclose}
      ></div>

      {/* Modal - Full Screen on Mobile, Centered on Desktop */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="w-full h-full md:h-auto md:max-h-screen max-w-7xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 animate-modalSlideIn flex flex-col md:flex-row">
          
          {/* Close Button */}
          <button
            onClick={onclose}
            className="absolute top-3 sm:top-6 right-3 sm:right-6 z-20 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors duration-200"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Left Section - Info & Role Selection */}
          <div className="w-full md:w-1/3 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-4 sm:p-6 md:p-8 flex flex-col justify-between relative overflow-hidden order-2 md:order-1">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative z-10 space-y-6">
              {/* Header */}
              <div className="space-y-2 sm:space-y-3">
                <div className="inline-block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-bold text-xs sm:text-sm tracking-widest uppercase">
                  Welcome
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                  Join Us Today
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Choose your role and unlock exclusive resources, opportunities, and a vibrant community.
                </p>
              </div>

              {/* Role Selection */}
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 sm:mb-4">
                  Select Your Role
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-1 gap-2 sm:gap-3">
                  {roles.map((role) => (
                    <label
                      key={role.id}
                      className={`flex items-center p-2 sm:p-4 rounded-lg md:rounded-xl cursor-pointer transition-all duration-200 group ${
                        selectedRole === role.id
                          ? `bg-gradient-to-r ${role.color} shadow-lg md:scale-105`
                          : 'bg-white bg-opacity-5 hover:bg-opacity-10 border border-white border-opacity-10 hover:border-opacity-20'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role.id}
                        checked={selectedRole === role.id}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer accent-white"
                      />
                      <div className="ml-2 sm:ml-3 flex-1">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <span className="text-lg sm:text-xl group-hover:scale-125 transition-transform duration-200">
                            {role.icon}
                          </span>
                          <span className="font-semibold text-xs sm:text-sm">{role.label}</span>
                        </div>
                        {selectedRole === role.id && (
                          <p className="text-xs text-white text-opacity-90 mt-1 hidden sm:block">
                            {role.description}
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 mt-6 pt-4 sm:pt-6 border-t border-white border-opacity-10">
              <p className="text-slate-400 text-xs sm:text-sm">
                Already have an account?{' '}
                <a href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                  Sign in here
                </a>
              </p>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="w-full md:w-2/3 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-4 sm:p-6 md:p-8 lg:p-12 overflow-y-auto max-h-screen md:max-h-none order-1 md:order-2">
            {selectedRole ? (
              <div className="space-y-4 sm:space-y-6 animate-fadeInRight">
                {/* Selected Role Header */}
                <div
                  className={`text-center space-y-2 sm:space-y-4 p-4 sm:p-6 rounded-xl md:rounded-2xl bg-gradient-to-r ${currentRole?.color} bg-opacity-10 border border-opacity-30 ${currentRole?.borderColor}`}
                >
                  <div className="text-4xl sm:text-5xl md:text-6xl drop-shadow-lg">{currentRole?.icon}</div>
                  <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                      {currentRole?.label} Registration
                    </h2>
                    <p className={`text-xs sm:text-sm mt-1 sm:mt-2 bg-gradient-to-r ${currentRole?.color} bg-clip-text text-transparent font-semibold`}>
                      {currentRole?.description}
                    </p>
                  </div>
                </div>

                {/* Form Component - Scrollable on Mobile */}
                <div className="bg-white rounded-xl md:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 max-h-96 md:max-h-none overflow-y-auto md:overflow-visible">
                  {renderFormComponent()}
                </div>
              </div>
            ) : (
              <div className="h-full min-h-96 flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6 py-8 sm:py-12">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <div className="relative text-5xl sm:text-7xl">👋</div>
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome!</h3>
                  <p className="text-gray-600 max-w-xs text-sm sm:text-base">
                    Select a role from the left panel to begin your registration. Each role opens unique opportunities.
                  </p>
                </div>

                {/* Role Preview Cards */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full mt-4 sm:mt-6 px-2 sm:px-0">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-3 sm:p-4 rounded-lg border-2 border-gray-200 hover:border-opacity-100 transition-all duration-200 hover:scale-105 ${role.lightColor}`}
                    >
                      <div className="text-2xl sm:text-3xl mb-1">{role.icon}</div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-700">{role.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-modalSlideIn {
          animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-fadeInRight {
          animation: fadeInRight 0.5s ease-out;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        /* Scrollbar styling for form */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Mobile specific */
        @media (max-width: 768px) {
          .order-1 {
            order: 1;
          }
          .order-2 {
            order: 2;
          }
        }
      `}</style>
    </>
  );
}

export default Registration;

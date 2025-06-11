import React, { useState } from "react";
import NavSidebar from "../Components/NavSidebar";
import ProfileInformationForm from "../Components/UserSettings/ProfileInformationForm";
import UpdatePasswordForm from "../Components/UserSettings/UpdatePasswordForm";
import DeleteAccountForm from "../Components/UserSettings/DeleteAccountForm";
import { FaUser, FaLock, FaTrash, FaShieldAlt } from "react-icons/fa";

export default function UserSettings({ auth, errors }) {
  const [activeSection, setActiveSection] = useState('profile');

  const sections = [
    {
      id: 'profile',
      title: 'Profile Information',
      description: 'Update your account profile information and email address',
      icon: FaUser,
      color: 'text-[var(--color-primary)]'
    },
    {
      id: 'password',
      title: 'Update Password',
      description: 'Ensure your account is using a long, random password to stay secure',
      icon: FaLock,
      color: 'text-[var(--color-warning)]'
    },
    {
      id: 'delete',
      title: 'Delete Account',
      description: 'Permanently delete your account and all associated data',
      icon: FaTrash,
      color: 'text-[var(--color-error)]'
    }
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileInformationForm user={auth.user} errors={errors} />;
      case 'password':
        return <UpdatePasswordForm errors={errors} />;
      case 'delete':
        return <DeleteAccountForm user={auth.user} />;
      default:
        return <ProfileInformationForm user={auth.user} errors={errors} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--color-neutral-dark)] text-[var(--color-neutral-bright)]">
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 lg:gap-8 overflow-x-hidden w-full">
        
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 w-full">
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[3rem] font-extrabold text-[var(--color-neutral-bright)]">
              Account Settings
            </h1>
            <p className="text-sm sm:text-base text-[var(--color-neutral-bright)]/70 mt-2">
              Manage your account settings and preferences
            </p>
          </div>
          <div className="flex items-start">
            <NavSidebar />
          </div>
        </div>

        <div className="bg-[var(--color-neutral-dark-2)] p-4 sm:p-6 rounded-lg border border-[var(--color-neutral-dark-3)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
              <FaUser className="text-[var(--color-neutral-bright)] text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-neutral-bright)]">
                {auth.user.name}
              </h2>
              <p className="text-sm text-[var(--color-neutral-bright)]/70">
                {auth.user.email}
              </p>
            </div>
            <div className="ml-auto">
              <FaShieldAlt className="text-[var(--color-success)] text-lg" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          
          <div className="lg:col-span-1">
            <div className="bg-[var(--color-neutral-dark-2)] rounded-lg p-4">
              <h3 className="text-sm font-medium text-[var(--color-neutral-bright)]/70 mb-4 uppercase tracking-wide">
                Settings
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30'
                          : 'text-[var(--color-neutral-bright)]/80 hover:bg-[var(--color-neutral-dark-3)] hover:text-[var(--color-neutral-bright)]'
                      }`}
                    >
                      <Icon className={`text-lg ${activeSection === section.id ? 'text-[var(--color-primary)]' : section.color}`} />
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {section.title}
                        </div>
                        <div className="text-xs opacity-70 hidden sm:block">
                          {section.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </div>
  );
}
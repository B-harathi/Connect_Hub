import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HiOutlineBell, 
  HiOutlineMoon, 
  HiOutlineSun, 
  HiOutlineDesktopComputer,
  HiOutlineLockClosed,
  HiOutlineTrash,
  HiOutlineLogout
} from 'react-icons/hi';
import { useAuth } from '../../contexts/AuthContext';
import { getStoredTheme, setStoredTheme, applyTheme, getSystemTheme } from '../../utils/helpers';
import Button from '../common/Button';
import { useRef } from 'react';
import api, { usersAPI } from '../../services/api';

const SettingsSection = ({ title, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6">
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      {title}
    </h2>
    {children}
  </div>
);

const ToggleSwitch = ({ enabled, onChange, label, description }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </p>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

const Settings = () => {
  const { user, logout, updateNotificationSettings, updateProfile } = useAuth();
  const [currentTheme, setCurrentTheme] = useState(getStoredTheme());
  const [notifications, setNotifications] = useState({
    email: user?.notificationSettings?.email ?? true,
    push: user?.notificationSettings?.push ?? true,
    sound: user?.notificationSettings?.sound ?? true,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileBio, setProfileBio] = useState(user?.bio || '');
  const [profileAvatar, setProfileAvatar] = useState(user?.avatar || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    // Apply theme on mount based on stored value
    const storedTheme = getStoredTheme();
    setCurrentTheme(storedTheme);
    const appliedTheme = storedTheme === 'system' ? getSystemTheme() : storedTheme;
    applyTheme(appliedTheme);
  }, []);

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
    setStoredTheme(theme);
    
    const appliedTheme = theme === 'system' ? getSystemTheme() : theme;
    applyTheme(appliedTheme);
  };

  const handleNotificationChange = async (type) => {
    const newSettings = {
      ...notifications,
      [type]: !notifications[type]
    };
    
    setNotifications(newSettings);
    
    try {
      await updateNotificationSettings(newSettings);
    } catch (error) {
      // Revert on error
      setNotifications(notifications);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const handleEditProfile = () => {
    setEditProfile(true);
  };

  const handleCancelEdit = () => {
    setEditProfile(false);
    setProfileName(user?.name || '');
    setProfileBio(user?.bio || '');
    setProfileAvatar(user?.avatar || '');
    setAvatarFile(null);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setProfileAvatar(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      // Update name and bio
      await usersAPI.updateProfile({ name: profileName, bio: profileBio });
      // Update avatar if changed
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        await usersAPI.updateAvatar(formData);
      }
      window.location.reload(); // Reload to update context and UI
    } catch (error) {
      // Handle error (toast is shown by api helper)
    } finally {
      setSavingProfile(false);
      setEditProfile(false);
    }
  };

  const themeOptions = [
    {
      value: 'light',
      label: 'Light',
      icon: HiOutlineSun,
      description: 'Light theme'
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: HiOutlineMoon,
      description: 'Dark theme'
    },
    {
      value: 'system',
      label: 'System',
      icon: HiOutlineDesktopComputer,
      description: 'Follow system preference'
    }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Settings
        </h1>

        {/* Profile Edit Section */}
        <SettingsSection title="Profile">
          <div className="flex items-center space-x-6 mb-6">
            <div className="relative">
              <img
                src={profileAvatar || '/default-avatar.png'}
                alt="Avatar"
                className="h-20 w-20 rounded-full object-cover border-2 border-purple-500"
              />
              {editProfile && (
                <button
                  className="absolute bottom-0 right-0 bg-purple-600 text-white rounded-full p-2 hover:bg-purple-700"
                  onClick={() => fileInputRef.current.click()}
                  type="button"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3h3z" />
                  </svg>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div className="flex-1">
              {editProfile ? (
                <>
                  <input
                    type="text"
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    className="block w-full mb-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Your name"
                  />
                  <textarea
                    value={profileBio}
                    onChange={e => setProfileBio(e.target.value)}
                    className="block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Your bio"
                    rows={2}
                  />
                </>
              ) : (
                <>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{user?.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{user?.bio}</div>
                </>
              )}
            </div>
            <div>
              {editProfile ? (
                <>
                  <Button
                    variant="primary"
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                  >
                    {savingProfile ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="ml-2"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={handleEditProfile}>Edit</Button>
              )}
            </div>
          </div>
        </SettingsSection>

        {/* Appearance Settings */}
        <SettingsSection title="Appearance">
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Choose how ConnectHub looks to you
            </p>
            
            <div className="grid grid-cols-1 gap-3">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleThemeChange(option.value)}
                    className={`flex items-center p-3 rounded-lg border-2 transition-colors ${
                      currentTheme === option.value
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3 text-gray-600 dark:text-gray-400" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {option.label}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {option.description}
                      </p>
                    </div>
                    {currentTheme === option.value && (
                      <div className="ml-auto h-2 w-2 bg-purple-500 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </SettingsSection>

        {/* Notification Settings */}
        <SettingsSection title="Notifications">
          <div className="space-y-1">
            <ToggleSwitch
              enabled={notifications.push}
              onChange={() => handleNotificationChange('push')}
              label="Push Notifications"
              description="Receive notifications about new messages and mentions"
            />
            
            <ToggleSwitch
              enabled={notifications.email}
              onChange={() => handleNotificationChange('email')}
              label="Email Notifications"
              description="Receive email summaries of your activity"
            />
            
            <ToggleSwitch
              enabled={notifications.sound}
              onChange={() => handleNotificationChange('sound')}
              label="Sound Effects"
              description="Play sounds for notifications and actions"
            />
          </div>
        </SettingsSection>

        {/* Privacy & Security */}
        <SettingsSection title="Privacy & Security">
          <div className="space-y-4">
            <Button
              variant="outline"
              icon={<HiOutlineLockClosed />}
              className="w-full justify-start"
            >
              Change Password
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start"
            >
              Download Your Data
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start"
            >
              Blocked Users
            </Button>
          </div>
        </SettingsSection>

        {/* Account Actions */}
        <SettingsSection title="Account">
          <div className="space-y-4">
            <Button
              variant="outline"
              icon={<HiOutlineLogout />}
              onClick={handleLogout}
              className="w-full justify-start"
            >
              Sign Out
            </Button>
            
            <Button
              variant="outline"
              icon={<HiOutlineTrash />}
              onClick={handleDeleteAccount}
              className="w-full justify-start text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20"
            >
              Delete Account
            </Button>
          </div>
        </SettingsSection>

        {/* App Info */}
        <SettingsSection title="About">
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Version</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Build</span>
              <span>2024.1.0</span>
            </div>
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <p>
                Made with ❤️ by the ConnectHub team
              </p>
            </div>
          </div>
        </SettingsSection>
      </motion.div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mr-3">
                <HiOutlineTrash className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Account
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete your account? This action cannot be undone 
              and all your data will be permanently removed.
            </p>
            
            <div className="flex space-x-3">
              <Button
                variant="danger"
                className="flex-1"
                onClick={() => {
                  // TODO: Implement delete account
                  setShowDeleteConfirm(false);
                }}
              >
                Delete Account
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Settings;
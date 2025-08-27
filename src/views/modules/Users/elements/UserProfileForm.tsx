import React, { useState } from 'react';
import { Tabs } from 'antd';
import BasicProfile from './BasicProfile';
import ChangePassword from './ChangePassword';
import UserPreference from './UserPreference';

interface UserProfileProps {
  userDetails?: any;
  userID?: string;
  isProfile?: boolean;
  isAdd?: boolean;
  isEdit?: boolean;
  btnLoading?: boolean;
  handleAddUser?: (params) => void;
  handleEditUser?: (paramsID, params) => void;
}

const UserProfileForm: React.FC<UserProfileProps> = ({
  userDetails,
  userID,
  isProfile,
  isAdd,
  isEdit,
  handleAddUser,
  handleEditUser,
  btnLoading,
}) => {
  const [loadTab, setLoadTab] = useState<string>('userProfile');

  const tabItems = [
    {
      key: 'userProfile',
      label: 'User Profile',
      children: (
        <BasicProfile
          userData={userDetails}
          userID={userID}
          isAdd={isAdd}
          isProfile={isProfile}
          handleAddUser={handleAddUser}
          handleEditUser={handleEditUser}
          btnLoading={btnLoading}
        />
      ),
    },
    !isAdd && {
      key: 'changePassword',
      label: 'Change Password',
      children: <ChangePassword userID={userID} />,
    },
    !isAdd && {
      key: 'userPreference',
      label: 'User Preference',
      children: (
        <UserPreference
          activeTab={loadTab}
          userID={userID}
          isProfile={isProfile}
          isEdit={isEdit}
        />
      ),
    },
  ].filter(Boolean); // Remove false/null items

  return (
    <Tabs
      defaultActiveKey="1"
      items={tabItems}
      onTabClick={(val) => {
        setLoadTab(val);
      }}
    />
  );
};

export default UserProfileForm;

import React, { useState } from 'react';

import UserProfileForm from '../elements/UserProfileForm';
import { Drawer } from 'antd';
import { AppDispatch } from '@/store/app';
import { useDispatch } from 'react-redux';
import { editNewUser } from '../utils/usersSlice';
import { CONSTANT } from '@/config/Constant';

interface userProps {
  userDetails?: any;
  openUserProfile?: boolean;
  handleUserProfileDrawer?: () => void;
  handleUsersList?: (params) => void;
}

const EditUserDetails: React.FC<userProps> = (props) => {
  const {
    openUserProfile,
    userDetails,
    handleUserProfileDrawer,
    handleUsersList,
  } = props;
  const dispatch: AppDispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(false);

  const handleClose = () => {
    handleUserProfileDrawer();
  };

  const handleEditUser = async (userId: string, data: any) => {
    setLoading(true);

    await dispatch(editNewUser(userId, data))
      .then(() => {
        const listingPayload = {
          current: CONSTANT.DEFAULT_PAGE_NUMBER,
          pageSize: CONSTANT.DEFAULT_PAGE_SIZE,
        };
        handleUsersList(listingPayload);
        handleClose();
      })
      .catch((error) => {
        console.warn('Error: ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Drawer
        title={`Edit User - ${userDetails?.fullName ?? ''}`}
        open={openUserProfile}
        width={900}
        onClose={handleClose}
      >
        <UserProfileForm
          userDetails={userDetails}
          userID={userDetails?.userId}
          isProfile={false}
          isAdd={false}
          isEdit={true}
          handleEditUser={handleEditUser}
          btnLoading={loading}
        />
      </Drawer>
    </>
  );
};
export default EditUserDetails;

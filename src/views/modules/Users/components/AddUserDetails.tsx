import React, { useState } from 'react';

import UserProfileForm from '../elements/UserProfileForm';
import { Drawer } from 'antd';
import { AppDispatch } from '@/store/app';
import { useDispatch } from 'react-redux';
import { addNewUser } from '../utils/usersSlice';
import { CONSTANT } from '@/config/Constant';

interface userProps {
  openNewUserProfile?: boolean;
  handleNewUserProfileDrawer?: () => void;
  handleUsersList?: (params) => void;
}

const AddUserDetails: React.FC<userProps> = (props) => {
  const { openNewUserProfile, handleNewUserProfileDrawer, handleUsersList } =
    props;
  const dispatch: AppDispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(false);

  const handleClose = () => {
    handleNewUserProfileDrawer();
  };

  const handleAddUser = async (data: any) => {
    setLoading(true);
    await dispatch(addNewUser(data))
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
        title={`Add New User`}
        open={openNewUserProfile}
        width={900}
        onClose={handleClose}
        destroyOnHidden={true}
      >
        <UserProfileForm
          isProfile={false}
          isAdd={true}
          handleAddUser={handleAddUser}
          btnLoading={loading}
        />
      </Drawer>
    </>
  );
};
export default AddUserDetails;

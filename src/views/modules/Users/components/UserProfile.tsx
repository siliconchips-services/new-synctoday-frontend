import React, { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { UserProfileBreadcrumb } from '@/config/BreadcrumbConfig';
import { Card, message } from 'antd';
import UserProfileForm from '../elements/UserProfileForm';
import PageSpinner from '@/components/PageSpinner/PageSpinner';
import { AppDispatch } from '@/store/app';
import { useDispatch } from 'react-redux';
import { editNewUser, getUserPreference } from '../utils/usersSlice';
import { decodeToken } from '../../Auth/utils/AuthSlice';
import { useNavigate } from 'react-router-dom';
import RestrictedAccessPage from '@/views/errors/RestrictedAccessPage';
import { getCookie, setCookie } from '@/utils/cookie';

const UserProfile: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const [userID, setUserID] = useState<string>('');
  const [userDetails, setUserDetails] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  const getUserDetails = async () => {
    const token = getCookie('token');
    const getUserDetails = decodeToken(token);

    setLoading(true);
    dispatch(
      getUserPreference(getUserDetails?.UserId, getUserDetails?.TenantId),
    )
      .then((returnDetails: any) => {
        // returnDetails?.res &&
        setCookie('userPreference', JSON.stringify(returnDetails?.res || {}), {
          expires: returnDetails?.expiresDate,
        });
        setUserID(getUserDetails?.UserId);
        const userData = getCookie('userDetails');
        const userDataParsed = userData && JSON.parse(userData);
        if (userDataParsed) {
          setUserDetails(userDataParsed);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.warn('Error: ', error);
        setUserDetails({});
        setLoading(false);
      });
  };
  useEffect(() => {
    getUserDetails();
  }, [navigate]);

  const handleEditUser = async (userId: string, data: any) => {
    setLoading(true);

    await dispatch(editNewUser(userId, data))
      .then(() => {
        message.success('Profile updated successfully.');
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
      <PageHeader
        breadcrumbs={UserProfileBreadcrumb}
        title={UserProfileBreadcrumb.title}
      />
      <Card className="mainContent box">
        {!loading ? (
          userDetails?.UserId ? (
            <UserProfileForm
              userID={userID}
              userDetails={userDetails}
              isProfile={true}
              handleEditUser={handleEditUser}
              btnLoading={loading}
            />
          ) : (
            <RestrictedAccessPage />
          )
        ) : (
          <PageSpinner card={true} />
        )}
      </Card>
    </>
  );
};
export default UserProfile;

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Popover, message } from 'antd';
import InitialsAvatar from '@/components/InitialsAvatar';
import SVGIcon from '@/components/SVGIcon';
import {
  // getUserProfileImage,
  removeToken,
} from '@/views/modules/Auth/utils/AuthSlice';
import path from '@/config/path';
import { binaryToBase64 } from '@/config/global';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/app';
import { getCookie } from '@/utils/cookie';

interface ProfileDropDownProps {
  userId: string;
}

const ProfileDropDown: React.FC<ProfileDropDownProps> = () => {
  // const dispatch: AppDispatch = useDispatch();
  const popoverRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const userFullName = getCookie('userFullName');
  const userID = getCookie('userID');
  const [userNameState, setUserNameState] = useState<string>('');
  const [openPopover, setOpenPopover] = useState<boolean>(false);
  const [avatarImg, setAvatarImg] = useState<string>('');

  const userImg = useSelector((state: RootState) => state.AUTH.userImg);

  const getUserImage = async (userImage: ArrayBuffer | null) => {
    try {
      if (userImage) {
        const base64Image = binaryToBase64(userImage, 'image/png');
        setAvatarImg(base64Image);
      } else {
        setAvatarImg('');
      }
    } catch (error) {
      console.error('Error fetching user profile image:', error);
      setAvatarImg('');
    }
  };

  useEffect(() => {
    getUserImage(userImg);
  }, [userImg]);

  useEffect(() => {
    setUserNameState(userFullName || '');
  }, [navigate]);

  const greeting = (
    <div className="profileDropdown" ref={popoverRef}>
      <div className="greeting">
        <div className="avatar">
          {avatarImg ? (
            <img
              src={avatarImg}
              alt="User Avatar"
              style={{ width: '90px', height: '90px', borderRadius: '50%' }}
            />
          ) : (
            <InitialsAvatar name={userNameState} size={90} />
          )}
        </div>
        <strong className="name">
          Hi, {userNameState ? userNameState : 'Guest'}!
          <div>
            <small>
              ID: <strong>{userID}</strong>
            </small>
          </div>
        </strong>
      </div>
      <ul className="menu">
        <li
          onClick={() => {
            navigate(path.users.profile);
            handleOpenPopover();
          }}
        >
          <span>
            <SVGIcon name="idCard" /> <strong>Profile Settings</strong>
          </span>
        </li>
        <li
          onClick={() => {
            removeToken();
            navigate('/');
            message.success('Logout Successfully.');
            handleOpenPopover();
          }}
        >
          <span>
            <SVGIcon name="logout" /> <strong>Log Out</strong>
          </span>
        </li>
      </ul>
    </div>
  );

  const handleOpenPopover = () => {
    setOpenPopover(!openPopover);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setOpenPopover(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenPopover(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  return (
    <Popover
      content={greeting}
      trigger="hover"
      placement="bottomRight"
      arrow
      open={openPopover}
      classNames={{
        root: 'userMenuList',
      }}
    >
      {avatarImg ? (
        <img
          src={avatarImg}
          alt="User Avatar"
          style={{
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            cursor: 'pointer',
          }}
          onClick={handleOpenPopover}
        />
      ) : (
        <div>
          <InitialsAvatar
            name={userNameState}
            size={35}
            onClick={handleOpenPopover}
          />
        </div>
      )}
    </Popover>
  );
};

export default ProfileDropDown;

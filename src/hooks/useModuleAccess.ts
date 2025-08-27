import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { appLogin } from '@/views/modules/Auth/utils/AuthSlice';

import { AppDispatch } from '@/store/app';
import { getTokenNameForBaseURL } from '@/utils/tokenResolver';
import { setCookie } from '@/utils/cookie';

export const useModuleAccess = (serviceID: string) => {
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [access, setAccess] = useState(false);

  const handleApiServiceToken = useCallback(async () => {
    setIsLoading(true);
    setAccess(false);
    await dispatch(appLogin(serviceID))
      .then((loginResponse: any) => {
        const tokenName = getTokenNameForBaseURL(serviceID);

        setCookie(tokenName, loginResponse?.res?.token, {
          expires: loginResponse?.expiresDate,
        });
        setAccess(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [dispatch, serviceID]);

  useEffect(() => {
    handleApiServiceToken();
  }, [handleApiServiceToken]);

  return { isLoading, access };
};

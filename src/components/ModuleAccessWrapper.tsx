// components/ModuleAccessWrapper.tsx
import { ReactNode } from 'react';
import { useModuleAccess } from '@/hooks/useModuleAccess';
import { Card } from 'antd';
import RestrictedAccessPage from '@/views/errors/RestrictedAccessPage';
import PageSpinner from './PageSpinner/PageSpinner';

interface ModuleAccessWrapperProps {
  serviceID: string;
  children: ReactNode;
}

const ModuleAccessWrapper = ({
  serviceID,
  children,
}: ModuleAccessWrapperProps) => {
  const { isLoading, access } = useModuleAccess(serviceID);

  if (isLoading) {
    return <PageSpinner card={false} />;
  }

  if (!access) {
    return <RestrictedAccessPage />;
  }

  return <Card className="mainContent box">{children}</Card>;
};

export default ModuleAccessWrapper;

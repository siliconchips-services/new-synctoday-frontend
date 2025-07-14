import React from 'react';
import Breadcrumbs from './components/Breadcrumbs';
import { BreadcrumbConfigProps } from '../../config/InterfacesAndTypes';
import { Col, Flex, Row, Typography } from 'antd';

interface PageHeaderProps {
  breadcrumbs?: BreadcrumbConfigProps;
  children?: any;
  title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  breadcrumbs,
  title,
  children,
}) => {
  const { Title } = Typography;

  return (
    <>
      {breadcrumbs && (
        <div className="breadcrumbs" key={111}>
          <Breadcrumbs items={breadcrumbs?.path} />
        </div>
      )}
      <div className="mainPageHeader" key={112}>
        <Row gutter={[20, 20]} justify={'space-between'} align={'middle'}>
          <Col xs={24} md={12}>
            <Title className="title" key={113}>
              {title}
            </Title>
          </Col>
          {children && (
            <Col xs={24} md={12}>
              <Flex justify={'flex-end'} align={'center'}>
                <div className="btnWrap" key={114}>
                  {children}
                </div>
              </Flex>
            </Col>
          )}
        </Row>
      </div>
    </>
  );
};

export default PageHeader;

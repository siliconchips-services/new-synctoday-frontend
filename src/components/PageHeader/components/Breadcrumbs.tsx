import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import type { BreadcrumbProps } from 'antd';

type BreadcrumbComponentItemTypes = {
  name: React.ReactNode;
  link?: string;
};

interface BreadcrumbsProps {
  items: BreadcrumbComponentItemTypes[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const breadcrumbItems: BreadcrumbProps['items'] = items.map((item, index) => {
    const isLast = index === items.length - 1;

    return {
      title:
        !isLast && item.link ? (
          <Link to={item.link}>{item.name}</Link>
        ) : (
          item.name
        ),
    };
  });

  return <Breadcrumb items={breadcrumbItems} />;
};

export default Breadcrumbs;

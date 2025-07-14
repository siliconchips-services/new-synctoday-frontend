import { CONSTANT } from '@/config/Constant';
import { Descriptions, type DescriptionsProps } from 'antd';

interface DescriptionItemProps {
  title: string;
  content?: React.ReactNode;
}

export const DescriptionItem: React.FC<DescriptionItemProps> = ({
  title,
  content,
}) => {
  // return (
  //   <div className="site-description-item-profile-wrapper">
  //     <p className="site-description-item-profile-p-label">{title}:</p>
  //     {content && content !== '' ? content : CONSTANT.NO_DATA_FOUND}
  //   </div>
  // );
  const items: DescriptionsProps['items'] = [
    {
      key: title,
      label: title,
      children: content && content !== '' ? content : CONSTANT.NO_DATA_FOUND,
    },
  ];

  return (
    <Descriptions
      layout="horizontal"
      items={items}
      className="descriptionsList"
    />
  );
};

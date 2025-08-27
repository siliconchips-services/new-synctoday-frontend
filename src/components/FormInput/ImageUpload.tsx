import React, { useState } from 'react';
import ImgCrop from 'antd-img-crop';
import { Upload, message, Form, Skeleton } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface ImageUploadProps {
  value?: any;
  onChange?: (file: any) => void;
  name: string;
  label?: string;
  fileType: 'image' | 'document';
  fileSizeLimitMB: number;
  validationMessage?: string;
  imageRatio?: number;
  loading?: boolean;
  required?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  name,
  label,
  value,
  onChange,
  fileType,
  fileSizeLimitMB,
  validationMessage,
  // imageRatio,
  loading,
  required,
  ...rest
}) => {
  const [fileList, setFileList] = useState(value ? [value] : []);

  const beforeUpload = (file: File) => {
    const isImage = fileType === 'image';
    // const isDoc = fileType === 'document';

    const allowedImageTypes = ['image/jpeg', 'image/png'];
    const allowedDocTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ];

    const isValidType = isImage
      ? allowedImageTypes.includes(file.type)
      : allowedDocTypes.includes(file.type);

    const isValidSize = file.size / 1024 / 1024 < fileSizeLimitMB;

    if (!isValidType || !isValidSize) {
      message.error(validationMessage);
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    onChange?.(newFileList[0]); // emit only one image
  };

  return (
    <Form.Item
      name={name}
      label={label}
      rules={[{ required, message: validationMessage }]}
    >
      {loading ? (
        <Skeleton.Input active />
      ) : (
        <ImgCrop rotationSlider>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleChange}
            beforeUpload={beforeUpload}
            onRemove={() => onChange?.(null)}
            maxCount={1}
            {...rest}
          >
            {fileList.length >= 1 ? null : <PlusOutlined />}
          </Upload>
        </ImgCrop>
      )}
    </Form.Item>
  );
};

export default ImageUpload;

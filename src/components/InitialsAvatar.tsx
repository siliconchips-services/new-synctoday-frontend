import React from 'react';

interface InitialsAvatarProps {
  name: string;
  size?: number;
  textColor?: string;
  fontSize?: number;
  shape?: 'circle' | 'square';
  onClick?: () => void;
}

const getInitials = (name: string): string => {
  const words = name.trim().split(' ');
  const initials =
    words.length >= 2 ? words[0][0] + words[1][0] : name.substring(0, 2);
  return initials && initials?.toUpperCase();
};

// 26 consistent colours for A-Z
const colorPalette = [
  '#F44336',
  '#E91E63',
  '#9C27B0',
  '#673AB7',
  '#3F51B5',
  '#2196F3',
  '#03A9F4',
  '#00BCD4',
  '#009688',
  '#4CAF50',
  '#8BC34A',
  '#CDDC39',
  '#FFEB3B',
  '#FFC107',
  '#FF9800',
  '#FF5722',
  '#795548',
  '#9E9E9E',
  '#607D8B',
  '#1ABC9C',
  '#2ECC71',
  '#3498DB',
  '#9B59B6',
  '#E67E22',
  '#E74C3C',
  '#34495E',
];

const getBackgroundColor = (name: string): string => {
  const firstChar = name && name?.trim()?.[0]?.toUpperCase();
  const index = firstChar.charCodeAt(0) - 65; // A = 65
  return colorPalette[index % 26] || '#243DDA'; // fallback color
};

const InitialsAvatar: React.FC<InitialsAvatarProps> = ({
  name,
  size = 40,
  textColor = '#fff',
  fontSize,
  shape = 'circle',
  onClick,
}) => {
  const initials = getInitials(name);
  const backgroundColor = getBackgroundColor(name);

  const avatarStyle: React.CSSProperties = {
    width: size,
    height: size,
    backgroundColor,
    color: textColor,
    fontSize: fontSize || size * 0.4,
    borderRadius: shape === 'circle' ? '50%' : '15px',
  };

  return (
    <div style={avatarStyle} className="initialsAvatar" onClick={onClick}>
      {initials}
    </div>
  );
};

export default InitialsAvatar;

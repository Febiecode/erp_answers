import Image from 'next/image';
import React from 'react';

interface ProfileWithStatusProps {
    imageUrl: string; // Change the type to string
    online: boolean; // Assuming online status is a boolean
  }

const ProfileWithStatus: React.FC<ProfileWithStatusProps> = ({ imageUrl, online }) => {
    return (
      <div className="relative inline-block ">
        <Image src={imageUrl} alt="Profile" className="w-10 h-10 rounded-full"/>
        {online && (
          <span className="absolute bottom-0 right-0 w-4 h-4 border-2 border-white bg-green-500 rounded-full"></span>
        )}
      </div>
    );
  };

export default ProfileWithStatus;

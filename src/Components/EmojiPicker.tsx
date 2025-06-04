'use client';

import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

interface EmojiPickerComponentProps {
  onEmojiClick: (emoji: string) => void;
}

const EmojiPickerComponent: React.FC<EmojiPickerComponentProps> = ({ onEmojiClick }) => {
  return (
    <EmojiPicker className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
      onEmojiClick={(emojiData) => {
        onEmojiClick(emojiData.emoji);
      }}
    />
  );
}

export default EmojiPickerComponent
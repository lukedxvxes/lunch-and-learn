import { Button } from '@chakra-ui/react';
import React from 'react';
import { MdOutlineScheduleSend } from 'react-icons/md';
import { StyledCreatePostBtn } from './CreatePostButton.styled';

export function CreatePostButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      leftIcon={<MdOutlineScheduleSend />}
      colorScheme="blue"
      variant="outline"
      size="sm"
      onClick={onClick}
    >
      Request
    </Button>
  );
}

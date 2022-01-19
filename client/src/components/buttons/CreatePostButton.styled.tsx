import { Button } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { calcRem } from '../../helper/caclRem';

export const StyledCreatePostBtn = styled(Button)({
  height: calcRem(80),
  width: calcRem(80),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 0,

  svg: {
    position: 'relative',
    top: '-1px',
    left: '4px',
  },
});

import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { timeSince } from '../../helper/timeSince';
import { MdBuild, MdCalendarToday, MdDeleteForever } from 'react-icons/md';
import { UserContext } from '../../context/userContext';
import { useCookies } from 'react-cookie';
import { useQueryClient } from 'react-query';
import { API } from '../../constants';
import { ModalComponent } from '../modal/Modal';
import { EditRequestForm } from '../forms/EditRequestForm';

export interface PostInterface {
  bookedDate: string | null;
  createdAt: string;
  hostUserId: string | null;
  id: number;
  requestUserId: string;
  title: string;
  topic: string;
  description: string;
  updatedAt: string;
}

export function Post({ post }: { post: PostInterface }) {
  const { user } = useContext(UserContext);
  const postCreatedAtDate = new Date(post.createdAt);
  let postBookedAtDate = new Date();
  const userCanEditPost = post.requestUserId === user.id.toString();
  const [cookies, setCookie] = useCookies(['jwt']);
  const queryClient = useQueryClient();
  const toast = useToast();

  const {
    isOpen: editIsOpen,
    onOpen: editOnOpen,
    onClose: editOnClose,
  } = useDisclosure();
  const initialEditRef = React.useRef();
  const finalEditRef = React.useRef();

  const {
    isOpen: bookIsOpen,
    onOpen: bookOnOpen,
    onClose: bookOnClose,
  } = useDisclosure();
  const initialBookRef = React.useRef();
  const finalBookRef = React.useRef();
  const isBookedRequest = post.hostUserId !== null;

  if (isBookedRequest) {
    postBookedAtDate = new Date(post.bookedDate ? post.bookedDate : '');
  }

  async function handleDelete() {
    const settings = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + cookies.jwt,
      },
    };

    try {
      const createRequestResponse = await fetch(
        `${API}/posts/${post.id}`,
        settings,
      );

      if (createRequestResponse.status === 200) {
        toast({
          title: 'Request deleted.',
          description: "We've deleted your request.",
          status: 'success',
          duration: 9000,
          isClosable: true,
        });

        queryClient.invalidateQueries('all-posts');
      } else {
        toast({
          title: 'Error.',
          description: 'Please try again.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log('ERROR:: ', error);
    }
  }

  return (
    <>
      <Box
        mb={5}
        border="1px solid"
        borderColor="gray.300"
        p={5}
        borderRadius={5}
      >
        <SimpleGrid columns={2} spacing={10} templateColumns="1fr 120px">
          <div>
            <Heading size={'lg'} as="h3" mb={2}>
              {post.title}
            </Heading>
            <Badge px="2" colorScheme="blue" mr={2} mb={3}>
              {post.topic}
            </Badge>
            <Text fontSize="lg" mb={5}>
              {post.description}
            </Text>
          </div>

          <div>
            <Stat size="sm">
              <StatNumber>
                {isBookedRequest
                  ? 'booked for'
                  : timeSince(postCreatedAtDate) + ' ago'}
              </StatNumber>
              <StatHelpText>
                {isBookedRequest
                  ? postBookedAtDate.toLocaleDateString()
                  : postCreatedAtDate.toLocaleDateString()}
              </StatHelpText>
            </Stat>
          </div>
        </SimpleGrid>
        {!userCanEditPost && isBookedRequest ? '' : <Divider mb={5} />}

        <Stack direction="row" spacing={2}>
          {userCanEditPost && (
            <>
              <Button
                onClick={editOnOpen}
                leftIcon={<MdBuild />}
                colorScheme="blue"
                variant="solid"
                size="sm"
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDelete()}
                leftIcon={<MdDeleteForever />}
                colorScheme="red"
                variant="solid"
                size="sm"
              >
                Delete
              </Button>
            </>
          )}
          {!isBookedRequest && (
            <Button
              onClick={bookOnOpen}
              leftIcon={<MdCalendarToday />}
              colorScheme="blue"
              variant="outline"
              size="sm"
            >
              Book LnL
            </Button>
          )}
        </Stack>
      </Box>

      <ModalComponent
        isOpen={editIsOpen}
        onClose={editOnClose}
        initialRef={initialEditRef}
        finalRef={finalEditRef}
        title={'Edit request'}
      >
        <EditRequestForm post={post} onModalClose={editOnClose} />
      </ModalComponent>

      <ModalComponent
        isOpen={bookIsOpen}
        onClose={bookOnClose}
        initialRef={initialBookRef}
        finalRef={finalBookRef}
        title={'Edit request'}
      >
        <p>book request id: {post.id} form here.</p>
      </ModalComponent>
    </>
  );
}

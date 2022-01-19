import {
  Badge,
  Flex,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { CreatePostButton } from '../buttons/CreatePostButton';
import { CreateLnLForm } from '../forms/CreateLnLForm';
import { useAllPosts } from '../hooks/useAllPosts';
import { ModalComponent } from '../modal/Modal';
import type { PostInterface } from './Post';
import { Post } from './Post';

export function Posts() {
  const {
    isOpen: requestIsOpen,
    onOpen: requestOnOpen,
    onClose: requestOnClose,
  } = useDisclosure();
  const initialReqRef = React.useRef();
  const finalReqRef = React.useRef();

  const { data, isLoading, isError } = useAllPosts();

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (!data || isError) {
    return <p>posts arent available</p>;
  }

  const requests = data.filter((req) => req.hostUserId === null);
  const bookedRequests = data.filter((req) => req.hostUserId !== null);

  return (
    <>
      <Tabs mt={5}>
        <TabList>
          <Tab>Requested</Tab>
          <Tab>Booked</Tab>
          <Tab>Complete</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Flex direction="column">
              <Stack
                direction="row"
                spacing={2}
                mb={2}
                justifyContent="space-between"
              >
                <Badge
                  colorScheme="blue"
                  alignSelf="center"
                  variant="subtle"
                  p={1}
                >
                  total requsts: {data.length}
                </Badge>
                <CreatePostButton onClick={requestOnOpen} />
              </Stack>

              {requests.map((post: PostInterface, index: number) => {
                return <Post key={index} post={post} />;
              })}
            </Flex>
          </TabPanel>
          <TabPanel>
            {/* filter out requested and completed */}
            {bookedRequests.map((post: PostInterface, index: number) => {
              return <Post key={index} post={post} />;
            })}
          </TabPanel>
          <TabPanel>
            <p>complete ones go here</p>
            {/* filter out requested and booked */}
          </TabPanel>
        </TabPanels>
      </Tabs>

      <ModalComponent
        isOpen={requestIsOpen}
        onClose={requestOnClose}
        initialRef={initialReqRef}
        finalRef={finalReqRef}
        title={'Request Lunch & Learn'}
      >
        <CreateLnLForm onModalClose={requestOnClose} />
      </ModalComponent>
    </>
  );
}

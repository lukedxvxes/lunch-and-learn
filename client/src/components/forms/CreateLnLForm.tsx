import React, { useContext } from 'react';
import { Form, Formik } from 'formik';
import { Box, Button, Link } from '@chakra-ui/react';
import { FormikTextInput } from '../formFields/FormikTextInput';
import { validateTitle, validateTopic } from '../validations';
import { useCookies } from 'react-cookie';
import { useToast } from '@chakra-ui/react';
import { UserContext } from '../../context/userContext';
import { useQuery, useQueryClient } from 'react-query';
import { FormikTextArea } from '../formFields/FormikTextArea';
import { API } from '../../constants';

export function CreateLnLForm({ onModalClose }: { onModalClose: () => void }) {
  const [cookies, setCookie] = useCookies(['jwt']);
  const queryClient = useQueryClient();
  const toast = useToast();
  const { user } = useContext(UserContext);

  async function handleSubmit(values: any, actions: any) {
    const settings = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + cookies.jwt,
      },
      body: JSON.stringify({
        title: values.title,
        topic: values.topic,
        description: values.description,
        requestUserId: user.id.toString(),
      }),
    };

    try {
      const createRequestResponse = await fetch(
        `${API}/posts/create`,
        settings,
      );

      if (createRequestResponse.status === 200) {
        toast({
          title: 'Request created.',
          description: "We've added your request.",
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        queryClient.invalidateQueries('all-posts');
        onModalClose();
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
    <Formik
      initialValues={{
        title: '',
        topic: '',
        description: '',
        requestUserId: user.id.toString(),
      }}
      onSubmit={(values, actions) => handleSubmit(values, actions)}
    >
      {(props) => (
        <Form>
          <FormikTextInput
            validation={validateTitle}
            inputId="title"
            label="Title"
          />
          <Box mb={2} />
          <FormikTextInput
            validation={validateTopic}
            inputId="topic"
            label="Topic"
            placeholder="DevOps, Frontend, Backend, Processes etc"
          />
          <Box mb={2} />
          <FormikTextArea
            validation={validateTopic}
            inputId="description"
            label="Description"
          />

          <Button
            mt={4}
            colorScheme="blue"
            isLoading={props.isSubmitting}
            type="submit"
          >
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
}

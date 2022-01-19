import React from 'react';
import { Form, Formik } from 'formik';
import { Box, Button } from '@chakra-ui/react';
import { FormikTextInput } from '../formFields/FormikTextInput';
import { validateTitle, validateTopic } from '../validations';
import { useCookies } from 'react-cookie';
import { useToast } from '@chakra-ui/react';
import { useQueryClient } from 'react-query';
import { FormikTextArea } from '../formFields/FormikTextArea';
import { API } from '../../constants';
import type { PostInterface } from '../posts/Post';

export function EditRequestForm({
  onModalClose,
  post,
}: {
  onModalClose: () => void;
  post: PostInterface;
}) {
  const [cookies, setCookie] = useCookies(['jwt']);
  const queryClient = useQueryClient();
  const toast = useToast();

  async function handleSubmit(values: any, actions: any) {
    const settings = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + cookies.jwt,
      },
      body: JSON.stringify({
        title: values.title,
        topic: values.topic,
        description: values.description,
      }),
    };

    try {
      const createRequestResponse = await fetch(
        `${API}/posts/${post.id}`,
        settings,
      );

      if (createRequestResponse.status === 200) {
        toast({
          title: 'Request updated.',
          description: "We've updated your request.",
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
        title: post.title,
        topic: post.topic,
        description: post.description,
      }}
      onSubmit={(values, actions) => handleSubmit(values, actions)}
    >
      {(props) => (
        <Form>
          <FormikTextInput
            validation={validateTitle}
            inputId="title"
            label="Title"
            placeholder={post.title}
          />
          <Box mb={2} />
          <FormikTextInput
            validation={validateTopic}
            inputId="topic"
            label="Topic"
            placeholder={post.topic}
          />
          <Box mb={2} />
          <FormikTextArea
            validation={validateTopic}
            inputId="description"
            label="Description"
            placeholder={post.description}
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

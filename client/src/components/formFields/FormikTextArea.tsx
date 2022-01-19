import React from 'react';
import { Field } from 'formik';

import {
  FormControl,
  FormLabel,
  Textarea,
  FormErrorMessage,
  Input,
} from '@chakra-ui/react';

interface TextAreaProps {
  validation: (value: any) => string | undefined;
  inputId: string;
  label: string;
  placeholder?: string;
}

export function FormikTextArea({
  validation,
  inputId,
  label,
  placeholder,
}: TextAreaProps) {
  return (
    <Field name={inputId} validate={validation}>
      {({ field, form }: { field: any; form: any }) => (
        <FormControl isInvalid={form.errors[inputId] && form.touched[inputId]}>
          <FormLabel htmlFor={inputId}>{label}</FormLabel>
          <Textarea
            {...field}
            id={inputId}
            placeholder={placeholder ? placeholder : null}
            type={inputId === 'password' ? 'password' : 'text'}
          />
          <FormErrorMessage>{form.errors[inputId]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
}

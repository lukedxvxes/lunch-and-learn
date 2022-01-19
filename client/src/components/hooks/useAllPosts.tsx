import { useToast } from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useMutation, useQuery } from 'react-query';
import { API } from '../../constants';
import type { PostInterface } from '../posts/Post';

export function useAllPosts() {
  const [cookies, setCookie] = useCookies(['jwt']);

  return useQuery<PostInterface[]>('all-posts', async () => {
    const headers = {
      'Content-type': 'application/json',
      Authorization: `Bearer ${cookies.jwt}`,
    };

    const res = await fetch(`${API}/posts/`, {
      headers: headers,
    });

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return await res.json();
  });
}

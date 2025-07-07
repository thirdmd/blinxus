import React from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import ImmersiveFeed from '../../components/ImmersiveFeed';
import { PostCardProps } from '../../types/structures/posts_structure';

interface ImmersiveFeedScreenParams {
  posts: PostCardProps[];
  initialIndex?: number;
  title?: string;
}

type ImmersiveFeedScreenRouteProp = RouteProp<
  { ImmersiveFeedScreen: ImmersiveFeedScreenParams },
  'ImmersiveFeedScreen'
>;

const ImmersiveFeedScreen: React.FC = () => {
  const route = useRoute<ImmersiveFeedScreenRouteProp>();
  const { posts, initialIndex = 0, title = 'Feed' } = route.params;

  return (
    <ImmersiveFeed
      posts={posts}
      initialIndex={initialIndex}
      title={title}
    />
  );
};

export default ImmersiveFeedScreen; 
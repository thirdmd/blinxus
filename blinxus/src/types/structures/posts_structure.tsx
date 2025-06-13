import { activityColors, activityNames, ActivityKey } from '../../constants/activityTags';
import { Post } from '../userData/posts_data';

export interface PostCardProps {
  id: string;
  authorId: string;
  authorName: string;
  authorNationalityFlag?: string;
  authorProfileImage?: string;
  type: 'regular' | 'lucid';
  content?: string;
  title?: string;
  images?: string[];
  device?: string;
  location: string;
  activity?: ActivityKey;
  activityName?: string;
  activityColor?: string;
  timestamp: string;
  timeAgo: string;
  likes: number;
  comments: number;
  isEdited?: boolean;
  editAttempts?: number;
}

export const mapPostToCardProps = (post: Post): PostCardProps => {
  return {
    ...post,
    activityName: post.activity ? activityNames[post.activity] : undefined,
    activityColor: post.activity ? activityColors[post.activity] : undefined,
  };
};

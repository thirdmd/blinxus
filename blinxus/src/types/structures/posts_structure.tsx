import { activityColors, activityNames, ActivityKey } from '../../constants/activityTags';
import { Post } from '../userData/posts_data';
import { getUserById } from '../userData/users_data';

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
  locationEditCount?: number;
  activityEditCount?: number;
}

export const mapPostToCardProps = (post: Post): PostCardProps => {
  // Get user data from centralized database - SCALE PROOF!
  const user = getUserById(post.authorId);
  
  // Use centralized user data as source of truth
  const authorProfileImage = user?.profileImage || post.authorProfileImage;
  const authorName = user?.displayName || post.authorName;
  const authorNationalityFlag = user?.nationalityFlag || post.authorNationalityFlag;

  return {
    ...post,
    authorName,
    authorNationalityFlag,
    authorProfileImage,
    activityName: post.activity ? activityNames[post.activity] : undefined,
    activityColor: post.activity ? activityColors[post.activity] : undefined,
  };
};

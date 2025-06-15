import { activityColors, activityNames, ActivityKey } from '../../constants/activityTags';
import { Post } from '../userData/posts_data';
import { profileData } from '../userData/profile_data';

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
  // Dynamically assign profile image for Third Camacho
  let authorProfileImage = post.authorProfileImage;
  if (post.authorName === 'Third Camacho') {
    authorProfileImage = profileData.profileImage;
  }

  return {
    ...post,
    authorProfileImage,
    activityName: post.activity ? activityNames[post.activity] : undefined,
    activityColor: post.activity ? activityColors[post.activity] : undefined,
  };
};

export interface LoginType {
  email: string;
  password: string;
}
export interface lngType {
  lang: string;
}
export interface SidebarProp {
  themeLocal: string;
  handlePick: (menu: string) => void;
  isPick: any;
  lngDefault: string | null;
  changeLanguage: (lng: string) => void;
  handleChangeMode: (theme: string) => void;
  newNoti: number;
  setNewNoti: React.Dispatch<React.SetStateAction<number>>;
}

export interface UserType {
  avatar: string;
  bio: null;
  date_join: string;
  email: string;
  fullName: string;
  gender: number;
  id: number;
  password: string;
  status: number;
  userCode: string;
  userName: string;
}
export interface NotiType {
  id: number;
  type: string;
  date: string;
  status: number;
  postCode: string | null;
  interactUser: {
    userName: string;
    avatar: string;
    userCode: string;
    id: number;
  };
}
export interface postFollowType {
  user_id: number;
  friend_id: number;
  status: number;
}
export interface postNotiType {
  user_id: number | null;
  interact_id: number;
  type: string;
  post_id: number | null;
}

export interface commentProfile {
  status: number;
  allCmt: [
    content: string,
    cmt_date: string,
    level: number,
    id: number,
    cmt_reply: number,
    user: {
      avatar: string;
      userCode: string;
      userName: string;
    }
  ];
}

export interface reactProfile {
  allReactPost: [
    id: number,
    user: {
      avatar: string;
      userCode: string;
      userName: string;
      fullName: string;
    }
  ];
}

export interface MiniUserType {
  fullName: string;
  userName: string;
  avatar: string;
  userCode: string;
  id: number;
  follower: number;
}
export interface allMessType {
  id: number;
  mess: string;
  date: string;
  user: MiniUserType;
  converCode: string;
}
export interface groupType {
  id: number;
  converCode: string;
  members: MiniUserType[];
}
export interface lastMessType {
  id: number;
  mess: string;
  date: string;
  userName: string;
}
export interface createMessType {
  group_code: string;
  user_id: number;
  mess: string;
}
export interface updatePassType {
  user_id: number;
  password: string;
  newPassword: string;
}
export interface updateProfileType {
  id: number;
  fullName: string;
  bio: string;
  gender: number;
  avatar: string;
}

export interface messType {
  send_id: number;
  mess: string;
  date: string;
  converCode: string;
}

export interface createPostType {
  user_id: number;
  content: string;
}
export interface createMediaType {
  post_id: number;
  mediaUrl: string;
  type: string;
}
export interface createReactPost {
  post_id: number;
  user_id: number;
}

export interface createReactComment {
  cmt_id: number;
  user_id: number;
}

export interface createFollow {
  friend_id: number;
  user_id: number;
  status: number;
}

export interface postProfile {
  status: number;
  post: [
    content: string,
    id: number,
    postCode: string,
    post_time: string,
    media: [id: number, mediaUrl: string, type: string]
  ];
}

export interface followProfile {
  status: number;
  follower: [
    id: number,
    status: number,
    user: {
      id: number;
      avatar: string;
      userName: string;
      fullName: string;
      userCode: string;
    }
  ];
}

export interface followingProfile {
  status: number;
  following: [
    id: number,
    status: number,
    friend: {
      id: number;
      avatar: string;
      userName: string;
      fullName: string;
      userCode: string;
    }
  ];
}

export interface postHome {
  content: string;
  id: number;
  postCode: string;
  post_time: string;
  user: {
    avatar: string;
    userCode: string;
    userName: string;
  };
  media: [id: number, mediaUrl: string, type: string];
}

export interface MediaType {
  id: number;
  mediaUrl: string;
  type: string;
}
export interface UserManageType {
  id: number;
  userName: string;
  fullName: string;
  userCode: string;
  email: string;
  date_join: string;
  avatar: string;
  status: number;
}

export interface PostManageType {
  id: number;
  postCode: string;
  media: MediaType[];
  content: string;
  status: number;
  userName: string;
  userCode: string;
  avatar: string;
  date: string;
  userId: number;
}

export interface updateStatusType {
  userCode: string;
  admin_id: number;
  type: string;
}

export interface updateAccessType {
  month: string;
}

export interface CommentType {
  cmt_date: string;
  cmt_reply: number;
  content: string;
  id: number;
  level: number;
}

export interface InteractType {
  content: string;
  status: number;
  id: number;
  postCode: string;
  post_time: string;
  media: MediaType[];
  user: UserType;
}

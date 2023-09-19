import {
  BsFileEarmarkImage,
  BsFillFileEarmarkImageFill,
  BsHeart,
  BsHeartFill,
  BsPlusSquare,
  BsPlusSquareFill,
  BsSearch,
} from 'react-icons/bs';
import { GoHome, GoHomeFill } from 'react-icons/go';
import {
  MdDashboard,
  MdExplore,
  MdManageAccounts,
  MdOutlineDashboard,
  MdOutlineExplore,
  MdOutlineManageAccounts,
} from 'react-icons/md';
import { BiMoviePlay, BiSolidMoviePlay } from 'react-icons/bi';
import { RiMessengerLine, RiMessengerFill } from 'react-icons/ri';

export const sidebar = [
  { icon: GoHome, pick: GoHomeFill, content: 'home_sb' },
  { icon: BsSearch, pick: BsSearch, content: 'search_sb' },
  { icon: MdOutlineExplore, pick: MdExplore, content: 'explore_sb' },
  // { icon: BiMoviePlay, pick: BiSolidMoviePlay, content: 'reels_sb' },
  { icon: RiMessengerLine, pick: RiMessengerFill, content: 'messages_sb' },
  { icon: BsHeart, pick: BsHeartFill, content: 'noti_sb' },
  { icon: BsPlusSquare, pick: BsPlusSquareFill, content: 'create_sb' },
];

export const sidebarAdmin = [
  {
    icon: MdOutlineDashboard,
    pick: MdDashboard,
    content: 'admin_sb',
  },
  {
    icon: MdOutlineManageAccounts,
    pick: MdManageAccounts,
    content: 'user_mng_sb',
  },
  {
    icon: BsFileEarmarkImage,
    pick: BsFillFileEarmarkImageFill,
    content: 'post_mng_sb',
  },
];

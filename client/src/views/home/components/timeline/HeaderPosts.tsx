import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Avatar } from 'antd';
import '../css/Posts.css';
import ReactPlayer from 'react-player';
import moment from 'moment';
import { NavLink } from 'react-router-dom';

const settings = {
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: false,
  infinite: false,
};

const HeaderPosts = ({ headerPost }: any) => {
  const timeAgo = moment(headerPost?.post_time).fromNow();
  return (
    <div>
      <div className='w-[500px] items-center mt-5'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <NavLink to={`/profile/${headerPost?.user?.userCode}`}>
              <Avatar
                src={headerPost?.user?.avatar}
                size={40}
                className='cursor-pointer'
              >
                ĐN
              </Avatar>
            </NavLink>
            <NavLink to={`/profile/${headerPost?.user.userCode}`}>
              <p className='font-semibold cursor-pointer'>
                {headerPost?.user?.userName}
              </p>
            </NavLink>
            <div className='flex items-center'>
              <img src='/assets/icon/tick.png' alt='' width={16} />
              <p>{'・'}</p>
              <p>{timeAgo}</p>
            </div>
          </div>
        </div>
        <div className='mt-3'>
          <Slider {...settings}>
            {headerPost?.media.map((media: any) =>
              media.type === 'image' ? (
                <img
                  src={media.mediaUrl}
                  alt=''
                  key={media.id}
                  className='overflow-hidden object-cover h-[500px] z-10'
                />
              ) : media.type === 'video' ? (
                <div className='z-10 home-video' key={media.id}>
                  <ReactPlayer
                    url={media.mediaUrl}
                    playing={false}
                    width={500}
                  />
                </div>
              ) : null
            )}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default HeaderPosts;

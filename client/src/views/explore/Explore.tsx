import { useEffect, useState } from 'react';
import { postAllAPI } from '../../services/post';
import { AiFillHeart } from 'react-icons/ai';
import { FaComment } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import ModalPost from '../../layouts/ModalPost';

const Explore = () => {
  const [images, setImages] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const cmt = true;

  const openModal = (selectedMedia: any) => {
    setSelectedMedia(selectedMedia);
    setIsModalVisible(true);
  };

  const getPost = async () => {
    const allPost: any = await postAllAPI();
    if (Array.isArray(allPost?.post)) {
      const imageArray = allPost?.post.filter(
        (post: any) => post?.media[0]?.type === 'image'
      );
      const videoArray = allPost?.post.filter(
        (post: any) => post?.media[0]?.type === 'video'
      );

      setImages(imageArray.reverse());
      setVideos(videoArray.reverse());
    }
  };

  useEffect(() => {
    getPost();
  }, []);

  const chunkArray = (array: any[], chunkSize: number) => {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  };

  const imageChunks = chunkArray(images, 4);
  return (
    <div className='mt-10'>
      {imageChunks?.map((imageGroup, groupIndex) => (
        <div className='image-group flex justify-center gap-4' key={groupIndex}>
          <div className='image-group-grid order-1 h-[616px] w-[616px] mt-5'>
            {imageGroup.map((image) => (
              <div
                className='image-item h-[300px] gallery-item-1'
                key={image.id}
                onClick={() => openModal(image)}
              >
                <img
                  src={image?.media[0]?.mediaUrl}
                  alt=''
                  width={300}
                  height={300}
                  className='overflow-hidden object-cover aspect-square z-10'
                />
                <div className='gallery-item-info-1'>
                  <ul className='flex items-center'>
                    <div className='flex items-center gap-3'>
                      <AiFillHeart size={28} />
                      <li className='gallery-item-likes'>
                        <span className='visually-hidden'>
                          {image.reactPost.length}
                        </span>
                      </li>
                    </div>
                    <div className='flex items-center gap-3'>
                      <FaComment size={25} />
                      <li className='gallery-item-comments'>
                        <span className='visually-hidden'>
                          {image.comment.length}
                        </span>
                      </li>
                    </div>
                  </ul>
                </div>
              </div>
            ))}
          </div>
          {videos[groupIndex] && (
            <div
              className={`video-item h-[616px] mt-5 ${
                groupIndex % 2 === 0 ? 'order-2' : ''
              }`}
              key={videos[groupIndex].id}
              onClick={() => openModal(videos[groupIndex])}
            >
              <div className='gallery-item-2'>
                <ReactPlayer
                  url={videos[groupIndex]?.media[0]?.mediaUrl}
                  playing={false}
                  width={300}
                  height={'100%'}
                />
                <div className='gallery-item-info-1'>
                  <ul className='flex items-center'>
                    <div className='flex items-center gap-3'>
                      <AiFillHeart size={28} />
                      <li className='gallery-item-likes'>
                        <span className='visually-hidden'>
                          {videos[groupIndex].reactPost.length}
                        </span>
                      </li>
                    </div>
                    <div className='flex items-center gap-3'>
                      <FaComment size={25} />
                      <li className='gallery-item-comments'>
                        <span className='visually-hidden'>
                          {videos[groupIndex].comment.length}
                        </span>
                      </li>
                    </div>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      <ModalPost
        closeModal={() => setIsModalVisible(false)}
        isVisible={isModalVisible}
        interact={selectedMedia}
        cmt={cmt}
      />
    </div>
  );
};

export default Explore;

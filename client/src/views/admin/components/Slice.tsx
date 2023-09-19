import Slider from 'react-slick';
import ReactPlayer from 'react-player';
import { InteractType } from '../../../constants/type';

const settings = {
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: false,
  infinite: false,
};
interface SliceProp {
  interact: InteractType;
}
const Slice = ({ interact }: SliceProp) => {
  return (
    <div className=''>
      <Slider {...settings}>
        {interact?.media?.map((media: any) =>
          media.type === 'image' ? (
            <img
              src={media.mediaUrl}
              alt=''
              key={media.id}
              width={'100%'}
              height={625}
              className='h-full object-cover overflow-hidden'
            />
          ) : media.type === 'video' ? (
            <div
              className='max-w-full max-h-full flex items-center justify-center'
              key={media.id}
            >
              <div className='mt-16 flex items-center justify-center'>
                <ReactPlayer
                  url={media.mediaUrl}
                  playing={false}
                  controls
                  // width={'100%'}
                  // height={'100%'}
                />
              </div>
            </div>
          ) : null
        )}
      </Slider>
    </div>
  );
};

export default Slice;

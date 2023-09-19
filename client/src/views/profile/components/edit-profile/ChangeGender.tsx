import { useTranslation } from 'react-i18next';
import Modal from 'antd/es/modal/Modal';
import { Input, Radio, RadioChangeEvent, Space } from 'antd';
import '../../../../index.css';

interface ChangeGenderProp {
  openModalChangeGender: boolean;
  handleCancel: () => void;
  onChangeGender: (e: RadioChangeEvent) => void;
  gender: number;
}
const ChangeGender = ({
  openModalChangeGender,
  handleCancel,
  onChangeGender,
  gender,
}: ChangeGenderProp) => {
  const { t } = useTranslation(['profile']);
  console.log('gender', gender);
  
  return (
    <div>
      <Modal
        title={t('gender_pf')}
        open={openModalChangeGender}
        footer={null}
        onCancel={handleCancel}
        centered
        className='custom-modal'
      >
        <Radio.Group
          onChange={onChangeGender}
          value={gender}
          className='mx-5 my-3'
        >
          <Space direction='vertical'>
            <Radio checked={gender===1} value={1}>{t('female')}</Radio>
            <Radio checked={gender===0} value={0}>{t('male')}</Radio>
            <Radio checked={gender===2} value={2}>{t('gender_not_say_pf')}</Radio>
          </Space>
        </Radio.Group>
        <div className='w-full pb-1'>
          <p
            className='m-2 py-1 bg-blue-chat text-white text-center rounded-md cursor-pointer'
            onClick={handleCancel}
          >
            {t('done')}
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default ChangeGender;

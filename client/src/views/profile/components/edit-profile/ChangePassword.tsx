import { useTranslation } from 'react-i18next';
import Modal from 'antd/es/modal/Modal';
import { Button, Form, Input } from 'antd';
import '../../../../index.css';
import { useState } from 'react';
import { updatePasswordAPI } from '../../../../services/user';
import { getCurrentUser } from '../../../../stores/slices/userSlice';
import { useSelector } from 'react-redux';
import { notiError, notiSuccess } from '../../../../constants/notification';

interface ChangePassProp {
  openModalChangePass: boolean;
  handleCancel: () => void;
}
const ChangePassword = ({
  openModalChangePass,
  handleCancel,
}: ChangePassProp) => {
  const { t } = useTranslation(['profile']);
  const [message, setMessage] = useState('');
  const currentUser = useSelector(getCurrentUser);
  const [oldPass, setOldPass] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [newPassRetype, setNewPassRetype] = useState('');

  const inputOldPass = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage('');
    setOldPass(e.target.value);
  };

  const inputNewPass = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage('');
    setNewPassInput(e.target.value);
  };

  const inputReTypePass = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage('');
    setNewPassRetype(e.target.value);
  };
  const onFinish = async () => {
    if (
      oldPass.length < 6 ||
      newPassInput.length < 6 ||
      newPassRetype.length < 6
    ) {
      setMessage(t('pass_length_6'));
    } else if (
      oldPass.length > 20 ||
      newPassInput.length > 20 ||
      newPassRetype.length > 20
    ) {
      setMessage(t('pass_length_20'));
    } else if (oldPass === newPassInput) {
      setMessage(t('dont_different'));
    } else if (newPassInput !== newPassRetype) {
      setMessage(t('dont_match'));
    } else {
      setMessage('');
      const data = {
        user_id: currentUser?.id,
        password: oldPass,
        newPassword: newPassInput,
      };
      const response: any = await updatePasswordAPI(data);
      const { status, message } = response || {};
      if (status === 400 && message === 'Password is not correct') {
        notiError(t('pass_wrong'));
        handleCancel();
      } else if (status === 200) {
        notiSuccess(t('pass_change_success'));
        handleCancel();
      } else {
        notiError(t('smt_wrong'));
        handleCancel();
      }
    }
  };

  return (
    <div>
      <Modal
        title={t('change_pass')}
        open={openModalChangePass}
        footer={null}
        onCancel={handleCancel}
        centered
        className='custom-modal'
      >
        <div className='mx-2 flex flex-col gap-3 py-2'>
          <Form
            name='password'
            onFinish={onFinish}
            colon={false}
            style={{ maxWidth: 600 }}
          >
            <Form.Item name={t('cur_pass')} rules={[{ required: true }]}>
              <Input.Password
                placeholder={t('cur_pass')}
                onChange={inputOldPass}
              />
            </Form.Item>
            <Form.Item name={t('new_pass')} rules={[{ required: true }]}>
              <Input.Password
                placeholder={t('new_pass')}
                onChange={inputNewPass}
                status={message === t('dont_different') ? 'error' : undefined}
              />
            </Form.Item>
            <Form.Item name={t('retype_new_pass')} rules={[{ required: true }]}>
              <Input.Password
                placeholder={t('retype_new_pass')}
                onChange={inputReTypePass}
                status={message === t('dont_match') ? 'error' : undefined}
              />
            </Form.Item>
            {message ? <p className='text-red pb-3'>{message}</p> : <p></p>}
            <Form.Item label=' '>
              <Button type='primary' htmlType='submit'>
                {t('submit')}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default ChangePassword;

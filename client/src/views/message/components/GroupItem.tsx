import React, { useEffect, useState } from 'react';
import {
  MiniUserType,
  allMessType,
  groupType,
  lastMessType,
  messType,
} from '../../../constants/type';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getCurrentUser } from '../../../stores/slices/userSlice';
import { getLastMessAPI } from '../../../services/message';
import moment from 'moment';
import { PATH } from '../../../services/list-path';

interface GroupItemProp {
  group: groupType;
  newMessages: allMessType[];
  setDeleteGroup: React.Dispatch<React.SetStateAction<string>>;
  deleteGroup: string;
}
const GroupItem = ({
  group,
  newMessages,
  setDeleteGroup,
  deleteGroup,
}: GroupItemProp) => {
  const currentUser = useSelector(getCurrentUser);
  const [memberWithoutMe, setMemberWithoutMe] = useState<MiniUserType[]>([]);
  const [lastMess, setLastMess] = useState<lastMessType | null>(null);
  const [memberList, setMemberList] = useState('');
  // console.log('newMessages', newMessages);

  const fetchLastMess = async () => {
    const response: any = await getLastMessAPI(
      group?.converCode,
      currentUser?.id
    );
    const { id, mess, user, date, deleted_by } = response;
    const dateFormat = moment(date).fromNow(true) || '';
    const last = {
      id: id,
      mess: mess,
      date: dateFormat,
      userName: user?.userName,
    };
    if (mess) setLastMess(last);
    else {
      let newDeleteGroup = '';
      if (deleteGroup === '') {
        newDeleteGroup = `${group?.converCode}`;
      } else if (!deleteGroup?.split(', ').includes(`${group?.converCode}`)) {
        newDeleteGroup = `${deleteGroup}, ${group?.converCode}`;
      }
      setDeleteGroup(newDeleteGroup);
    }
    // if (deleted_by.split(', ').includes(currentUser?.id)) setShowGroup(false);
  };
  useEffect(() => {
    fetchLastMess();
    const members: MiniUserType[] = [];
    group?.members?.forEach((fr: MiniUserType) => {
      if (!members?.some((unique) => unique?.id === fr?.id)) {
        members?.push(fr);
      }
    });
    const memberFilter = members?.filter((mb) => mb?.id !== currentUser?.id);
    setMemberWithoutMe(memberFilter);
    const fullNameList = memberFilter?.map((mb) => mb?.fullName).join(', ');
    setMemberList(fullNameList);
  }, [group]);
  useEffect(() => {
    if (newMessages?.length > 0) {
      const checkGroup =
        group.converCode === newMessages[newMessages?.length - 1].converCode;
      if (checkGroup) {
        const lastMessArrival = newMessages[newMessages?.length - 1];
        const date = moment(lastMessArrival?.date).fromNow(true) || '';
        const lastMessObj = {
          id: lastMessArrival?.id,
          mess: lastMessArrival?.mess,
          date,
          userName: lastMessArrival?.user?.userName,
        };
        setLastMess(lastMessObj);
      }
    }
  }, [newMessages]);

  return (
    <Link to={`${PATH.MESSAGE.replace(':chatCode', group?.converCode)}`}>
      <div className='flex flex-row gap-3 items-center w-full'>
        {memberWithoutMe?.length > 1 ? (
          <div className='relative mt-2 w-14 h-14'>
            <img
              src={memberWithoutMe[0]?.avatar}
              alt=''
              className='w-10 h-10 overflow-hidden object-cover rounded-full'
            />
            <img
              src={memberWithoutMe[1]?.avatar}
              alt=''
              className='w-10 h-10 overflow-hidden object-cover rounded-full absolute top-3 left-3 
            border-2 border-white dark:border-black'
            />
          </div>
        ) : (
          <img
            src={memberWithoutMe[0]?.avatar}
            alt=''
            className='w-14 h-14 overflow-hidden object-cover rounded-full'
          />
        )}
        <div className='lg:flex gap-1 text-sm flex-col flex-1 hidden'>
          <span>
            {memberList && memberList?.length > 20
              ? `${memberList?.slice(0, 20)}...`
              : memberList}
          </span>
          {lastMess?.mess && (
            <span className='text-gray-text-w text-xs'>
              {lastMess?.userName}
              {': '}
              {lastMess?.mess && lastMess?.mess?.length > 20
                ? `${lastMess?.mess.slice(0, 20)}...`
                : lastMess?.mess}
              {'・ '}
              {lastMess?.date}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default GroupItem;

import React from 'react'
import { useSelector } from 'react-redux'
import { getLoading } from '../../stores/slices/appSlice'
import './Loading.css'

const Loading = () => {
  const loading = useSelector(getLoading)
  return loading &&
    <div className={`w-screen h-screen dark:bg-overlay-20 bg-overlay-40 fixed`}>
      <div className="loader">
      </div>
    </div>
}

export default Loading
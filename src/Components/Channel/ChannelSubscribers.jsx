/** @format */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ChannelSubscribers() {
  const { userName } = useParams();
  const [currUser, setCurrUser] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [subscribedData, setSubscribedData] = useState([]);
  const [toggleSubscribedData, setToggleSubscribed] = useState(0);
  const [likedByCurrentUser , setLikedByCurrentUSer] = useState(0)

  // Fetch current user
  useEffect(() => {
    const fetchCurrUser = async () => {
      try {
        const res = await axios.get(`https://youtube-backend-psi.vercel.app/api/v1/users/current-user`);
        setCurrUser(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCurrUser();
  }, []);

  // Fetch profile user
  useEffect(() => {
    const fetchProfileUser = async () => {
      try {
        const res = await axios.get(`https://youtube-backend-psi.vercel.app/api/v1/users/c/${userName}`);
        setProfileUser(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfileUser();
  }, [userName]);

  // Fetch subscriptions by profileUser
  useEffect(() => {
    if (profileUser) {
      const fetchSubscription = async () => {
        try {
          const res = await axios.get(
            `https://youtube-backend-psi.vercel.app/api/v1/subscriptions/c/${profileUser._id}`
          );
          setSubscribedData(res.data.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchSubscription();
    }
  }, [profileUser , toggleSubscribedData]);

  const setCommentLikedByCurrentUser = (channelId) => {
    const res = subscribedData.some((sub) =>
      sub.channelDetails.some(
        (channel) =>
          channel._id === channelId &&
          channel.subscribersList.some(
            (subscriber) => subscriber.subscriber === currUser?._id
          )
      )
    );
    return res;
  };

  async function handleToggleSubscribed(channelId) {
    try {
      const res = await axios.post(`https://youtube-backend-psi.vercel.app/api/v1/subscriptions/c/${channelId}`, {
        userId: currUser?._id,
      });
      setToggleSubscribed(res.data.data === 1);
    } catch (error) {
      console.log("Error: " + error);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-y-4 py-4">
        <div className="relative mb-2 rounded-lg bg-white py-2 pl-8 pr-3 text-black">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              ></path>
            </svg>
          </span>
          <input
            className="w-full bg-transparent outline-none"
            placeholder="Search"
          />
        </div>

        {subscribedData.length ? (
          subscribedData.map((channels, index) => (
            <div className="flex w-full justify-between" key={index}>
              <div className="flex items-center gap-x-2">
                <div className="h-14 w-14 shrink-0">
                  <img
                    src={channels.channelDetails[0].avatar}
                    alt="Channel Avatar"
                    className="h-full w-full rounded-full"
                  />
                </div>
                <div className="block">
                  <h6 className="font-semibold">
                    {channels.channelDetails[0].userName}
                  </h6>
                  <p className="text-sm text-gray-300">
                    {channels.channelDetails[0].subscribersCount} Subscribers
                  </p>
                </div>
              </div>
              <div className="block">
                <button
                  className={`group/btn px-3 py-2 text-black  ${
                   setCommentLikedByCurrentUser(channels.channelDetails[0]._id)
                      ? "bg-[#ae7aff]"
                      : "bg-[#ffffff]"
                  }`}
                  onClick={() =>
                    handleToggleSubscribed(channels.channelDetails[0]._id)
                  }
                >
                  {setCommentLikedByCurrentUser(channels.channelDetails[0]._id)
                    ? "UnSubscribed"
                    : "Subscribed"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <h1>0 subscribedData</h1>
        )}
      </div>
    </>
  );
}

export default ChannelSubscribers;

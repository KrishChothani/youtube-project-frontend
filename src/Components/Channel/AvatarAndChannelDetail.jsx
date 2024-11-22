import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import UserProfile from '../../UserProfile';


function AvatarAndChannelDetail() {

  const {userName} = useParams();
  const [user, setUser] = useState(null);
  const [profileUser , setProfileUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [toggleSubscribed, setToggleSubscribed] = useState(0);
  const [subscribedChannel , setSubscribedChannel] = useState(null);
  // fetch currrent user
  useEffect(() => {
    const fetchcurrUser = async () => {
      try {
        const res = await axios({
          method: "GET",
          url: "https://youtube-backend-psi.vercel.app/api/v1/users/current-user",
        });
        setUser(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchcurrUser();
  }, []);

  // fetch profile User
  useEffect(() => {
    const fetchProfileUser = async () => {
      try {
        const res = await axios({
          method: "GET",
          url: `https://youtube-backend-psi.vercel.app/api/v1/users/c/${userName}`,
        });
        setProfileUser(res.data.data);
        //  console.log(res);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfileUser();
  }, [userName]);

  // fetch subscription
  useEffect(() => {
    if (profileUser) {
      const fetchSubscription = async () => {
        try {
          const res = await axios.get(
            `https://youtube-backend-psi.vercel.app/api/v1/subscriptions/u/${profileUser._id}`
          );
          setSubscription(res.data.data);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };
      fetchSubscription();
    }
  }, [profileUser,loading, toggleSubscribed]);

  // set toggle subscribed
  useEffect(() => {
    if (subscription) {
      const isSubscribed = subscription.some(
        (sub) => sub.subscriber._id === user._id
      );
      setToggleSubscribed(isSubscribed ? 1 : 0);
    }
  }, [subscription]);

  // fetch subscribed channel
  useEffect(()=>{
    if(profileUser)
    {
      const fetchSubChannel = async () => {
        try {
          const res = await axios({
            method: "GET",
            url: `https://youtube-backend-psi.vercel.app/api/v1/subscriptions/c/${profileUser._id}`,
          });
          setSubscribedChannel(res.data.data);
          // console.log(res.data.data)
        } catch (error) {
          console.error(error);
        }
      };
      fetchSubChannel();
    }
    
  },[user,profileUser,subscribedChannel])


  // handle toggle subscribed by function
  async function handleToggleSubscribed() {
    try {
      const res = await axios({
        method: "POST",
        url: `https://youtube-backend-psi.vercel.app/api/v1/subscriptions/c/${profileUser._id}`,
        data: {
          userId: `${user._id}`,
        },
      });
      setToggleSubscribed(res.data.data == 1);
    } catch (error) {
      console.log("error" + error);
    }
  }

  if (loading) {
    return <h1>Loading ...</h1>;
  }

  return (
    <>
      <div className="flex flex-wrap gap-4 pb-4 pt-6">
        <span className="relative -mt-12 inline-block h-28 w-28 shrink-0 overflow-hidden rounded-full border-2">
          {profileUser?.avatar ? (
            <img
              src={profileUser.avatar}
              alt="Channel"
              className="h-full w-full"
            />
          ) : (
            <p>Loading Avatar ...</p>
          )}
        </span>
        <div className="mr-auto inline-block">
          <h1 className="font-bolg text-xl">
            {profileUser?.fullName ? profileUser.fullName : <h1>Full Name</h1>}
          </h1>
          <p className="text-sm text-gray-400">
            @{profileUser?.userName ? profileUser.userName : <h1>User Name</h1>}
          </p>
          <p className="text-sm text-gray-400">
            <span>{subscription ? subscription.length : 0}</span>
            <span style={{ marginLeft: "5px" }}>subscribers</span> · 
            <span style={{ marginLeft: "5px" }}>{subscribedChannel ? subscribedChannel.length : 0}</span>
             <span> Subscribed</span>
          </p>
        </div>
        <div className="inline-block">
          <div className="inline-flex min-w-[145px] justify-end">
            <button
              className="group/btn mr-1 flex w-full items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto"
              onClick={handleToggleSubscribed}
            >
              <span className="inline-block w-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                  ></path>
                </svg>
              </span>

              <span className="group-focus">
                {toggleSubscribed == 1 ? "UnSubscribe" : "SubScribe"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AvatarAndChannelDetail

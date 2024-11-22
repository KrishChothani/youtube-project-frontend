/** @format */

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function AllVideo({ callVideo = "" }) {
   const navigate = useNavigate();
   const [videos, setVideos] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const { userName = "" } = useParams();
   const [likeData, setLikeData] = useState([]);
   const [currUser, setCurrUser] = useState(null);

   // Fetch current user data
   useEffect(() => {
     const fetchData = async () => {
       try {
         const res = await axios.get(
           "https://youtube-backend-psi.vercel.app/api/v1/users/current-user",
           {
             withCredentials: true,
             
           },
           
         );
         setCurrUser(res.data.data);
       } catch (error) {
         console.log(error);
       }
     };
     fetchData();
   }, []); // No need to depend on loading or error here.

   // Fetch all videos
   useEffect(() => {
     const fetchVideos = async () => {
       try {
         let res;
         if (callVideo === "watchhistory") {
           res = await axios.get("https://youtube-backend-psi.vercel.app/api/v1/users/history");
         } else {
           res = await axios.get("https://youtube-backend-psi.vercel.app/api/v1/videos");
         }

         if (userName === "") {
           setVideos(res.data.data.docs || res.data.data);
         } else {
           const userVideo = res.data.data.docs.filter(
             (vd) => vd.ownerDetails.userName === userName
           );
           setVideos(userVideo);
         }
       } catch (err) {
         setError(err.message || "Failed to fetch videos");
       } finally {
         setLoading(false);
       }
     };

     if (callVideo !== "likedVideo") {
       fetchVideos();
     }
   }, [callVideo, userName]); // Depend on callVideo and userName to prevent redundant requests

   // Fetch liked videos when callVideo is 'likedVideo'
   useEffect(() => {
     const fetchLikedVideos = async () => {
       try {
         if (callVideo === "likedVideo" && currUser) {
           const resp = await axios.get("https://youtube-backend-psi.vercel.app/api/v1/likes/");
           const videodata = resp.data.data
             .filter((li) => li.LikedBy === currUser._id && li.video)
             .map((li) => li.videoDetails);
           setVideos(videodata);
         }
       } catch (error) {
         setError("Error in fetching liked videos");
       } finally {
         setLoading(false);
       }
     };

     fetchLikedVideos();
   }, [callVideo, currUser]);

   if (loading) return <p>Loading videos...</p>;
   if (error) return <p>Error: {error}</p>;

   return (
     <>
       <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
         <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 p-4">
           {videos?.length > 0 ? (
             videos.map((video, index) => (
               <div className="w-full" key={index}>
                 <div className="relative mb-2 w-full pt-[56%]">
                   <div className="absolute inset-0 flex items-center justify-center">
                     <button
                       onClick={() => navigate(`/video/${video._id}`)}
                       className="w-full h-full"
                     >
                       <img
                         src={video.thumbnail}
                         alt={video.title}
                         className="h-full w-full object-cover"
                       />
                     </button>
                   </div>
                   <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm text-white">
                     {video.duration.toFixed(2)}
                   </span>
                 </div>

                 <div className="flex gap-x-2">
                   <button
                     onClick={() =>
                       navigate(
                         `/userProfile/${video.ownerDetails?.userName}/videos`
                       )
                     }
                     className="flex w-full p-0 hover:bg-gray-800 rounded-md transition-colors duration-200"
                   >
                     <div className="h-10 w-10 shrink-0 mr-3">
                       <img
                         src={
                           video.ownerDetails?.avatar || "default-avatar.jpg"
                         }
                         alt={video.ownerDetails?.userName || "Username"}
                         className="h-full w-full rounded-full object-cover"
                       />
                     </div>

                     <div className="flex flex-col justify-start ml-0">
                       <h6 className="flex font-semibold text-white">
                         {video.title}
                       </h6>
                       <p className="flex text-sm text-gray-400">
                         {video.views} Views ·{" "}
                         {Math.floor(
                           (new Date() - new Date(video.updatedAt)) /
                             (1000 * 60 * 60 * 24)
                         )}{" "}
                         day ago
                       </p>
                       <p className="flex text-sm text-gray-400">
                         {video.ownerDetails?.userName || "Unknown"}
                       </p>
                     </div>
                   </button>
                 </div>
               </div>
             ))
           ) : (
             <p>No videos available.</p>
           )}
         </div>
       </section>
     </>
   );
}

export default AllVideo;

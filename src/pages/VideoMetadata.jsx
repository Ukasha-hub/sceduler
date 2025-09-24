import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';

import useFileFolderManager from '../hooks/useFileFolderManager';


function VideoMetadata() {
   
  const navigate = useNavigate();   

  const { id } = useParams();

  const {cards, setCards} = useFileFolderManager();

  const Item = cards.find(item => item.id == id);

  console.log('ID from URL:', id);
  console.log('Filtered Item:', Item);
  return (
         <div>
          <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium"
      >
        ⬅ Back
      </button>
        
        <div className='p-20 border-2 w-full flex flex-col lg:flex-row gap-15    justify-between  h-screen'>
                  <div className=' w-full lg:w-3/5 aspect-video'>
                    
                    
                    <iframe width="560" className='  size:100 w-full' height="315" src={Item.basicMetadata.filename} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                  </div>
                  <div className='flex flex-col gap-2   text-xs'>
                    
                      <h1 className='text-xl text-bold'>{Item.descriptiveMetadata.videoTitle}</h1>
                      <p className='text-sm '><span className='font-bold'>Author: </span>{Item.descriptiveMetadata.author}</p>
                      <p><span className='font-bold'>Copyright claimed?: </span>{Item.descriptiveMetadata.copyrightClaimed}</p>
                      <p><span className='font-bold'>Publishing Date: </span>{Item.descriptiveMetadata.uploadDate}</p>
                      <p>{Item.descriptiveMetadata.description}</p>

                      <hr />

                      <p><span className='font-bold'>Codec: </span> {Item.streamMetadata.codec}</p>
                      <p><span className='font-bold'>resolution: </span> {Item.streamMetadata.resolution} pixels</p>
                      <p><span className='font-bold'>Frame Rate: </span>  {Item.streamMetadata.frameRate} </p>
                      <p><span className='font-bold'>Aspect Ratio: </span>  {Item.streamMetadata.aspectRatio}</p>
                      <p><span className='font-bold'>Duration: </span> {Item.streamMetadata.duration} </p>
                      <p><span className='font-bold'>Size: </span> {Item.basicMetadata.filesize} </p>
                      <p><span className='font-bold'>Format: </span> {Item.basicMetadata.format} </p>
                  </div>
        </div>
        </div>

    
  )
}

export default VideoMetadata
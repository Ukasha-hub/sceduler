import React from 'react'
import { Link } from 'react-router-dom';
import cardData from '../services/CardData';
import { FaHome } from "react-icons/fa";
import { FaFolder } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";

const Breadcrumb = ({location, pathnames}) => {
  return (
             <div className="breadcrumbs text-xs lg:text-sm">
                              <ul className="flex gap-2">
                                <li ><Link to="/"> <div className='flex flex-row gap-1'> <span><FaHome /></span> <span>Home</span></div></Link></li>
                                {pathnames.map((title, index) => {
                                  const routeTo = '/' + pathnames.slice(0,1).join('/');
                                  const isLast = index === pathnames.length - 1;
                                
                                  // Convert title to number for correct match
                                  const matched = cardData.find((item) => item.id === Number(title));
                                  const displayName = matched?.title || title;
                                  return (
                                    <li key={index}>
                                      {isLast ? (
                                        <span className="text-gray-500"><div className='flex flex-row gap-1'> <span className='flex flex-row'><IoIosArrowForward /><FaFolder /></span> <span>{displayName}</span></div></span>
                                      ) : (
                                        <Link to={routeTo}><div className='flex flex-row gap-1'> <span className='flex flex-row'><IoIosArrowForward /><FaFolder /></span> <span>{displayName}</span></div></Link>
                                      )}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
  )
}

export default Breadcrumb
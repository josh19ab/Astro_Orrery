"use client";
import { BsInfoCircle } from "react-icons/bs";
import { MdOpenInFull } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { IoLayers } from "react-icons/io5";
import { useContext, useEffect, useRef, useState } from "react";
import FullscreenContext from "./FullScreenContext";

const Controls = () => {
  const { toggleFullscreen, zoomIn, zoomOut, zoomLevel } =
    useContext(FullscreenContext);
  if (!toggleFullscreen) {
    console.error(
      "toggleFullscreen is undefined. Make sure the FullscreenProvider is wrapping the component tree."
    );
  }

  return (
    <div className="absolute right-10 flex flex-col bottom-16  items-center gap-2 font-roboto z-50">
      <button className="text-[#95959d] w-8 h-8 bg-[#ffffff26] hover:bg-[#25252799] p-1 hover:text-white flex justify-center items-center rounded-sm">
        <BsInfoCircle />
      </button>
      <button className="text-[#95959d] w-8 h-8 bg-[#252527] p-1 hover:bg-[#25252799] hover:text-white flex justify-center items-center rounded-sm">
        <IoLayers size={20} />
      </button>
      <button className="text-[#95959d] w-8 h-16 bg-[#ffffff26] hover:bg-[#25252799] p-1 flex flex-col items-center justify-evenly rounded-sm">
        <span className=" hover:text-white ">
          <FaPlus size={12} onClick={zoomIn}/>
        </span>
        <div className="h-[2px] w-[24px] bg-[#95959d] "></div>
        <span className=" hover:text-white ">
          <FaMinus size={12} onClick={zoomOut} />
        </span>
      </button>
      <button
        className="text-[#95959d] w-8 h-8 hover:bg-[#25252799] bg-[#ffffff26] p-1 hover:text-white flex justify-center items-center rounded-sm"
        onClick={toggleFullscreen}
      >
        <MdOpenInFull />
      </button>
    </div>
  );
};

export default Controls;

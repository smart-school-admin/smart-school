"use client";
import Image from "next/image";
import { ChangeEvent, useState, useRef } from "react";
import { ImageIcon, XCircleIcon } from "lucide-react";

export function ProfileImageUpload({ imgSrc = "", name }: { imgSrc?: string, name?:string }) {
  const [src, setSrc] = useState<string | undefined>(imgSrc);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSrc(URL.createObjectURL(event.target.files![0]));
  };
  const removeImage = () => {
    fileRef.current!.value = "";
    console.log(fileRef.current?.files)
    setSrc(undefined);
  };
  return (
    <div className="relative">
      <label
        htmlFor="image_upload_id"
        className="w-32 h-32 rounded-full bg-gray-300 cursor-pointer flex justify-center items-center overflow-hidden border-2 border-ssPrimary-100 relative"
      >
        {!src && <ImageIcon className="w-7 h-8" />}
        {src && (
          <img
            className="w-full h-full object-cover"
            alt="Uploaded image"
            src={src}
          />
        )}
        <input
          type="file"
          id="image_upload_id"
          className="hidden"
          onChange={handleChange}
          accept="image/png, image/jpg, image/jpeg"
          ref={fileRef}
          name={name}
        />
      </label>
      {src && (
        <XCircleIcon className="w-6 h-6 absolute right-1 top-0 fill-ssPrimary-100 stroke-white cursor-pointer" onClick={removeImage} />
      )}
    </div>
  );
}

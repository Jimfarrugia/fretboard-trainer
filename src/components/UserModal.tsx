"use client";
import Image from "next/image";

interface Modal extends HTMLElement {
  showModal: () => void;
}

interface UserModalProps {
  name: string;
  image: string;
  email: string;
  priority?: boolean;
}

// Closes when clicking outside the modal or pressing ESC
export default function UserModal({
  name,
  image,
  email,
  priority = false,
}: UserModalProps) {
  const buttonImgSize = 24;
  const modalImgSize = 64;

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() =>
          (document.getElementById("user-modal") as Modal).showModal()
        }
      >
        <Image
          src={image.replace("=s96", `=s${buttonImgSize}`)}
          alt={`${name} profile image`}
          width={buttonImgSize}
          height={buttonImgSize}
          className="rounded-full"
          priority={priority}
        />
      </button>
      <dialog id="user-modal" className="modal">
        <div className="modal-box  border-2 border-light-heading bg-light-bg text-light-body dark:border-dark-heading dark:bg-dark-darkerBg dark:text-dark-body">
          <div className="flex flex-col items-center gap-4">
            <p className="text-lg font-bold">You are signed in as:</p>
            <Image
              src={image.replace("=s96", `=s${modalImgSize}`)}
              alt={`${name} profile image`}
              width={modalImgSize}
              height={modalImgSize}
              className="rounded-full"
              loading="lazy"
            />
            <p>{name}</p>
            <p>{email}</p>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

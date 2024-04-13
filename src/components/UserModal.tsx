"use client";
import Image from "next/image";

interface Modal extends HTMLElement {
  showModal: () => void;
}

interface UserModalProps {
  name: string;
  image: string;
  email: string;
}

// Closes when clicking outside the modal or pressing ESC
export default function UserModal(props: UserModalProps) {
  const { name, image, email } = props;

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() =>
          (document.getElementById("user-modal") as Modal).showModal()
        }
      >
        <Image
          src={image}
          alt={name}
          width={24}
          height={24}
          className="rounded-full"
        />
      </button>
      <dialog id="user-modal" className="modal">
        <div className="modal-box  border-2 border-light-heading bg-light-bg text-light-body dark:border-dark-heading dark:bg-dark-darkerBg dark:text-dark-body">
          <div className="flex flex-col items-center gap-4">
            <p className="text-lg font-bold">You are signed in as:</p>
            <Image
              src={image}
              alt={name}
              width={64}
              height={64}
              className="rounded-full"
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

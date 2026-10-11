import { useState } from "react";

export default function ImageSlider(props) {

  const images = props.images || [];

  const [activeImage, setActiveImage] = useState(0);


  return (

    <div
      className="
        w-full
        max-w-[430px]
        flex
        flex-col
        gap-4
      "
    >


      {/* ================= MAIN IMAGE ================= */}

      <div
        className="
          relative
          w-full
          h-[520px]
          bg-[#f6ede2]
          rounded-[28px]
          overflow-hidden
          border-2
          border-[#d8c7ae]
          shadow-[0_18px_45px_rgba(91,26,43,0.18)]
          group
        "
      >

        <img
          src={images[activeImage]}
          alt="Product"
          className="
            w-full
            h-full
            object-cover
            transition-all
            duration-500
            group-hover:scale-105
          "
        />


        {/* IMAGE NUMBER */}

        <div
          className="
            absolute
            bottom-4
            right-4
            px-3
            py-1.5
            rounded-full
            bg-[#5b1a2b]/90
            text-[#f3d975]
            text-xs
            font-bold
            backdrop-blur-md
          "
        >
          {activeImage + 1} / {images.length}
        </div>

      </div>



      {/* ================= THUMBNAILS ================= */}

      <div
        className="
          w-full
          flex
          items-center
          gap-3
          overflow-x-auto
          pb-2
        "
      >

        {images.map((image, index) => (

          <img

            key={index}

            src={image}

            alt={`Product ${index + 1}`}

            onClick={() => {
              setActiveImage(index);
            }}

            className={`
              w-[82px]
              h-[82px]
              object-cover
              rounded-xl
              cursor-pointer
              border-2
              transition-all
              duration-300
              shrink-0

              ${
                activeImage === index
                  ? "border-[#d4af37] scale-105 shadow-[0_6px_16px_rgba(91,26,43,0.25)]"
                  : "border-[#e4d7c7] opacity-70 hover:opacity-100 hover:border-[#6b1d2f]"
              }
            `}
          />

        ))}

      </div>

    </div>

  );

}
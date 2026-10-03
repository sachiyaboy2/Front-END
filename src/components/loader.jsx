export function Loader() {
  return (
    <div
      className="
        w-full
        h-full
        min-h-[400px]
        flex
        flex-col
        justify-center
        items-center
        gap-5
      "
    >
      {/* LOADER */}
      <div className="relative w-20 h-20">
        {/* OUTER RING */}
        <div
          className="
            absolute
            inset-0
            rounded-full
            border-4
            border-[#e8d9c8]
          "
        ></div>

        {/* SPINNING RING */}
        <div
          className="
            absolute
            inset-0
            rounded-full
            border-4
            border-transparent
            border-t-[#6b1d2f]
            border-r-[#d4af37]
            animate-spin
          "
        ></div>

        {/* CENTER */}
        <div
          className="
            absolute
            inset-[12px]
            rounded-full
            bg-[#6b1d2f]
            flex
            items-center
            justify-center
            shadow-lg
          "
        >
          <span
            className="
              text-[#f3d975]
              text-sm
              font-black
            "
          >
            <img src="../logo.png" alt="Logo" />
          </span>
        </div>
      </div>

      {/* TEXT */}
      <div className="text-center">
        <h2
          className="
            text-[#5b1a2b]
            font-bold
            text-lg
          "
        >
          NariCraft
        </h2>

        <p
          className="
            text-[#8b7567]
            text-sm
            mt-1
          "
        >
          Loading...
        </p>
      </div>
    </div>
  );
}

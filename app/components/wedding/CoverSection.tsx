import { memo, useMemo } from "react";
import { PHOTO_URLS } from "./constants";
import { useFamilyContext } from "@/app/context/FamilyContext";
import Image from "next/image";

export const CoverSection = memo(function CoverSection() {
  const {guestSide, guestContext} = useFamilyContext()
  const imageSource = useMemo(() => {
    switch (guestSide) {
      case 'groom':
        return PHOTO_URLS[5]
        case 'bride':
          return PHOTO_URLS[18]
        default:
          return PHOTO_URLS[5]
    }
  }, [guestSide])
  return (
    <section className="cover-section">
      <Image
        src={imageSource}
        alt="Nam và Mai trong bộ ảnh cưới"
        fill
        priority
        unoptimized
        sizes="(max-width: 460px) 100vw, 460px"
      />
      <div className="cover-shade" />
      <div className="cover-copy">
        <p>We are getting married</p>
        <h1>
          <span>Nguyễn Thành Nam</span>
          <i>&amp;</i>
          <span>Ngô Tuyết Mai</span>
        </h1>
        <div className="cover-date numeric">{guestContext?.date.display}</div>
      </div>
      <a
        className="cover-scroll"
        href="#save-the-date"
        aria-label="Cuộn xuống xem thiệp"
      >
        <span>Scroll</span>
        <i>⌄</i>
      </a>
    </section>
  );
});

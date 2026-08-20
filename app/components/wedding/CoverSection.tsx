import { memo } from "react";
import { useFamilyContext } from "@/app/context/FamilyContext";
import Image from "next/image";

export const CoverSection = memo(function CoverSection() {
  const { guestContext } = useFamilyContext();
  const imageSource = guestContext?.coverImageUrl;
  return (
    <section className="cover-section">
      {imageSource && <Image
        src={imageSource}
        alt="Nam và Mai trong bộ ảnh cưới"
        fill
        priority
        unoptimized
        sizes="(max-width: 460px) 100vw, 460px"
      />}
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

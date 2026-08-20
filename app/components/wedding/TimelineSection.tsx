import { memo } from "react";
import Image from "next/image";
import { useFamilyContext } from "@/app/context/FamilyContext";
import { getCachedMediaUrl } from "./constants";

export const TimelineSection = memo(function TimelineSection() {
  const { guestContext } = useFamilyContext();
  const imageUrl = guestContext?.timelineImageUrl;
  return (
    <section className="timeline-section">
      {imageUrl && <Image
        className="timeline-photo"
        src={getCachedMediaUrl(imageUrl)}
        alt="Ảnh cưới Nam và Mai"
        width={920}
        height={1040}
        loading="lazy"
        unoptimized
      />}
      <div className="timeline-content scroll-reveal">
        <p className="micro-title light">Wedding timeline</p>
        <h2>Timeline</h2>
        <div className="timeline-list">
          <div>
            <time className="numeric">08:30</time>
            <span>Đón dâu tại Tư gia nhà gái</span>
          </div>
          <div>
            <time className="numeric">10:30</time>
            <span>Đón khách tại trung tâm tiệc cưới Tràng An Palace</span>
          </div>
          <div>
            <time className="numeric">11:00</time>
            <span>Khai tiệc</span>
          </div>
          <div>
            <time className="numeric">11:30</time>
            <span>Nâng ly chúc mừng</span>
          </div>
          <div>
            <time className="numeric">13:00</time>
            <span>Lưu giữ kỷ niệm</span>
          </div>
        </div>
      </div>
    </section>
  );
});

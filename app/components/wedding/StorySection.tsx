import { memo } from "react";
import Image from "next/image";
import { Botanical } from "./Botanical";
import { getCachedMediaUrl } from "./constants";
import { useFamilyContext } from "@/app/context/FamilyContext";

export const StorySection = memo(function StorySection() {
  const { guestContext } = useFamilyContext();
  const imageUrl = guestContext?.storyImageUrl;
  return (
    <section className="story-section">
      <Botanical className="story-leaf" />
      <div className="story-card scroll-reveal">
        <p className="micro-title light">Our story</p>
        <h2>
          Chuyện của
          <br />
          <i>chúng mình</i>
        </h2>
        <div className="story-photo">
          {imageUrl && <Image
            src={getCachedMediaUrl(imageUrl)}
            alt="Khoảnh khắc của Nam và Mai"
            width={800}
            height={1000}
            loading="lazy"
            unoptimized
          />}
          <span>Nam &amp; Mai</span>
        </div>
        <p>
          Giữa muôn vàn cuộc gặp gỡ, chúng mình đã tìm thấy nhau — và chọn cùng
          nhau đi hết hành trình phía trước.
        </p>
        <p>
          Với tất cả niềm vui và sự trân trọng, chúng mình thân mời bạn đến
          chung vui trong ngày thành hôn. Sự hiện diện của bạn là món quà ý
          nghĩa nhất.
        </p>
      </div>
    </section>
  );
});

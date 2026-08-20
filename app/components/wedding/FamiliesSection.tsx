import { memo } from "react";
import Image from "next/image";
import { PHOTO_URLS } from "./constants";

export const FamiliesSection = memo(function FamiliesSection() {
  return (
    <section className="families-section paper-section">
      <div className="section-heading scroll-reveal">
        <p className="micro-title">Trân trọng báo tin</p>
        <h2>Wedding Day</h2>
        <p>Hai gia đình chúng tôi hân hoan báo tin lễ thành hôn của hai con</p>
      </div>
      <div className="portrait-stack scroll-reveal">
        <article className="portrait-card">
          <Image
            src={PHOTO_URLS[8]}
            alt="Chú rể Nguyễn Thành Nam"
            width={800}
            height={1000}
            loading="lazy"
            unoptimized
          />
          <div>
            <span>Chú rể</span>
            <h3>Nguyễn Thành Nam</h3>
          </div>
        </article>
        <article className="portrait-card offset" style={{
          margin: 0
        }}>
          <Image
            src={PHOTO_URLS[7]}
            alt="Cô dâu Ngô Tuyết Mai"
            width={800}
            height={1000}
            loading="lazy"
            unoptimized
          />
          <div>
            <span>Cô dâu</span>
            <h3>Ngô Tuyết Mai</h3>
          </div>
        </article>
      </div>
      <div className="parent-grid scroll-reveal">
        <article>
          <p>Nhà trai</p>
          <span>Ông</span>
          <strong>Nguyễn Mạnh Hồng</strong>
          <span>Bà</span>
          <strong>Chu Thị Tám</strong>
        </article>
        <article>
          <p>Nhà gái</p>
          <span>Ông</span>
          <strong>Ngô Văn Đắc</strong>
          <span>Bà</span>
          <strong>Nguyễn Thị Hồng Phương</strong>
        </article>
      </div>
    </section>
  );
});

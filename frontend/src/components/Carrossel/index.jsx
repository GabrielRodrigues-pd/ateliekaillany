import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import OptimizedImage from "../OptimizedImage";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

import "./Carrossel.css";

export default function Carrossel({ items }) {
  // Swiper handles loop internally. No need to triplicate items manually unless the count is very small (< 4).
  // With 15 items confirmed, the normal items array is perfect.
  const safeItems = items && items.length > 0 ? items : [];

  return (
    <div className="carousel-wrapper">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 15,
          stretch: 0,
          depth: 250,
          modifier: 1.5,
          slideShadows: true,
        }}
        autoplay={{ 
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ 
          clickable: true,
          dynamicBullets: true 
        }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="creations-swiper"
      >
        {safeItems.map((item, index) => (
          <SwiperSlide key={`${item.title}-${index}`} className="creation-slide">
            <div className="creative-card">
              <div className="card-image-wrapper">
                <OptimizedImage 
                  src={item.image} 
                  alt={item.altText || item.title} 
                />
                <div className="card-overlay">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

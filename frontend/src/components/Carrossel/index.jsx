import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectCoverflow } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

import "./Carrossel.css";

export default function Carrossel({ items }) {
  // Duplicating items to ensure infinite loop always has enough cards, even if `items` array is small
  const safeItems = items && items.length > 0 ? [...items, ...items, ...items] : [];

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
                <img src={item.image} alt={item.altText || item.title} />
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

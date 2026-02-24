import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./Carrossel.css";

export default function Carrossel({ items }) {
  return (
    <div className="carousel-wrapper">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={24}
        loop={true}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="card">
              <img src={item.image} alt={item.title} />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

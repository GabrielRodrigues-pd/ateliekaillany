import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import CardsTestimon from "../CardsTestimon";
import "./Testimonials.css";

const testimonialsData = [
  {
    id: 1,
    descri: "Esses ovos têm gosto de terem sido feitos por alguém que realmente se importa com chocolate.",
    name: "Maria Santos",
    subTexto: "Food enthusiast, São Paulo"
  },
  {
    id: 2,
    descri: "Já provei chocolate em três continentes. Este é o verdadeiro chocolate.",
    name: "James Mitchell",
    subTexto: "Chef, Melbourne"
  },
  {
    id: 3,
    descri: "A atenção aos detalhes em cada ovo é evidente. Vale cada mordida.",
    name: "Ana Costa",
    subTexto: "Restaurant owner, Rio"
  },
  {
    id: 4,
    descri: "Simplesmente divino! A melhor experiência de chocolate que eu já tive na vida, recomendo muito.",
    name: "Lucas Pereira",
    subTexto: "Blogger, Curitiba"
  }
];

export default function Testimonials() {
  // Duplicating the data to ensure Swiper always has enough slides to loop without breaking
  const allTestimonials = [...testimonialsData, ...testimonialsData];

  return (
    <section className="testimonials" id="avaliacoes">
      <div className="container testimonials-header">
        <span className="testimonials-subtitle">DEPOIMENTOS</span>
        <h2>O que os nossos clientes dizem!</h2>
      </div>

      <div className="container testimonials-slider-container">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          centeredSlides={true}
          loop={true}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="testimonials-swiper"
        >
          {allTestimonials.map((item, index) => (
            <SwiperSlide key={`${item.id}-${index}`}>
              <CardsTestimon
                descri={item.descri}
                name={item.name}
                subTexto={item.subTexto}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

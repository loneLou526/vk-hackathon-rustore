import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

import type { IApp } from '../types/app';
import { Link } from 'react-router-dom';

interface AppCarouselProps {
  apps?: IApp[];
}

export const AppCarousel = ({ apps }: AppCarouselProps) => {
  if (!apps || apps.length === 0) {
    return (
        <div className="mb-12 aspect-[16/7] bg-gray-800 rounded-2xl animate-pulse"></div>
    );
  }

  const bannerApps = apps.slice(0, 5);

  return (
    <div className="mb-12 relative group">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade, Navigation]}
        effect="fade"
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }}
        className="rounded-2xl"
      >
        <SwiperSlide>
            <Link to="/wheel">
              <div className="relative aspect-[16/7] bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 flex items-center p-8 md:p-12">
                  <div className="w-full text-center">
                      <h2 className="text-4xl font-black text-white uppercase tracking-wider">Колесо Удачи</h2>
                      <p className="text-lg text-white/80 mt-2">Крути и выигрывай призы от VK Музыки и партнеров!</p>
                  </div>
                </div>
              </div>
            </Link>
        </SwiperSlide>

        {bannerApps.map(app => (
          <SwiperSlide key={app.id}>
            <Link to={`/apps/${app.id}`}>
              <div className="relative aspect-[16/7] bg-gray-800 rounded-2xl overflow-hidden group">
                <img src={app.screenshots.split(',')[0]} alt={app.name} className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"/>
                <div className="absolute inset-0 flex items-center p-8 md:p-12">
                  <div className="w-full md:w-1/2 flex items-center gap-8">
                    <img src={app.icon_url} alt="" className="w-24 h-24 md:w-32 md:h-32 rounded-3xl flex-shrink-0 shadow-2xl" />
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-white line-clamp-2">{app.name}</h2>
                      <p className="text-base md:text-lg text-gray-300 mt-2 line-clamp-2">{app.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="swiper-button-prev absolute top-1/2 -translate-y-1/2 left-4 z-10 p-2 rounded-full bg-black/20 text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="swiper-button-next absolute top-1/2 -translate-y-1/2 right-4 z-10 p-2 rounded-full bg-black/20 text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
};
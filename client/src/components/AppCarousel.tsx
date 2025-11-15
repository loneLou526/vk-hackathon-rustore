import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

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
    <div className="mb-12">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        className="rounded-2xl"
      >
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
    </div>
  );
};
import random
from app.database import SessionLocal, engine
from app.models import App, Base

# Мы заменяем генератор на статический, но реалистичный список реальных приложений
real_apps_data = [
    # --- Соцсети и общение ---
    {
        "name": "ВКонтакте", "description": "Самая популярная соцсеть и суперапп с музыкой, видео, мессенджером.", "category": "Общение",
        "developer": "VK", "age_rating": "12+", "icon_url": "https://i.ibb.co/b3xJ8xY/vk-logo.png",
        "screenshots": "https://i.ibb.co/GQLSCDm/vk-sc-1.jpg,https://i.ibb.co/gDBf57g/vk-sc-2.jpg"
    },
    {
        "name": "Telegram", "description": "Быстрый и безопасный мессенджер с расширенными возможностями.", "category": "Общение",
        "developer": "Telegram FZ-LLC", "age_rating": "16+", "icon_url": "https://i.ibb.co/tLWV3j3/telegram-logo.png",
        "screenshots": "https://i.ibb.co/mXTgDZT/telegram-sc-1.jpg,https://i.ibb.co/Jz61Qyq/telegram-sc-2.jpg"
    },
    # --- Финансы ---
    {
        "name": "СберБанк Онлайн", "description": "Управляйте своими финансами, картами и кредитами.", "category": "Финансы",
        "developer": "Sber", "age_rating": "18+", "icon_url": "https://i.ibb.co/d0KXY6F/sber-logo.png",
        "screenshots": "https://i.ibb.co/gvpF5Bw/fin-sc-1.jpg,https://i.ibb.co/5cQwn03/fin-sc-2.jpg"
    },
    {
        "name": "Т-Банк", "description": "Современный мобильный банк, инвестиции и другие финансовые услуги.", "category": "Финансы",
        "developer": "Tinkoff", "age_rating": "18+", "icon_url": "https://i.ibb.co/GWHy8qP/tinkoff-logo.png",
        "screenshots": "https://i.ibb.co/gvpF5Bw/fin-sc-1.jpg,https://i.ibb.co/5cQwn03/fin-sc-2.jpg"
    },
    {
        "name": "Альфа-Банк", "description": "Мобильный банк с удобным интерфейсом и персональными предложениями.", "category": "Финансы",
        "developer": "Alfa-Bank", "age_rating": "18+", "icon_url": "https://i.ibb.co/yQFcL12/alfa-logo.png",
        "screenshots": "https://i.ibb.co/gvpF5Bw/fin-sc-1.jpg,https://i.ibb.co/5cQwn03/fin-sc-2.jpg"
    },
    # --- Развлечения и медиа ---
    {
        "name": "Кинопоиск", "description": "Смотрите фильмы и сериалы по подписке, читайте отзывы и рецензии.", "category": "Развлечения",
        "developer": "Yandex", "age_rating": "18+", "icon_url": "https://i.ibb.co/7j5xLxg/kinopoisk-logo.png",
        "screenshots": "https://i.ibb.co/P9zPj0P/kino-sc-1.jpg,https://i.ibb.co/Gvy1S5s/kino-sc-2.jpg"
    },
    {
        "name": "Яндекс Музыка", "description": "Миллионы треков, подкасты и персональные рекомендации.", "category": "Музыка",
        "developer": "Yandex", "age_rating": "12+", "icon_url": "https://i.ibb.co/VMyhGfZ/yandex-music-logo.png",
        "screenshots": "https://i.ibb.co/bFqYy43/music-sc-1.jpg,https://i.ibb.co/fnyN2bQ/music-sc-2.jpg"
    },
    {
        "name": "Rutube", "description": "Российский видеохостинг с фильмами, сериалами и блогерами.", "category": "Развлечения",
        "developer": "Rutube", "age_rating": "16+", "icon_url": "https://i.ibb.co/L57G01F/rutube-logo.png",
        "screenshots": "https://i.ibb.co/P9zPj0P/kino-sc-1.jpg,https://i.ibb.co/Gvy1S5s/kino-sc-2.jpg"
    },
    {
        "name": "Okko", "description": "Онлайн-кинотеатр с огромной коллекцией фильмов и сериалов.", "category": "Развлечения",
        "developer": "Okko", "age_rating": "18+", "icon_url": "https://i.ibb.co/zXqGvFm/okko-logo.png",
        "screenshots": "https://i.ibb.co/P9zPj0P/kino-sc-1.jpg,https://i.ibb.co/Gvy1S5s/kino-sc-2.jpg"
    },
    {
        "name": "ЛитРес", "description": "Читайте и слушайте книги онлайн. Более миллиона электронных книг.", "category": "Книги",
        "developer": "Litres", "age_rating": "12+", "icon_url": "https://i.ibb.co/Zc29T8T/litres-logo.png",
        "screenshots": "https://i.ibb.co/8Yn4bWx/lit-sc-1.jpg,https://i.ibb.co/Jc26tPT/lit-sc-2.jpg"
    },
    # --- Покупки и сервисы ---
    {
        "name": "Ozon", "description": "Один из крупнейших интернет-магазинов в России.", "category": "Покупки",
        "developer": "Ozon", "age_rating": "0+", "icon_url": "https://i.ibb.co/dK2cZ5C/ozon-logo.png",
        "screenshots": "https://i.ibb.co/2Z55HwP/shop-sc-1.jpg,https://i.ibb.co/D57Xz1b/shop-sc-2.jpg"
    },
    {
        "name": "Wildberries", "description": "Популярный маркетплейс одежды, электроники и товаров для дома.", "category": "Покупки",
        "developer": "Wildberries", "age_rating": "0+", "icon_url": "https://i.ibb.co/VwLzVzJ/wildberries-logo.png",
        "screenshots": "https://i.ibb.co/2Z55HwP/shop-sc-1.jpg,https://i.ibb.co/D57Xz1b/shop-sc-2.jpg"
    },
    {
        "name": "Авито", "description": "Сервис объявлений о товарах, работе и услугах.", "category": "Покупки",
        "developer": "Avito", "age_rating": "12+", "icon_url": "https://i.ibb.co/zH8zQ8R/avito-logo.png",
        "screenshots": "https://i.ibb.co/2Z55HwP/shop-sc-1.jpg,https://i.ibb.co/D57Xz1b/shop-sc-2.jpg"
    },
    # --- Транспорт и карты ---
    {
        "name": "Яндекс Go", "description": "Заказ такси, доставка еды и продуктов, каршеринг и расписание транспорта.", "category": "Транспорт",
        "developer": "Yandex", "age_rating": "12+", "icon_url": "https://i.ibb.co/tBT0fWf/yandex-go-logo.png",
        "screenshots": "https://i.ibb.co/yY1h52w/map-sc-1.jpg,https://i.ibb.co/K2T0M1v/map-sc-2.jpg"
    },
    {
        "name": "Яндекс Карты", "description": "Стройте маршруты, находите места и следите за пробками.", "category": "Транспорт",
        "developer": "Yandex", "age_rating": "0+", "icon_url": "https://i.ibb.co/hK5bF2N/yandex-maps-logo.png",
        "screenshots": "https://i.ibb.co/yY1h52w/map-sc-1.jpg,https://i.ibb.co/K2T0M1v/map-sc-2.jpg"
    },
    {
        "name": "2ГИС", "description": "Подробный справочник организаций с 3D-картой города.", "category": "Транспорт",
        "developer": "2GIS", "age_rating": "0+", "icon_url": "https://i.ibb.co/RzM6R2X/2gis-logo.png",
        "screenshots": "https://i.ibb.co/yY1h52w/map-sc-1.jpg,https://i.ibb.co/K2T0M1v/map-sc-2.jpg"
    },
    # --- Государственные сервисы ---
    {
        "name": "Госуслуги", "description": "Государственные услуги и сервисы: запись к врачу, оплата штрафов.", "category": "Государственные",
        "developer": "Минцифры России", "age_rating": "18+", "icon_url": "https://i.ibb.co/GQLF6Tz/gosuslugi-logo.png",
        "screenshots": "https://i.ibb.co/wJ1hCyW/gos-sc-1.jpg,https://i.ibb.co/wYV3M2p/gos-sc-2.jpg"
    },
    # --- Игры ---
    {
        "name": "Tanks Blitz", "description": "Динамичные танковые сражения 7 на 7.", "category": "Игры",
        "developer": "Lesta Games", "age_rating": "12+", "icon_url": "https://i.ibb.co/Jpx4H1h/tanks-blitz-logo.png",
        "screenshots": "https://i.ibb.co/JqKkZp0/game-sc-1.jpg,https://i.ibb.co/Y0Wf90v/game-sc-2.jpg"
    },
    {
        "name": "Мир танков", "description": "Масштабные танковые онлайн-баталии.", "category": "Игры",
        "developer": "Lesta Games", "age_rating": "12+", "icon_url": "https://i.ibb.co/k27P9Xg/mir-tankov-logo.png",
        "screenshots": "https://i.ibb.co/JqKkZp0/game-sc-1.jpg,https://i.ibb.co/Y0Wf90v/game-sc-2.jpg"
    },
    # --- Инструменты ---
    {
        "name": "МойОфис Документы", "description": "Редактируйте тексты, таблицы и презентации. Российский аналог MS Office.", "category": "Инструменты",
        "developer": "МойОфис", "age_rating": "0+", "icon_url": "https://i.ibb.co/fMLzYnS/myoffice-logo.png",
        "screenshots": "https://i.ibb.co/FWSVnKy/myoffice-sc-1.jpg,https://i.ibb.co/3k5r01g/myoffice-sc-2.jpg"
    },
    {
        "name": "Яндекс Диск", "description": "Храните файлы в облаке и получайте к ним доступ с любого устройства.", "category": "Инструменты",
        "developer": "Yandex", "age_rating": "0+", "icon_url": "https://i.ibb.co/hD5cphH/yandex-disk-logo.png",
        "screenshots": "https://i.ibb.co/FWSVnKy/myoffice-sc-1.jpg,https://i.ibb.co/3k5r01g/myoffice-sc-2.jpg"
    },
    {
        "name": "Kaspersky Antivirus", "description": "Надежная защита вашего устройства от вирусов и угроз.", "category": "Инструменты",
        "developer": "Kaspersky", "age_rating": "0+", "icon_url": "https://i.ibb.co/sKqS0nJ/kaspersky-logo.png",
        "screenshots": "https://i.ibb.co/FWSVnKy/myoffice-sc-1.jpg,https://i.ibb.co/3k5r01g/myoffice-sc-2.jpg"
    },
]

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # db.query(App).delete()
        print("Старые данные удалены...")

        apps_to_add = []
        for app_data in real_apps_data:
            # Добавляем случайный рейтинг к каждому реальному приложению
            app_data_with_rating = {**app_data, "rating": round(random.uniform(4.0, 4.9), 1)}
            apps_to_add.append(App(**app_data_with_rating))

        print(f"Подготовлено {len(apps_to_add)} реальных приложений...")

        db.add_all(apps_to_add)
        db.commit()
        print("✅ База данных успешно наполнена реалистичными данными!")
    except Exception as e:
        print(f"Произошла ошибка: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
from app.database import SessionLocal, engine
from app.models import App, Base

# Создаем таблицsесли их вдруг нет)
Base.metadata.create_all(bind=engine)

# Получаем сессию для работы с БД
db = SessionLocal()

# --- Тестовые данные ---
apps_to_add = [
    App(
        name="VK",
        description="Самая популярная соцсеть и суперапп.",
        category="Общение",
        developer="VK",
        age_rating="12+",
        icon_url="https://i.postimg.cc/x8g5M4bM/vk-logo.png",
        screenshots="https://i.postimg.cc/d14G1t8X/vk-sc-1.jpg,https://i.postimg.cc/zX83VfJp/vk-sc-2.jpg"
    ),
    App(
        name="Госуслуги",
        description="Все государственные услуги в одном приложении.",
        category="Государственные",
        developer="Минцифры России",
        age_rating="18+",
        icon_url="https://i.postimg.cc/13Y1t25f/gosuslugi-logo.png",
        screenshots="https://i.postimg.cc/tJd2T1qW/gos-sc-1.jpg,https://i.postimg.cc/W12F9v2z/gos-sc-2.jpg"
    ),
    App(
        name="Яндекс Карты",
        description="Навигатор, карты и транспорт.",
        category="Транспорт",
        developer="Яндекс",
        age_rating="0+",
        icon_url="https://i.postimg.cc/B6CMk0J9/yandex-maps-logo.png",
        screenshots="https://i.postimg.cc/mkb7sY0R/map-sc-1.jpg,https://i.postimg.cc/x8v1kP9T/map-sc-2.jpg"
    ),
    App(
        name="Tinkoff",
        description="Мобильный банк для ваших финансов.",
        category="Финансы",
        developer="Tinkoff",
        age_rating="12+",
        icon_url="https://i.postimg.cc/NfHPc2G3/tinkoff-logo.png",
        screenshots="https://i.postimg.cc/6pD2zWb7/fin-sc-1.jpg,https://i.postimg.cc/Y0PZkKcP/fin-sc-2.jpg"
    ),
    App(
        name="Code Editor",
        description="Редактор кода для программистов.",
        category="Инструменты",
        developer="Rhythm Software",
        age_rating="0+",
        icon_url="https://i.postimg.cc/yYxBYRkK/code-editor.png",
        screenshots="https://i.postimg.cc/N0Kz7sJb/code-sc-1.jpg"
    ),
    App(
        name="Shadow Fight 4: Arena",
        description="Захватывающий файтинг с крутой графикой.",
        category="Игры",
        developer="Nekki",
        age_rating="12+",
        icon_url="https://i.postimg.cc/y8Y9Y9xW/shadow-fight-logo.png",
        screenshots="https://i.postimg.cc/YqH01f7T/game-sc-1.jpg,https://i.postimg.cc/mkGv3z1x/game-sc-2.jpg"
    ),
]


# Очищаем таблицу перед добавлением
db.query(App).delete()

# Добавляем данные
db.add_all(apps_to_add)
db.commit()

print("✅ База данных успешно наполнена тестовыми данными!")

db.close()
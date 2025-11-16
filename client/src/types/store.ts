export interface IStoreItem {
  id: number;
  name: string;
  description: string;
  price: number;       // Стоимость в Пикселях
  image_url?: string;  // Картинка (может быть undefined)
}

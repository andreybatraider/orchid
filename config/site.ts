export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "ORCHIDCUP",
  description: "Делаем киберспорт",
  navItems: [
    {
      label: "Турниры",
      href: "/tournament",
    },
    {
      label: "Архив турниров",
      href: "/portfolio",
    },
    {
      label: "Услуги",
      href: "/price",
    },
    {
      label: "О нас",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Турниры",
      href: "/tournament",
    },
    {
      label: "Архив турниров",
      href: "/portfolio",
    },
    {
      label: "Услуги",
      href: "/price",
    },
    {
      label: "О нас",
      href: "/about",
    },
    {
      label: "Наш Вконтакте",
      href: "https://vk.com/orchidcybercup",
    },
    {
      label: "Телеграм",
      href: "https://t.me/OrchidCUP",
    }
  ]
};

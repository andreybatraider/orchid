'use client';

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useEffect, useState } from "react";

import { siteConfig } from "@/config/site";

interface SiteSettings {
  socialLinks: {
    youtube: string;
    twitch: string;
    vk: string;
    telegram: string;
    discord: string;
    contactUs: string;
  };
}

export const Navbar = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  // Используем настройки из базы или дефолтные значения
  const socialLinks = settings?.socialLinks || {
    youtube: 'https://www.youtube.com/@ORCHIDCUP',
    twitch: 'https://www.twitch.tv/orchidcup',
    vk: 'https://vk.com/orchidcybercup',
    telegram: 'https://t.me/orchidcup',
    discord: '',
    contactUs: 'https://t.me/ORCHIDORG',
  };

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <svg width="150" height="195" viewBox="0 0 818 195" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M724.044 137.5V57.1151H785.339C807.764 57.1151 817.654 65.5101 817.654 88.2801V105.185C817.654 127.15 810.639 137.5 788.214 137.5H724.044ZM745.434 74.7101V120.02H784.879C792.814 120.02 795.574 114.73 795.574 106.335V87.2451C795.574 76.7801 792.239 74.7101 784.764 74.7101H745.434Z" fill="white" />
              <path d="M705.681 137.615H684.291V57.1151H705.681V137.615Z" fill="white" />
              <path d="M644.423 57.1151H665.813V137.615H644.423V106.105H593.938V137.615H572.548V57.1151H593.938V88.6251H644.423V57.1151Z" fill="white" />
              <path d="M491.437 57.1151H555.262V85.9801H533.872V74.7101H494.772C486.837 74.7101 484.077 80.0001 484.077 88.3951V107.485C484.077 117.835 487.412 120.02 494.887 120.02H533.872V108.635H555.262V137.615H494.312C471.887 137.615 461.997 129.22 461.997 106.335V89.5451C461.997 67.4651 469.012 57.1151 491.437 57.1151Z" fill="white" />
              <path d="M446.803 101.275C445.538 109.555 442.318 114.845 435.763 117.605L447.493 137.615H423.228L412.993 120.02H375.618V137.5H354.228V57.1151H420.123C436.108 57.1151 444.158 61.9451 446.688 74.7101C447.263 77.8151 447.493 84.1401 447.493 88.0501C447.493 91.8451 447.378 97.8251 446.803 101.275ZM375.618 74.7101V101.39H418.168C422.193 101.39 425.413 98.0551 425.413 94.1451V81.9551C425.413 77.9301 422.193 74.7101 418.168 74.7101H375.618Z" fill="white" />
              <path d="M308.205 57.1151C330.63 57.1151 337.645 67.4651 337.645 89.5451V106.335C337.645 129.22 327.64 137.5 305.215 137.5H275.315C252.89 137.5 243 129.22 243 106.335V89.5451C243 67.4651 250.015 57.1151 272.44 57.1151H308.205ZM315.565 107.485V88.3951C315.565 79.8851 312.805 74.7101 304.87 74.7101H275.775C267.84 74.7101 265.08 79.8851 265.08 88.3951V107.485C265.08 117.835 268.415 120.02 275.89 120.02H304.755C312.23 120.02 315.565 117.835 315.565 107.485Z" fill="white" />
              <path d="M0 140.486L1.08956 53.4458L94.2871 113.254L94.2871 38.9391L157.315 0V91.8759L94.2871 134.887V195L0 140.486Z" fill="#FF2F71" />
              <path d="M207 140.486L205.91 53.4458L112.713 113.254V38.9391L49.6855 0L49.6855 91.8759L112.713 134.887V195L207 140.486Z" fill="#FF2F71" />
            </svg>
            <p className="font-bold text-inherit"></p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex items-center gap-3">
          {/* Социальные кнопки - показываем только если ссылки не пустые */}
          {socialLinks.youtube && (
            <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center hover:opacity-80 transition-opacity" style={{ width: '24px', height: '24px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 15L15.19 12L10 9V15ZM21.56 7.17C21.69 7.64 21.78 8.27 21.84 9.07C21.91 9.87 21.94 10.56 21.94 11.16L22 12C22 14.19 21.84 15.8 21.56 16.83C21.31 17.73 20.73 18.31 19.83 18.56C19.36 18.69 18.5 18.78 17.18 18.84C15.88 18.91 14.69 18.94 13.59 18.94L12 19C7.81 19 5.2 18.84 4.17 18.56C3.27 18.31 2.69 17.73 2.44 16.83C2.31 16.36 2.22 15.73 2.16 14.93C2.09 14.13 2.06 13.44 2.06 12.84L2 12C2 9.81 2.16 8.2 2.44 7.17C2.69 6.27 3.27 5.69 4.17 5.44C4.64 5.31 5.5 5.22 6.82 5.16C8.12 5.09 9.31 5.06 10.41 5.06L12 5C16.19 5 18.8 5.16 19.83 5.44C20.73 5.69 21.31 6.27 21.56 7.17Z" fill="white" />
              </svg>
            </a>
          )}
          {socialLinks.twitch && (
            <a href={socialLinks.twitch} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center hover:opacity-80 transition-opacity" style={{ width: '24px', height: '24px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.6399 5.93H13.0699V10.21H11.6399M15.5699 5.93H16.9999V10.21H15.5699M6.99993 2L3.42993 5.57V18.43H7.70993V22L11.2899 18.43H14.1399L20.5699 12V2M19.1399 11.29L16.2899 14.14H13.4299L10.9299 16.64V14.14H7.70993V3.43H19.1399V11.29Z" fill="white" />
              </svg>
            </a>
          )}
          {socialLinks.vk && (
            <a href={socialLinks.vk} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center hover:opacity-80 transition-opacity" style={{ width: '24px', height: '24px' }}>
              <svg width="24" height="24" viewBox="0 0 21 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '24px', height: '24px' }}>
                <path d="M19.579 0.806C19.719 0.341 19.579 0 18.917 0H16.724C16.166 0 15.911 0.295 15.771 0.619C15.771 0.619 14.656 3.338 13.076 5.101C12.566 5.614 12.333 5.776 12.055 5.776C11.916 5.776 11.714 5.614 11.714 5.149V0.806C11.714 0.248 11.553 0 11.088 0H7.642C7.294 0 7.084 0.258 7.084 0.504C7.084 1.032 7.874 1.154 7.955 2.642V5.87C7.955 6.577 7.828 6.706 7.548 6.706C6.805 6.706 4.997 3.977 3.924 0.853C3.715 0.246 3.504 0.0010004 2.944 0.0010004H0.752C0.125 0.0010004 0 0.296 0 0.62C0 1.202 0.743 4.082 3.461 7.891C5.273 10.492 7.824 11.902 10.148 11.902C11.541 11.902 11.713 11.589 11.713 11.049V9.083C11.713 8.457 11.846 8.331 12.287 8.331C12.611 8.331 13.169 8.495 14.47 9.748C15.956 11.234 16.202 11.901 17.037 11.901H19.229C19.855 11.901 20.168 11.588 19.988 10.97C19.791 10.355 19.081 9.46 18.139 8.401C17.627 7.797 16.862 7.147 16.629 6.822C16.304 6.403 16.398 6.218 16.629 5.846C16.63 5.847 19.301 2.085 19.579 0.806Z" fill="white" />
              </svg>
            </a>
          )}
          {socialLinks.telegram && (
            <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center hover:opacity-80 transition-opacity" style={{ width: '24px', height: '24px' }}>
              <svg width="24" height="24" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '24px', height: '24px' }}>
                <path d="M13.7217 0.105948C13.7217 0.105948 15.1092 -0.413478 14.9931 0.847888C14.9549 1.36731 14.6081 3.18548 14.3381 5.15176L13.4131 10.9769C13.4131 10.9769 13.3359 11.8302 12.642 11.9787C11.9484 12.1268 10.9077 11.4593 10.7148 11.3108C10.5606 11.1994 7.82411 9.52968 6.86053 8.71368C6.59052 8.49083 6.28195 8.0458 6.8991 7.52637L10.9463 3.81599C11.4088 3.37028 11.8713 2.33142 9.94413 3.59313L4.54765 7.11769C4.54765 7.11769 3.93086 7.489 2.77477 7.15506L0.269036 6.41278C0.269036 6.41278 -0.655973 5.85632 0.924399 5.29987C4.77908 3.55611 9.52019 1.77531 13.7213 0.105605" fill="white" />
              </svg>
            </a>
          )}
          {socialLinks.discord && (
            <a href={socialLinks.discord} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center hover:opacity-80 transition-opacity" style={{ width: '24px', height: '24px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" fill="white" />
              </svg>
            </a>
          )}
          {socialLinks.contactUs && (
            <Button
              as="a"
              className="text-sm rounded-none text-white font-bold bg-[#FF2F71] ml-2"
              href={socialLinks.contactUs}
              target="_blank"
              rel="noopener noreferrer"
              variant="flat"
            >
              Написать нам
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.href}-${index}`}>
              <Link
                color="foreground"
                href={item.href}
                size="lg"
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};

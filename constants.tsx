
import { Achievement, Alliance, RankRequirement, Car } from './types';

export const ACHIEVEMENTS: Achievement[] = [
  { name: 'Oliver_Wellow', org: 'Правительство', rank: 'Губернатор x2' },
  { name: 'Pablo Desparo', org: 'Правительство', rank: 'Губернатор' },
  { name: 'Wesley Evers', org: 'Правительство', rank: 'Губернатор' },
  { name: 'Geo_Escalante', org: 'Правительство', rank: 'Губернатор' },
  { name: 'Pablo Desparo', org: 'Правительство', rank: 'Заместитель Губернатора' },
  { name: 'Wesley Evers', org: 'Правительство', rank: 'Заместитель Губернатора' },
  { name: 'Geo_Escalante', org: 'Правительство', rank: 'Заместитель Губернатора' },
  { name: 'Oliver_Wellow', org: 'Правительство', rank: 'Министр Юстиции x5' },
  { name: 'Pablo Desparo', org: 'Правительство', rank: 'Министр Здравоохранения x3' },
  { name: 'Leonardo_Dumbledore', org: 'Правительство', rank: 'Министр Здравоохранения' },
  { name: 'Wesley Evers', org: 'Правительство', rank: 'Министр Обороны' },
  { name: 'Anastasia_Wellow', org: 'Правительство', rank: 'Министр Юстиции' },
  { name: 'Michael Carrington', org: 'Правительство', rank: 'Министр Юстиции' },
  { name: 'mita markless', org: 'Правительство', rank: 'Министр Обороны' },
  { name: 'Choppy Kennedy', org: 'Правительство', rank: 'Министр Обороны' },
  { name: 'Choppy Kennedy', org: 'FDCR', rank: 'Начальник ФДКР' },
  { name: 'Choppy Kennedy', org: 'Medical Center SF', rank: 'Главный Врач' },
  { name: 'Jackson Russell', org: 'Medical Center SF', rank: 'Главный Врач' },
  { name: 'Ivan Bennet', org: 'Groove Street', rank: 'Mad Dog (Лидер)' },
  { name: 'Sweet Smaxwood', org: 'Varios Los Actecas', rank: 'Padre (Лидер)' },
  { name: 'Pablo Desparo', org: 'Medical Center LS', rank: 'Заместитель Главного Врача' },
  { name: 'Oliver_Wellow', org: 'Admins Team', rank: 'Администратор сервера' },
  { name: 'Pablo Desparo', org: 'Admins Team', rank: 'Администратор сервера' },
  { name: 'Mitchel Gold', org: 'Admins Team', rank: 'Администратор сервера' },
  { name: 'Emilio_Escobar', org: 'Admins Team', rank: 'Администратор сервера' },
  { name: 'Night_Kvinton', org: 'LVPD', rank: 'Шеф Департамента' },
  { name: 'Vova Grimshade', org: 'LSPD', rank: 'Шеф Департамента' },
  { name: 'Mitchel Gold', org: 'LSPD', rank: 'Шеф Департамента' },
  { name: 'Richard_Opium', org: 'LSPD', rank: 'Шеф Департамента' },
  { name: 'Richard_Opium', org: 'LSPD', rank: 'Заместитель Шефа' },
  { name: 'Night_Kvinton', org: 'LVPD', rank: 'Заместитель Шефа' },
  { name: 'Anastasia_Wellow', org: 'LVPD', rank: 'Заместитель Шефа' },
  { name: 'Leonardo_Dumbledore', org: 'Yakuza Mafia', rank: 'Вакагасира (Зам)' },
  { name: 'Katsuro_Hiriko', org: 'Yakuza Mafia', rank: 'Вакагасира (Зам)' },
  { name: 'Ermolay_Sokolov', org: 'Russian Mafia', rank: 'Заместитель Директора' },
];

export const ALLIANCES: Alliance[] = [
  { name: 'Berzloy Inc', date: '18.06.2023' },
  { name: 'Dark Sky', date: '19.07.2025' },
  { name: 'Military Professional Resources Incorporated', date: '08.03.2025' },
  { name: 'Pipich Alliance', date: '26.05.2025' },
  { name: 'Lucchese Mafia', date: '13.08.2025' },
  { name: 'Quinn Dynasty', date: '24.11.2025' },
  { name: 'Septes', date: '12.01.2026' },
];

export const RANKS: RankRequirement[] = [
  {
    id: 1,
    title: 'Кандидат [1]',
    nextTitle: 'Аналитик [2]',
    requirements: [
      'Положить в банк семьи 10.000$ (screen + /stime)',
      'Лицензия на оружие и права на машину',
      'Положить 60 грамм чая на склад',
      'Вступить в Discord или Telegram семьи'
    ]
  },
  {
    id: 2,
    title: 'Аналитик [2]',
    nextTitle: 'Представитель [3]',
    requirements: [
      'Положить в банк семьи 30.000$ (screen + /stime)',
      'Положить 120 грамм чая на склад (screen + /stime)'
    ]
  },
  {
    id: 3,
    title: 'Представитель [3]',
    nextTitle: 'Семейный Юрист [4]',
    requirements: [
      'Положить в банк семьи 65.000$ (screen + /stime)',
      'Положить на склад семьи 150 грамм чая',
      'Доверенность от руководства'
    ]
  },
  {
    id: 4,
    title: 'Семейный Юрист [4]',
    nextTitle: 'Политик [5]',
    requirements: [
      'Положить 100.000$ в банк семьи (screen + /stime)',
      'Положить на склад семьи 170 грамм чая',
      'Сменить фамилию на "Wellow"',
      'Доверенность от руководства'
    ]
  }
];

export const FLEET: Car[] = [
  { name: 'BMW M5 F90', price: '10.500.000$' },
  { name: 'Lamborghini Urus', price: '18.000.000$' },
  { name: 'Mercedes-Benz G65', price: '10.000.000$' },
  { name: 'Lamborghini Huracan', price: '25.700.000$' },
  { name: 'BMW M1000RR', price: '4.500.000$' },
];

export const PRICE_LIST = [
  { amount: 1000, price: '30.000$' },
  { amount: 2000, price: '58.000$' },
  { amount: 5000, price: '140.000$' },
  { amount: 10000, price: '270.000$' },
  { amount: 15000, price: '390.000$' },
];

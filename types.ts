
export interface Achievement {
  name: string;
  org: string;
  rank: string;
}

export interface Alliance {
  name: string;
  date: string;
}

export interface RankRequirement {
  id: number;
  title: string;
  nextTitle: string;
  requirements: string[];
}

export interface Car {
  name: string;
  price: string;
}

export interface Order {
  id: string;
  userNick: string;
  amount: number;
  weaponType: string;
  phone: string;
  timestamp: number;
  status: 'pending' | 'completed';
}

export interface User {
  nick: string;
  password: string;
}

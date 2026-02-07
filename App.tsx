
import React, { useState, useEffect, useMemo } from 'react';
import { ACHIEVEMENTS, ALLIANCES, RANKS, FLEET, PRICE_LIST } from './constants.tsx';
import { User, Order } from './types.ts';

// Components
const AuthModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onLogin: (nick: string) => void;
}> = ({ isOpen, onClose, onLogin }) => {
  const [nick, setNick] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAuth = () => {
    if (!nick || !pass) return;
    const usersJson = localStorage.getItem('wellow_users') || '{}';
    const users = JSON.parse(usersJson);

    if (users[nick]) {
      if (users[nick] === pass) {
        onLogin(nick);
        onClose();
      } else {
        setError('Вы ввели неправильный пароль');
      }
    } else {
      // Register new
      users[nick] = pass;
      localStorage.setItem('wellow_users', JSON.stringify(users));
      onLogin(nick);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md glass p-8 rounded-3xl shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-accent">Авторизация</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Игровой никнейм</label>
            <input 
              type="text" 
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              className="w-full bg-slate-900 border border-purple-900/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
              placeholder="Oliver_Wellow"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Пароль</label>
            <input 
              type="password" 
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full bg-slate-900 border border-purple-900/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button 
            onClick={handleAuth}
            className="w-full bg-purple-700 hover:bg-purple-600 text-white font-bold py-3 rounded-xl transition-all active:scale-[0.98]"
          >
            Войти / Регистрация
          </button>
        </div>
      </div>
    </div>
  );
};

const Market: React.FC<{ user: string | null }> = ({ user }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [formData, setFormData] = useState({ amount: '', type: '', phone: '' });
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('wellow_orders') || '[]';
    setOrders(JSON.parse(saved));
  }, []);

  const isAdmin = user === 'Oliver_Wellow';
  const myOrders = useMemo(() => {
    if (isAdmin) return orders.sort((a, b) => b.timestamp - a.timestamp);
    return orders.filter(o => o.userNick === user).sort((a, b) => b.timestamp - a.timestamp);
  }, [orders, user, isAdmin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      userNick: user,
      amount: parseInt(formData.amount),
      weaponType: formData.type,
      phone: formData.phone,
      timestamp: Date.now(),
      status: 'pending'
    };

    const updated = [...orders, newOrder];
    setOrders(updated);
    localStorage.setItem('wellow_orders', JSON.stringify(updated));
    setFormData({ amount: '', type: '', phone: '' });
    setSuccessMsg('Заказ успешно отправлен!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-12 py-8 animate-in fade-in duration-700">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Pricing */}
        <div className="glass p-8 rounded-3xl border-purple-accent/30">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="p-2 bg-purple-900/50 rounded-lg">📦</span> Наши услуги
          </h3>
          <p className="text-slate-400 mb-6">
            Мы предлагаем патроны для любого оружия по выгодным ценам. Чем больше объём — тем ниже цена за единицу!
          </p>
          <div className="overflow-hidden rounded-xl border border-purple-900/30">
            <table className="w-full text-left">
              <thead className="bg-purple-950/50">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold uppercase tracking-wider text-purple-accent">Кол-во</th>
                  <th className="px-4 py-3 text-sm font-semibold uppercase tracking-wider text-purple-accent">Цена</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/20">
                {PRICE_LIST.map((p, idx) => (
                  <tr key={idx} className="hover:bg-purple-900/10 transition-colors">
                    <td className="px-4 py-3 font-medium">{p.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-purple-accent font-bold">{p.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 p-4 bg-purple-900/20 rounded-xl border border-purple-500/20">
            <p className="text-sm">Скидки применяются автоматически при оптовом заказе.</p>
            <p className="text-sm font-bold mt-1 text-purple-accent">Телефон: +1(333)888-835</p>
          </div>
        </div>

        {/* Form */}
        <div className="glass p-8 rounded-3xl border-purple-accent/30">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="p-2 bg-purple-900/50 rounded-lg">📝</span> Оставить заявку
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Ваш игровой ник</label>
              <input type="text" value={user || ''} disabled className="w-full bg-slate-900/50 border border-purple-900/50 rounded-xl px-4 py-3 opacity-70" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Желаемое количество патронов</label>
              <input 
                type="number" 
                required
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                placeholder="Напр: 5000"
                className="w-full bg-slate-900 border border-purple-900/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-600" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Тип оружия</label>
              <input 
                type="text" 
                required
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                placeholder="Deagle, M4, Shotgun..."
                className="w-full bg-slate-900 border border-purple-900/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-600" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Номер телефона</label>
              <input 
                type="text" 
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+1(333)000-000"
                className="w-full bg-slate-900 border border-purple-900/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-600" 
              />
            </div>
            {successMsg && <p className="text-green-400 text-center text-sm">{successMsg}</p>}
            <button className="w-full bg-purple-700 hover:bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98]">
              Отправить заявку
            </button>
          </form>
        </div>
      </div>

      {/* Orders List */}
      <div className="glass p-8 rounded-3xl border-purple-accent/30">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="p-2 bg-purple-900/50 rounded-lg">📋</span> {isAdmin ? 'ВСЕ ЗАКАЗЫ (ADMIN)' : 'МОИ ЗАКАЗЫ'}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-purple-900/30">
                <th className="px-4 py-3 text-sm text-slate-400 font-semibold">Дата</th>
                {isAdmin && <th className="px-4 py-3 text-sm text-slate-400 font-semibold">Никнейм</th>}
                <th className="px-4 py-3 text-sm text-slate-400 font-semibold">Количество</th>
                <th className="px-4 py-3 text-sm text-slate-400 font-semibold">Оружие</th>
                <th className="px-4 py-3 text-sm text-slate-400 font-semibold">Телефон</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/20">
              {myOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-500 italic">Заказов пока нет</td>
                </tr>
              ) : myOrders.map((o) => (
                <tr key={o.id} className="hover:bg-purple-900/10">
                  <td className="px-4 py-4 text-sm">{new Date(o.timestamp).toLocaleDateString()}</td>
                  {isAdmin && <td className="px-4 py-4 font-bold text-purple-accent">{o.userNick}</td>}
                  <td className="px-4 py-4">{o.amount.toLocaleString()} шт</td>
                  <td className="px-4 py-4">{o.weaponType}</td>
                  <td className="px-4 py-4">{o.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'market'>('home');
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('wellow_currentUser');
    if (saved) setCurrentUser(saved);
  }, []);

  const handleLogin = (nick: string) => {
    setCurrentUser(nick);
    localStorage.setItem('wellow_currentUser', nick);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('wellow_currentUser');
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-slate-950 selection:bg-purple-500 selection:text-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-purple-900/30">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-800 rounded-xl flex items-center justify-center font-black text-2xl shadow-lg shadow-purple-900/20">W</div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">Wellow Inc</h1>
          </div>
          
          <nav className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-purple-900/20">
            <button 
              onClick={() => setActiveTab('home')}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all ${activeTab === 'home' ? 'bg-purple-700 text-white shadow-lg shadow-purple-900/30' : 'text-slate-400 hover:text-white'}`}
            >
              Главная
            </button>
            <button 
              onClick={() => currentUser ? setActiveTab('market') : setIsAuthOpen(true)}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all ${activeTab === 'market' ? 'bg-purple-700 text-white shadow-lg shadow-purple-900/30' : 'text-slate-400 hover:text-white'}`}
            >
              Market
            </button>
          </nav>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-purple-900/20 px-4 py-2 rounded-xl border border-purple-500/20">
                <span className="text-sm font-bold flex items-center gap-1">
                  {currentUser}
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                </span>
                <button onClick={handleLogout} className="text-xs text-slate-400 hover:text-red-400">Выйти</button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 px-5 py-2.5 rounded-xl border border-purple-900/30 transition-all active:scale-[0.98]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
                <span className="font-semibold text-sm">Вход</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-12">
        {activeTab === 'home' ? (
          <div className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Hero */}
            <section className="text-center max-w-3xl mx-auto py-12">
              <span className="px-4 py-1.5 rounded-full bg-purple-900/40 text-purple-accent text-sm font-bold border border-purple-500/30">
                Nevada Server 3
              </span>
              <h2 className="text-5xl sm:text-7xl font-black mt-6 mb-8 bg-gradient-to-b from-white to-purple-400 bg-clip-text text-transparent">
                Wellow Inc
              </h2>
              <p className="text-xl text-slate-400 leading-relaxed mb-10">
                Семья на проекте Online Role-Play. Наше сообщество объединяет более 330 профессионалов, 
                занимающих ключевые посты в государстве и влиятельных структурах штата.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="glass px-8 py-4 rounded-3xl text-center">
                  <div className="text-3xl font-bold text-purple-accent">330+</div>
                  <div className="text-sm text-slate-500 uppercase tracking-widest font-bold">Участников</div>
                </div>
                <div className="glass px-8 py-4 rounded-3xl text-center">
                  <div className="text-3xl font-bold text-purple-accent">Nevada</div>
                  <div className="text-sm text-slate-500 uppercase tracking-widest font-bold">Сервер #3</div>
                </div>
                <div className="glass px-8 py-4 rounded-3xl text-center">
                  <div className="text-3xl font-bold text-purple-accent">37</div>
                  <div className="text-sm text-slate-500 uppercase tracking-widest font-bold">Особняк</div>
                </div>
              </div>
            </section>

            {/* Achievements */}
            <section className="space-y-12">
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-4">Наши достижения</h3>
                <div className="w-24 h-1.5 bg-purple-600 mx-auto rounded-full"></div>
              </div>
              <div className="glass rounded-3xl overflow-hidden border-purple-accent/20">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900/80">
                      <tr>
                        <th className="px-6 py-5 text-sm font-bold uppercase tracking-wider text-purple-accent">Никнейм</th>
                        <th className="px-6 py-5 text-sm font-bold uppercase tracking-wider text-purple-accent">Организация</th>
                        <th className="px-6 py-5 text-sm font-bold uppercase tracking-wider text-purple-accent">Достижение / Пост</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-900/10">
                      {ACHIEVEMENTS.map((a, i) => (
                        <tr key={i} className="hover:bg-purple-900/5 transition-colors">
                          <td className="px-6 py-4 font-bold">{a.name}</td>
                          <td className="px-6 py-4 text-slate-400">{a.org}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-lg bg-purple-900/20 text-purple-300 text-sm border border-purple-500/20">
                              {a.rank}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Ranks */}
            <section className="space-y-12">
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-4">Система повышения</h3>
                <p className="text-slate-500">Официальный регламент продвижения в структуре Wellow Inc</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {RANKS.map((rank) => (
                  <div key={rank.id} className="glass p-6 rounded-3xl relative group border-purple-accent/10 hover:border-purple-accent/40 transition-all hover:-translate-y-1">
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-purple-700 rounded-2xl flex items-center justify-center font-bold shadow-lg">
                      {rank.id}
                    </div>
                    <div className="mb-4">
                      <div className="text-xs font-bold text-slate-500 uppercase mb-1">{rank.title}</div>
                      <div className="text-lg font-black text-white">{rank.nextTitle}</div>
                    </div>
                    <ul className="space-y-3">
                      {rank.requirements.map((req, j) => (
                        <li key={j} className="text-sm text-slate-400 flex gap-2">
                          <span className="text-purple-500">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Management & Fleet */}
            <div className="grid lg:grid-cols-2 gap-12">
               {/* Management */}
               <section className="space-y-8">
                 <h3 className="text-3xl font-bold">Руководящий состав</h3>
                 <div className="space-y-4">
                    <div className="glass p-6 rounded-3xl border-l-4 border-l-purple-600 flex justify-between items-center">
                      <div>
                        <div className="text-2xl font-black">Oliver_Wellow</div>
                        <div className="text-purple-accent font-bold">[VII] President</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500 uppercase font-bold">Связь</div>
                        <div className="text-lg font-mono">+1(333)888-835</div>
                      </div>
                    </div>
                    <div className="glass p-6 rounded-3xl border-l-4 border-l-purple-400 flex justify-between items-center">
                      <div>
                        <div className="text-2xl font-black">Pablo_Desparo</div>
                        <div className="text-purple-accent/80 font-bold">[VI] Vice-President</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500 uppercase font-bold">Связь</div>
                        <div className="text-lg font-mono">+1(333)286-666</div>
                      </div>
                    </div>
                 </div>
                 <div className="p-6 bg-slate-900/50 rounded-3xl border border-purple-900/20 italic text-slate-400">
                   "Wellow Inc — это не просто сообщество, это отлаженный механизм. Мы оказываем юридическую помощь 
                   и обеспечиваем ресурсами проверенные организации и семьи штата."
                 </div>
               </section>

               {/* Fleet */}
               <section className="space-y-8">
                 <h3 className="text-3xl font-bold">Семейный автопарк</h3>
                 <div className="glass rounded-3xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-purple-950/40">
                        <tr>
                          <th className="px-6 py-4 text-sm font-bold text-purple-accent">Модель</th>
                          <th className="px-6 py-4 text-sm font-bold text-purple-accent">Стоимость</th>
                        </tr>
                      </thead>
                      <tbody>
                        {FLEET.map((car, i) => (
                          <tr key={i} className="border-t border-purple-900/10">
                            <td className="px-6 py-4 font-medium">{car.name}</td>
                            <td className="px-6 py-4 font-mono text-slate-400">{car.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="p-4 text-center bg-slate-900/30 text-xs text-slate-500 font-bold uppercase">
                      Локация: Особняк №37 на горе VineWood
                    </div>
                 </div>
               </section>
            </div>

            {/* Alliances & Links */}
            <section className="grid md:grid-cols-2 gap-12 pb-24">
              <div className="space-y-8">
                <h3 className="text-3xl font-bold">Союзы</h3>
                <div className="glass rounded-3xl overflow-hidden">
                   <table className="w-full text-left">
                     <thead className="bg-slate-900/80">
                       <tr>
                         <th className="px-6 py-4 text-sm font-bold text-purple-accent">Название</th>
                         <th className="px-6 py-4 text-sm font-bold text-purple-accent">Дата</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-purple-900/10">
                       {ALLIANCES.map((a, i) => (
                         <tr key={i}>
                           <td className="px-6 py-4 font-bold">{a.name}</td>
                           <td className="px-6 py-4 text-slate-400">{a.date}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-8">
                <div className="text-center p-12 glass rounded-[3rem] border-purple-600/20 flex flex-col items-center gap-6">
                  <div className="w-20 h-20 bg-purple-700/20 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-purple-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>
                  </div>
                  <h4 className="text-2xl font-bold">Узнайте больше</h4>
                  <p className="text-slate-400">Подробная информация, свежие новости и отчетность в нашей теме на форуме.</p>
                  <a 
                    href="https://forum.gta-mobile.ru/threads/916916/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-slate-950 px-8 py-4 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl"
                  >
                    ПЕРЕЙТИ НА ФОРУМ
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                  </a>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <Market user={currentUser} />
        )}
      </main>

      {/* Modals */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLogin={handleLogin} 
      />

      <footer className="mt-20 border-t border-purple-900/20 py-12 text-center text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-bold text-purple-900 uppercase tracking-[0.3em] mb-4">Wellow Inc Portal</p>
          <p className="text-sm">© 2023-2026 Nevada Server 3. Designed for the family.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;

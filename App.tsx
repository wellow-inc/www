
import React, { useState, useEffect, useMemo } from 'https://esm.sh/react@18.2.0';
import { ACHIEVEMENTS, ALLIANCES, RANKS, FLEET, PRICE_LIST } from './constants.tsx';

// Типы (встроены сюда для надежности работы Babel)
interface Order {
  id: string;
  userNick: string;
  amount: number;
  weaponType: string;
  phone: string;
  timestamp: number;
  status: 'pending' | 'completed';
}

const AuthModal = ({ isOpen, onClose, onLogin }) => {
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
              className="w-full bg-slate-900 border border-purple-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
              placeholder="Oliver_Wellow"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Пароль</label>
            <input 
              type="password" 
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full bg-slate-900 border border-purple-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
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

const Market = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({ amount: '', type: '', phone: '' });
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('wellow_orders') || '[]';
    setOrders(JSON.parse(saved));
  }, []);

  const isAdmin = user === 'Oliver_Wellow';
  const myOrders = useMemo(() => {
    if (isAdmin) return [...orders].sort((a, b) => b.timestamp - a.timestamp);
    return orders.filter(o => o.userNick === user).sort((a, b) => b.timestamp - a.timestamp);
  }, [orders, user, isAdmin]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return;
    
    const newOrder = {
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
    <div className="space-y-12 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl border-purple-accent/30">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="p-2 bg-purple-900/50 rounded-lg">📦</span> Наши услуги
          </h3>
          <div className="overflow-hidden rounded-xl border border-purple-900/30">
            <table className="w-full text-left">
              <thead className="bg-purple-950/50">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold uppercase text-purple-accent">Кол-во</th>
                  <th className="px-4 py-3 text-sm font-semibold uppercase text-purple-accent">Цена</th>
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
            <p className="text-sm font-bold text-purple-accent">Связь в игре: +1(333)888-835</p>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl border-purple-accent/30">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="p-2 bg-purple-900/50 rounded-lg">📝</span> Оставить заявку
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Желаемое количество</label>
              <input 
                type="number" 
                required
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                placeholder="5000"
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
                placeholder="Deagle, M4..."
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
                placeholder="+1(333)..."
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

      <div className="glass p-8 rounded-3xl border-purple-accent/30">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="p-2 bg-purple-900/50 rounded-lg">📋</span> {isAdmin ? 'ВСЕ ЗАКАЗЫ (ADMIN)' : 'МОИ ЗАКАЗЫ'}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-purple-900/30">
                <th className="px-4 py-3 text-sm text-slate-400">Дата</th>
                {isAdmin && <th className="px-4 py-3 text-sm text-slate-400">Ник</th>}
                <th className="px-4 py-3 text-sm text-slate-400">Кол-во</th>
                <th className="px-4 py-3 text-sm text-slate-400">Оружие</th>
                <th className="px-4 py-3 text-sm text-slate-400">Телефон</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/20">
              {myOrders.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500 italic">Заказов нет</td></tr>
              ) : myOrders.map((o) => (
                <tr key={o.id}>
                  <td className="px-4 py-4 text-sm">{new Date(o.timestamp).toLocaleDateString()}</td>
                  {isAdmin && <td className="px-4 py-4 font-bold text-purple-accent">{o.userNick}</td>}
                  <td className="px-4 py-4">{o.amount} шт</td>
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

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('wellow_currentUser');
    if (saved) setCurrentUser(saved);
  }, []);

  const handleLogin = (nick) => {
    setCurrentUser(nick);
    localStorage.setItem('wellow_currentUser', nick);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('wellow_currentUser');
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 glass border-b border-purple-900/30">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center font-black text-xl">W</div>
            <h1 className="text-lg font-bold hidden sm:block">Wellow Inc</h1>
          </div>
          
          <nav className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'home' ? 'bg-purple-700 text-white' : 'text-slate-400 hover:text-white'}`}
            >Главная</button>
            <button 
              onClick={() => currentUser ? setActiveTab('market') : setIsAuthOpen(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'market' ? 'bg-purple-700 text-white' : 'text-slate-400 hover:text-white'}`}
            >Market</button>
          </nav>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-accent hidden xs:block">{currentUser}</span>
              <button onClick={handleLogout} className="text-[10px] text-slate-500 hover:text-red-400 uppercase font-bold">Выйти</button>
            </div>
          ) : (
            <button onClick={() => setIsAuthOpen(true)} className="bg-purple-700 px-4 py-2 rounded-lg text-sm font-bold">Вход</button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {activeTab === 'home' ? (
          <div className="space-y-16 pb-20">
            <section className="text-center py-10">
              <h2 className="text-4xl sm:text-6xl font-black mb-6 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">Wellow Inc</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                Элитное сообщество штата Nevada. Мы объединяем лидеров, министров и лучших специалистов для доминирования во всех сферах.
              </p>
            </section>

            <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {RANKS.map(rank => (
                <div key={rank.id} className="glass p-5 rounded-2xl border-purple-500/10">
                  <div className="text-purple-500 font-bold text-xs mb-1">Уровень {rank.id}</div>
                  <div className="font-bold text-white mb-3">{rank.nextTitle}</div>
                  <ul className="text-[11px] text-slate-400 space-y-1">
                    {rank.requirements.map((r, i) => <li key={i}>• {r}</li>)}
                  </ul>
                </div>
              ))}
            </section>

            <section className="glass rounded-3xl overflow-hidden">
               <div className="p-6 border-b border-purple-900/20 bg-purple-950/20">
                 <h3 className="font-bold">Наши достижения</h3>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                   <thead className="bg-slate-900/50">
                     <tr>
                       <th className="px-6 py-4 text-purple-accent">Ник</th>
                       <th className="px-6 py-4 text-purple-accent">Пост</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-purple-900/10">
                     {ACHIEVEMENTS.slice(0, 10).map((a, i) => (
                       <tr key={i} className="hover:bg-purple-900/5">
                         <td className="px-6 py-3 font-bold">{a.name}</td>
                         <td className="px-6 py-3 text-slate-400">{a.rank} ({a.org})</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
               <div className="p-4 text-center bg-slate-900/50">
                 <a href="https://forum.gta-mobile.ru/threads/916916/" target="_blank" className="text-xs text-purple-400 hover:underline">Смотреть весь список на форуме</a>
               </div>
            </section>
          </div>
        ) : (
          <Market user={currentUser} />
        )}
      </main>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLogin={handleLogin} />
    </div>
  );
};

export default App;

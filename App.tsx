import React, { useMemo, useState } from 'react';
import {
  Clock3,
  Menu as MenuIcon,
  Quote,
  ShoppingCart,
  Star,
  Truck,
  Utensils,
  X,
} from 'lucide-react';

type MenuItem = {
  id: number;
  name: string;
  price: number;
  image: string;
};

type Cart = Record<number, number>;

const MENU_ITEMS: MenuItem[] = [
  { id: 1, name: 'Veg Sandwich', price: 100, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80' },
  { id: 2, name: 'Grilled Sandwich', price: 100, image: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?auto=format&fit=crop&w=900&q=80' },
  { id: 3, name: 'Veg Burger', price: 100, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80' },
  { id: 4, name: 'Cheese Burger', price: 100, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=900&q=80' },
  { id: 5, name: 'Poha', price: 100, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80' },
  { id: 6, name: 'Idly', price: 100, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=900&q=80' },
  { id: 7, name: 'Dosa', price: 100, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80' },
  { id: 8, name: 'Masala Dosa', price: 100, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80' },
  { id: 9, name: 'Uttapam', price: 100, image: 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&w=900&q=80' },
  { id: 10, name: 'Upma', price: 100, image: 'https://images.unsplash.com/photo-1596797038530-2c107aa33f57?auto=format&fit=crop&w=900&q=80' },
];

const TESTIMONIALS = [
  { name: 'Riya Sharma', review: 'Amazing taste! Every bite feels freshly made.' },
  { name: 'Arjun Mehta', review: 'Super fast delivery! Food arrived hot in under 30 mins.' },
  { name: 'Sana Khan', review: 'Best dosa in town! UrbanBite has become my favorite.' },
  { name: 'Karan Verma', review: 'Great packaging and flavor. Perfect for quick meals.' },
];

const formatINR = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

const App: React.FC = () => {
  const [cart, setCart] = useState<Cart>({});
  const [mobileOpen, setMobileOpen] = useState(false);

  const addToCart = (itemId: number) => {
    setCart((prev) => ({ ...prev, [itemId]: (prev[itemId] ?? 0) + 1 }));
  };

  const adjustQty = (itemId: number, delta: number) => {
    setCart((prev) => {
      const nextQty = Math.max(0, (prev[itemId] ?? 0) + delta);
      if (nextQty === 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: nextQty };
    });
  };

  const cartItems = useMemo(
    () => MENU_ITEMS.filter((item) => cart[item.id]).map((item) => ({ ...item, qty: cart[item.id] })),
    [cart],
  );

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  const placeOrder = () => {
    if (!totalItems) {
      alert('Your cart is empty. Add something delicious first!');
      return;
    }
    alert(`Order placed! ${totalItems} item(s) will arrive in ~30 minutes.`);
    setCart({});
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'order', label: 'Order' },
    { id: 'testimonials', label: 'Testimonials' },
  ];

  return (
    <div className="bg-amber-50 text-slate-900 min-h-screen">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-amber-100 shadow-sm">
        <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2 font-extrabold text-xl text-red-600">
            <Utensils className="w-6 h-6" /> UrbanBite
          </a>

          <button
            onClick={() => setMobileOpen((s) => !s)}
            className="md:hidden p-2 rounded-lg text-slate-700"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X /> : <MenuIcon />}
          </button>

          <ul className="hidden md:flex items-center gap-7 font-semibold text-slate-700">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} className="hover:text-red-600 transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a href="#order" className="hidden md:inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full font-bold shadow hover:bg-red-700">
            <ShoppingCart className="w-4 h-4" /> {totalItems}
          </a>
        </nav>

        {mobileOpen && (
          <ul className="md:hidden px-4 pb-4 space-y-2 bg-white border-t border-amber-100">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} onClick={() => setMobileOpen(false)} className="block py-2 font-semibold text-slate-700 hover:text-red-600">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </header>

      <section id="home" className="max-w-6xl mx-auto px-4 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6 animate-fade-in">
          <p className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">
            <Clock3 className="w-4 h-4" /> Fresh food, lightning fast
          </p>
          <h1 className="text-4xl md:text-6xl font-black leading-tight">
            Delicious Food Delivered in <span className="text-red-600">30 Minutes</span>
          </h1>
          <p className="text-slate-600 text-lg">
            Crave-worthy sandwiches, burgers, and South Indian favorites made fresh and delivered to your doorstep.
          </p>
          <a href="#menu" className="inline-block bg-gradient-to-r from-red-600 to-orange-500 text-white px-7 py-3 rounded-full font-bold text-lg shadow-lg hover:scale-105 transition-transform">
            Order Now
          </a>
        </div>

        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
            alt="UrbanBite food spread"
            className="rounded-3xl shadow-2xl w-full h-[420px] object-cover"
          />
          <div className="absolute -bottom-6 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-amber-100 animate-slide-up">
            <p className="font-bold text-red-600">4.9/5 Rating</p>
            <div className="flex gap-1 mt-1 text-yellow-500">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}</div>
          </div>
        </div>
      </section>

      <section id="menu" className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-3">Popular Menu</h2>
        <p className="text-center text-slate-600 mb-10">Simple, tasty, and priced to delight.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MENU_ITEMS.map((item, i) => (
            <article
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md border border-amber-100 hover:-translate-y-1 hover:shadow-xl transition-all"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <img src={item.image} alt={item.name} className="w-full h-40 object-cover" />
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-extrabold text-lg">{item.name}</h3>
                  <span className="font-bold text-red-600">{formatINR(item.price)}</span>
                </div>
                <button
                  onClick={() => addToCart(item.id)}
                  className="w-full bg-orange-500 text-white py-2.5 rounded-xl font-bold hover:bg-orange-600 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="order" className="max-w-6xl mx-auto px-4 py-14">
        <div className="bg-white rounded-3xl border border-amber-100 shadow-lg p-6 md:p-8">
          <div className="flex items-center justify-between gap-3 mb-6">
            <h2 className="text-3xl font-black">Your Order</h2>
            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">{totalItems} item(s)</span>
          </div>

          {!cartItems.length ? (
            <p className="text-slate-500">Your cart is empty. Add some items from the menu to get started.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 border border-amber-100 rounded-xl p-4">
                  <div>
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-sm text-slate-500">{formatINR(item.price)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => adjustQty(item.id, -1)} className="w-8 h-8 rounded-full bg-slate-200 font-black">-</button>
                    <span className="w-8 text-center font-bold">{item.qty}</span>
                    <button onClick={() => adjustQty(item.id, 1)} className="w-8 h-8 rounded-full bg-slate-200 font-black">+</button>
                  </div>
                  <p className="font-bold text-red-600 min-w-[80px] text-right">{formatINR(item.qty * item.price)}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-2xl font-black">Total: <span className="text-red-600">{formatINR(totalPrice)}</span></p>
            <button
              onClick={placeOrder}
              className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-3 rounded-xl font-black hover:opacity-90 transition-opacity"
            >
              Place Order
            </button>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-14">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-8">30-Minute Delivery Guarantee</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/15 rounded-2xl p-6">
              <Truck className="mx-auto w-10 h-10 mb-3" />
              <p className="font-bold">Fast Dispatch</p>
              <p className="text-sm text-orange-100">Orders packed and sent in minutes.</p>
            </div>
            <div className="bg-white/15 rounded-2xl p-6">
              <Clock3 className="mx-auto w-10 h-10 mb-3" />
              <p className="font-bold">On-Time Promise</p>
              <p className="text-sm text-orange-100">We value your time, always.</p>
            </div>
            <div className="bg-white/15 rounded-2xl p-6">
              <Utensils className="mx-auto w-10 h-10 mb-3" />
              <p className="font-bold">Freshly Cooked</p>
              <p className="text-sm text-orange-100">Prepared only after you order.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-10">What Customers Say</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map((t) => (
            <article key={t.name} className="bg-white border border-amber-100 rounded-2xl p-5 shadow-sm">
              <Quote className="w-6 h-6 text-orange-500 mb-3" />
              <p className="text-slate-600 mb-4">“{t.review}”</p>
              <p className="font-extrabold text-red-600">{t.name}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-200 py-10">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-4 items-center">
          <div>
            <h3 className="text-2xl font-black text-white">UrbanBite</h3>
            <p className="text-slate-400">Fresh flavors. Fast delivery. Every single day.</p>
          </div>
          <div className="md:text-right text-slate-400">
            <p>Call us: +91 98765 43210</p>
            <p>Email: hello@urbanbite.in</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

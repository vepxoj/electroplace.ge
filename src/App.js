import React, { useState, useMemo } from 'react';
import { 
  ShoppingCart, Search, X, Plus, Minus, Trash2, 
  CheckCircle, Package, ChevronDown, ChevronUp, 
  ArrowRight, Truck, Star, MapPin, Menu
} from 'lucide-react';

const LOGO_URL = "https://res.cloudinary.com/dda0r7rmy/image/upload/f_auto,q_auto/v1775516515/7D15BE0E-4C0E-4E20-9660-100C3699C0A0_qlfiu0.png";

const PRODUCT_DATA = [
  { 
    id: 1, 
    name: "Sokany - ს ბლენდერი", 
    price: 85, 
    oldPrice: 195,
    category: "სამზარეულო", 
    image: "https://res.cloudinary.com/dda0r7rmy/image/upload/f_auto,q_auto/v1775516517/IMG_0273_lihjbt.jpg",
    description: "მაღალი ხარისხის სტაციონარული ბლენდერი.",
    specs: ["მძლავრი ძრავა", "თერმომდგრადი კონტეინერი"]
  },
  { 
    id: 2, 
    name: "Sokany SK-1915 თმის საშრობი სავარცხელი", 
    price: 65, 
    oldPrice: 99,
    category: "თავის მოვლა", 
    image: "https://res.cloudinary.com/dda0r7rmy/image/upload/f_auto,q_auto/v1775516517/IMG_0276_ekjiyv.jpg",
    description: "მრავალფუნქციური თმის საშრობი სავარცხელი.",
    specs: ["სიმძლავრე: 1200W", "ფუნქციები: გაშრობა, გასწორება"]
  },
  { 
    id: 3, 
    name: "Franko - ს ხორცსაკეპი", 
    price: 219, 
    oldPrice: 309,
    category: "სამზარეულო", 
    image: "https://res.cloudinary.com/dda0r7rmy/image/upload/f_auto,q_auto/v1775516517/IMG_0271_x4qjnn.jpg",
    description: "მძლავრი ხორცსაკეპი მანქანა.",
    specs: ["რევერსის ფუნქცია", "უჟანგავი ფოლადის პირები"]
  },
  { 
    id: 4, 
    name: "Zinger - ის მტვერსასრუტი", 
    price: 199, 
    oldPrice: 299,
    category: "დასუფთავება", 
    image: "https://res.cloudinary.com/dda0r7rmy/image/upload/f_auto,q_auto/v1775516517/IMG_0266_urwkjw.jpg",
    description: "ვერტიკალური მტვერსასრუტი.",
    specs: ["HEPA ფილტრი", "მსუბუქი დიზაინი"]
  },
  { 
    id: 5, 
    name: "Franko - ს ფენი", 
    price: 65, 
    oldPrice: 189,
    category: "თავის მოვლა", 
    image: "https://res.cloudinary.com/dda0r7rmy/image/upload/f_auto,q_auto/v1775516516/IMG_0265_ffdqql.jpg",
    description: "პროფესიონალური თმის საშრობი.",
    specs: ["ცივი ჰაერის ნაკადი", "ტემპერატურის კონტროლი"]
  },
  { 
    id: 6, 
    name: "Protechno - ს სენდვიჩერი", 
    price: 99, 
    oldPrice: 159,
    category: "სამზარეულო", 
    image: "https://res.cloudinary.com/dda0r7rmy/image/upload/f_auto,q_auto/v1775516516/IMG_0179_rt20l9.jpg",
    description: "სენდვიჩის აპარატი.",
    specs: ["მარტივი წმენდა", "კომპაქტური ზომა"]
  },
  { 
    id: 7, 
    name: "Protechno - ს აეროგრილი", 
    price: 230, 
    oldPrice: 379,
    category: "სამზარეულო", 
    image: "https://res.cloudinary.com/dda0r7rmy/image/upload/f_auto,q_auto/v1775516516/IMG_0190_klj2xq.jpg",
    description: "ამზადებს კერძებს ზეთის გარეშე.",
    specs: ["ციფრული ეკრანი", "ტაიმერი"]
  },
  { 
    id: 8, 
    name: "Lines - ის ჭურჭლის ნაკრები", 
    price: 429, 
    oldPrice: 700,
    category: "სამზარეულო", 
    image: "https://res.cloudinary.com/dda0r7rmy/image/upload/f_auto,q_auto/v1775516516/IMG_0264_cx8hhk.jpg",
    description: "ჭურჭლის ნაკრები გრანიტის საფარით.",
    specs: ["გრანიტის ზედაპირი", "გამძლე მასალა"]
  },
  { 
    id: 9, 
    name: "Arshia ბლენდერი", 
    price: 199, 
    oldPrice: 329,
    category: "სამზარეულო", 
    image: "https://res.cloudinary.com/dda0r7rmy/image/upload/f_auto,q_auto/v1775516516/IMG_0176_oqbli6.jpg",
    description: "ძლიერი ბლენდერი ყოველდღიური გამოყენებისთვის.",
    specs: ["ძლიერი ძრავა", "მაღალი წარმადობა"]
  }
];

const CATEGORIES = ["ყველა", "სამზარეულო", "დასუფთავება", "თავის მოვლა"];

export default function App() {
  const [view, setView] = useState('home'); 
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("ყველა");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [hoveredLogo, setHoveredLogo] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));
  
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = useMemo(() => {
    return PRODUCT_DATA.filter(p => {
      const matchesCategory = activeCategory === "ყველა" || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(appliedSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [appliedSearch, activeCategory]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const productsText = cart.map(item => `${item.name} x ${item.quantity}`).join('\n');
    formData.append('products', productsText);
    formData.append('address', deliveryAddress);
    formData.append('total', `₾${cartTotal}`);

    try {
      const response = await fetch("https://formspree.io/f/mlgozdja", {
        method: "POST",
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        setCart([]);
        setView('success');
      } else {
        alert("შეცდომა გაგზავნისას.");
      }
    } catch (error) {
      alert("სისტემური შეცდომა.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = {
    container: {
      backgroundColor: '#0A1D2E',
      minHeight: '100vh',
      color: '#E5E7EB',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      margin: 0,
      padding: 0,
    },
    header: {
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(15, 42, 67, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #1E3E62',
      padding: '12px 20px',
    },
    nav: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    logoImg: {
      width: '42px',
      height: '42px',
      borderRadius: '50%',
      backgroundColor: 'white',
      padding: '2px',
      border: '2px solid #1E3E62',
      objectFit: 'cover',
    },
    logoText: (isHovered) => ({
      fontWeight: '900',
      fontSize: '1.3rem',
      color: isHovered ? '#2F80ED' : 'white',
      letterSpacing: '-1px',
      transition: 'color 0.3s ease',
    }),
    searchContainer: {
      flex: 1,
      maxWidth: '450px',
      position: 'relative',
    },
    searchInput: {
      width: '100%',
      backgroundColor: '#153450',
      border: '1px solid #1E3E62',
      borderRadius: '12px',
      padding: '10px 15px 10px 40px',
      color: 'white',
      outline: 'none',
      fontSize: '14px',
      transition: 'border-color 0.2s',
    },
    searchIcon: {
      position: 'absolute',
      left: '14px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9CA3AF',
    },
    cartButton: {
      position: 'relative',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#D1D5DB',
      padding: '8px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    badge: {
      position: 'absolute',
      top: '2px',
      right: '2px',
      backgroundColor: '#2F80ED',
      color: 'white',
      fontSize: '10px',
      fontWeight: 'bold',
      width: '18px',
      height: '18px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid #0F2A43',
    },
    hero: {
      textAlign: 'center',
      padding: '60px 20px 40px',
    },
    heroTitle: {
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
      fontWeight: '900',
      color: 'white',
      margin: 0,
      lineHeight: '1.1',
      letterSpacing: '-1px',
    },
    heroSub: {
      color: '#2F80ED',
    },
    heroDesc: {
      color: '#9CA3AF',
      marginTop: '15px',
      fontSize: '1.1rem',
    },
    categoryList: {
      display: 'flex',
      gap: '10px',
      overflowX: 'auto',
      padding: '0 20px 30px',
      maxWidth: '1200px',
      margin: '0 auto',
      scrollbarWidth: 'none',
    },
    catBtn: (isActive) => ({
      padding: '8px 22px',
      borderRadius: '10px',
      border: '1px solid #1E3E62',
      backgroundColor: isActive ? '#2F80ED' : '#153450',
      color: isActive ? 'white' : '#9CA3AF',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'all 0.2s ease',
    }),
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: '24px',
      padding: '0 20px 80px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    card: (isHovered) => ({
      backgroundColor: '#153450',
      borderRadius: '16px',
      border: '1px solid #1E3E62',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer',
      transform: isHovered ? 'scale(1.03)' : 'scale(1)',
      borderColor: isHovered ? '#2F80ED' : '#1E3E62',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: isHovered ? '0 10px 20px -5px rgba(0,0,0,0.3)' : 'none',
    }),
    cardImgContainer: {
      backgroundColor: '#153450',
      aspectRatio: '1/1',
      overflow: 'hidden',
      position: 'relative',
    },
    cardImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s ease',
    },
    cardContent: {
      padding: '18px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    cardName: {
      fontSize: '15px',
      fontWeight: '600',
      color: 'white',
      margin: 0,
      lineHeight: '1.4',
      height: '42px',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    priceContainer: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '8px',
    },
    priceTag: {
      fontSize: '22px',
      fontWeight: '800',
      color: '#2F80ED',
    },
    oldPrice: {
      fontSize: '13px',
      color: '#6B7280',
      textDecoration: 'line-through',
    },
    buyBtn: {
      width: '100%',
      backgroundColor: '#2F80ED',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      padding: '12px',
      fontWeight: '700',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'background 0.2s ease',
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)',
      zIndex: 200,
    },
    sidebar: {
      position: 'fixed',
      top: 0,
      right: 0,
      height: '100%',
      width: '100%',
      maxWidth: '420px',
      backgroundColor: '#0F2A43',
      zIndex: 201,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '-10px 0 50px rgba(0,0,0,0.5)',
    },
    sidebarHeader: {
      padding: '24px',
      borderBottom: '1px solid #1E3E62',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cartList: {
      padding: '20px',
      flex: 1,
      overflowY: 'auto',
    },
    cartItem: {
      display: 'flex',
      gap: '16px',
      backgroundColor: '#153450',
      padding: '12px',
      borderRadius: '12px',
      marginBottom: '16px',
      border: '1px solid #1E3E62',
    },
    cartItemImg: {
      width: '80px',
      height: '80px',
      borderRadius: '8px',
      objectFit: 'cover',
    },
    checkoutFooter: {
      padding: '24px',
      backgroundColor: '#0A1D2E',
      borderTop: '1px solid #1E3E62',
    },
    inputField: {
      width: '100%',
      backgroundColor: '#0F2A43',
      border: '1px solid #1E3E62',
      borderRadius: '10px',
      padding: '14px',
      color: 'white',
      marginBottom: '12px',
      fontSize: '14px',
      boxSizing: 'border-box',
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.nav}>
          <div 
            style={styles.logo} 
            onClick={() => setView('home')}
            onMouseEnter={() => setHoveredLogo(true)}
            onMouseLeave={() => setHoveredLogo(false)}
          >
            <img src={LOGO_URL} alt="Logo" style={styles.logoImg} loading="lazy" />
            <span style={styles.logoText(hoveredLogo)}>ELECTROPLACE</span>
          </div>

          <div style={styles.searchContainer}>
            <Search size={18} style={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="ძებნა..." 
              style={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setAppliedSearch(searchQuery)}
            />
          </div>

          <button onClick={() => setIsCartOpen(true)} style={styles.cartButton}>
            <ShoppingCart size={24} />
            {cartItemsCount > 0 && <span style={styles.badge}>{cartItemsCount}</span>}
          </button>
        </div>
      </header>

      {view === 'home' && (
        <main>
          <section style={styles.hero}>
            <h1 style={styles.heroTitle}>
              საოჯახო ტექნიკა <br/>
              <span style={styles.heroSub}>საუკეთესო ფასად</span>
            </h1>
            <p style={styles.heroDesc}>სწრაფი მიწოდება მთელ საქართველოში. ხარისხი და გარანტია.</p>
          </section>

          <div style={styles.categoryList}>
            {CATEGORIES.map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                style={styles.catBtn(activeCategory === cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={styles.grid}>
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                style={styles.card(hoveredCard === product.id)}
                onMouseEnter={() => setHoveredCard(product.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={styles.cardImgContainer}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    style={styles.cardImg} 
                    loading="lazy" 
                  />
                </div>
                <div style={styles.cardContent}>
                  <h3 style={styles.cardName}>{product.name}</h3>
                  <div style={styles.priceContainer}>
                    {product.oldPrice && <span style={styles.oldPrice}>₾{product.oldPrice}</span>}
                    <span style={styles.priceTag}>₾{product.price}</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} style={styles.buyBtn}>
                    <Plus size={18} /> კალათაში
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <>
          <div style={styles.overlay} onClick={() => setIsCartOpen(false)} />
          <div style={styles.sidebar}>
            <div style={styles.sidebarHeader}>
              <h2 style={{margin: 0, display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.4rem', fontWeight: '800'}}>
                <ShoppingCart size={24} /> კალათა
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)} 
                style={{background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '5px'}}
              >
                <X size={24} />
              </button>
            </div>

            <div style={styles.cartList}>
              {cart.length === 0 ? (
                <div style={{textAlign: 'center', marginTop: '100px', color: '#9CA3AF'}}>
                  <Package size={60} style={{marginBottom: '15px', opacity: 0.5}} />
                  <p style={{fontSize: '1.1rem'}}>კალათა ცარიელია</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} style={styles.cartItem}>
                    <img src={item.image} alt={item.name} style={styles.cartItemImg} loading="lazy" />
                    <div style={{flex: 1}}>
                      <div style={{fontSize: '14px', fontWeight: '600', marginBottom: '4px', color: 'white'}}>{item.name}</div>
                      <div style={{color: '#2F80ED', fontWeight: '800', fontSize: '1.1rem'}}>₾{item.price}</div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginTop: '12px'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#0F2A43', padding: '4px 12px', borderRadius: '8px', border: '1px solid #1E3E62'}}>
                          <Minus size={14} onClick={() => updateQuantity(item.id, -1)} style={{cursor: 'pointer'}} />
                          <span style={{fontWeight: '700', fontSize: '14px', minWidth: '15px', textAlign: 'center'}}>{item.quantity}</span>
                          <Plus size={14} onClick={() => updateQuantity(item.id, 1)} style={{cursor: 'pointer'}} />
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          style={{background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', marginLeft: 'auto', padding: '5px'}}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div style={styles.checkoutFooter}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center'}}>
                  <span style={{color: '#9CA3AF', fontSize: '0.9rem', fontWeight: '600'}}>ჯამური თანხა:</span>
                  <span style={{fontSize: '1.8rem', fontWeight: '900', color: 'white'}}>₾{cartTotal}</span>
                </div>
                <button 
                  style={{...styles.buyBtn, padding: '16px', fontSize: '1rem'}} 
                  onClick={() => {setIsCartOpen(false); setView('checkout');}}
                >
                  გაფორმება
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {view === 'checkout' && (
        <div style={{maxWidth: '500px', margin: '40px auto', padding: '0 20px'}}>
          <div style={{backgroundColor: '#153450', padding: '35px', borderRadius: '24px', border: '1px solid #1E3E62', boxShadow: '0 20px 40px rgba(0,0,0,0.4)'}}>
            <h2 style={{fontSize: '24px', fontWeight: '800', marginBottom: '24px', color: 'white'}}>შეკვეთის გაფორმება</h2>
            <form onSubmit={handleCheckout}>
              <div style={{display: 'flex', gap: '12px'}}>
                <input name="first_name" required placeholder="სახელი" style={styles.inputField} />
                <input name="last_name" required placeholder="გვარი" style={styles.inputField} />
              </div>
              <input name="phone" required placeholder="ტელეფონი" style={styles.inputField} />
              <textarea 
                placeholder="მისამართი (ქალაქი, ქუჩა, ბინა...)" 
                style={{...styles.inputField, height: '110px', resize: 'none'}}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                required
              />
              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{...styles.buyBtn, padding: '16px', fontSize: '1.1rem'}}
              >
                {isSubmitting ? 'იგზავნება...' : `დადასტურება (₾${cartTotal})`}
              </button>
              <button 
                type="button" 
                onClick={() => setView('home')}
                style={{width: '100%', background: 'none', border: 'none', color: '#9CA3AF', marginTop: '16px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem'}}
              >
                უკან დაბრუნება
              </button>
            </form>
          </div>
        </div>
      )}

      {view === 'success' && (
        <div style={{textAlign: 'center', padding: '100px 20px', maxWidth: '600px', margin: '0 auto'}}>
          <div style={{width: '90px', height: '90px', backgroundColor: 'rgba(34,197,94,0.15)', color: '#22C55E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'}}>
            <CheckCircle size={54} />
          </div>
          <h2 style={{fontSize: '2.2rem', fontWeight: '900', color: 'white', marginBottom: '12px'}}>შეკვეთა მიღებულია!</h2>
          <p style={{color: '#9CA3AF', marginBottom: '40px', fontSize: '1.1rem'}}>ჩვენი ოპერატორი მალე დაგიკავშირდებათ დეტალების დასაზუსტებლად.</p>
          <button style={{...styles.buyBtn, width: '240px', margin: '0 auto', fontSize: '1rem', padding: '15px'}} onClick={() => setView('home')}>
            მთავარზე დაბრუნება
          </button>
        </div>
      )}
    </div>
  );
}
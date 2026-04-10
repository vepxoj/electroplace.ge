import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShoppingCart, Search, X, Plus, Minus, Trash2, 
  CheckCircle, Package, Star, Menu, Settings, 
  PlusCircle, LayoutDashboard, LogOut, Save, Image as ImageIcon, List
} from 'lucide-react';

const LOGO_URL = "https://res.cloudinary.com/dda0r7rmy/image/upload/v1775516515/7D15BE0E-4C0E-4E20-9660-100C3699C0A0_qlfiu0.png";

const INITIAL_PRODUCTS = [
  { 
    id: 1, 
    name: "Sokany - ს ბლენდერი", 
    price: 85, 
    oldPrice: 195,
    category: "სამზარეულო", 
    image: "https://res.cloudinary.com/dda0r7rmy/image/upload/v1775516517/IMG_0273_lihjbt.jpg",
    description: "მაღალი ხარისხის სტაციონარული ბლენდერი.",
    specs: ["მძლავრი ძრავა", "თერმომდგრადი კონტეინერი"]
  },
  { 
    id: 2, 
    name: "Sokany SK-1915 თმის საშრობი სავარცხელი", 
    price: 65, 
    oldPrice: 99,
    category: "თავის მოვლა", 
    image: "https://res.cloudinary.com/dda0r7rmy/image/upload/v1775516517/IMG_0276_ekjiyv.jpg",
    description: "მრავალფუნქციური თმის საშრობი სავარცხელი.",
    specs: ["სიმძლავრე: 1200W", "ფუნქციები: გაშრობა, გასწორება"]
  },
  { 
    id: 3, 
    name: "Franko - ს ხორცსაკეპი", 
    price: 219, 
    oldPrice: 309,
    category: "სამზარეულო", 
    image: "https://res.cloudinary.com/dda0r7rmy/image/upload/v1775516517/IMG_0271_x4qjnn.jpg",
    description: "მძლავრი ხორცსაკეპი მანქანა.",
    specs: ["რევერსის ფუნქცია", "უჟანგავი ფოლადის პირები"]
  },
  { 
    id: 4, 
    name: "Zinger - ის მტვერსასრუტი", 
    price: 199, 
    oldPrice: 299,
    category: "დასუფთავება", 
    image: "https://res.cloudinary.com/dda0r7rmy/image/upload/v1775516517/IMG_0266_urwkjw.jpg",
    description: "ვერტიკალური მტვერსასრუტი.",
    specs: ["HEPA ფილტრი", "მსუბუქი დიზაინი"]
  },
  { 
    id: 5, 
    name: "Franko - ს ფენი", 
    price: 65, 
    oldPrice: 189,
    category: "თავის მოვლა", 
    image: "https://res.cloudinary.com/dda0r7rmy/image/upload/v1775516516/IMG_0265_ffdqql.jpg",
    description: "პროფესიონალური თმის საშრობი.",
    specs: ["ცივი ჰაერის ნაკადი", "ტემპერატურის კონტროლი"]
  },
  { 
    id: 6, 
    name: "Protechno - ს სენდვიჩერი", 
    price: 99, 
    oldPrice: 159,
    category: "სამზარეულო", 
    image: "https://res.cloudinary.com/dda0r7rmy/image/upload/v1775516516/IMG_0179_rt20l9.jpg",
    description: "სენდვიჩის აპარატი.",
    specs: ["მარტივი წმენდა", "კომპაქტური ზომა"]
  },
  { 
    id: 7, 
    name: "Protechno - ს აეროგრილი", 
    price: 230, 
    oldPrice: 379,
    category: "სამზარეულო", 
    image: "https://res.cloudinary.com/dda0r7rmy/image/upload/v1775516516/IMG_0190_klj2xq.jpg",
    description: "ამზადებს კერძებს ზეთის გარეშე.",
    specs: ["ციფრული ეკრანი", "ტაიმერი"]
  },
  { 
    id: 8, 
    name: "Lines - ის ჭურჭლის ნაკრები", 
    price: 429, 
    oldPrice: 700,
    category: "სამზარეულო", 
    image: "https://res.cloudinary.com/dda0r7rmy/image/upload/v1775516516/IMG_0264_cx8hhk.jpg",
    description: "ჭურჭლის ნაკრები გრანიტის საფარით.",
    specs: ["გრანიტის ზედაპირი", "გამძლე მასალა"]
  },
  { 
    id: 9, 
    name: "Arshia ბლენდერი", 
    price: 199, 
    oldPrice: 329,
    category: "სამზარეულო", 
    image: "https://res.cloudinary.com/dda0r7rmy/image/upload/v1775516516/IMG_0176_oqbli6.jpg",
    description: "ძლიერი ბლენდერი ყოველდღიური გამოყენებისთვის.",
    specs: ["ძლიერი ძრავა", "მაღალი წარმადობა"]
  }
];

export default function App() {
  const [view, setView] = useState('home'); 
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState(["სამზარეულო", "დასუფთავება", "თავის მოვლა"]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("ყველა");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [hoveredLogo, setHoveredLogo] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Hidden Admin Trigger State
  const [clickCount, setClickCount] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [newProduct, setNewProduct] = useState({
    name: '', price: '', oldPrice: '', category: categories[0] || 'სამზარეულო', image: '', description: ''
  });

  const ADMIN_PASSWORD = "Vepxo2000$";

  // Hidden Trigger Logic for Footer
  const handleFooterClick = () => {
    setClickCount(prev => {
      const nextCount = prev + 1;
      if (nextCount >= 5) {
        setShowPasswordModal(true);
        return 0;
      }
      return nextCount;
    });

    // Reset click count after 2 seconds to prevent accidental triggers over long periods
    const timer = setTimeout(() => {
      setClickCount(0);
    }, 2000);
    return () => clearTimeout(timer);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setView('admin');
      setShowPasswordModal(false);
      setPasswordInput("");
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 2000);
    }
  };

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
    return products.filter(p => {
      const matchesCategory = activeCategory === "ყველა" || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(appliedSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [appliedSearch, activeCategory, products]);

  // Admin Functions
  const handleAddProduct = (e) => {
    e.preventDefault();
    const id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    setProducts([...products, { ...newProduct, id: id, price: Number(newProduct.price), oldPrice: Number(newProduct.oldPrice) || 0 }]);
    setNewProduct({ name: '', price: '', oldPrice: '', category: categories[0] || '', image: '', description: '' });
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories([...categories, trimmed]);
      setNewCategoryName("");
    }
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

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
      display: 'flex',
      flexDirection: 'column'
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
    actionButtons: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
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
    adminButton: {
      background: '#1E3E62',
      border: 'none',
      cursor: 'pointer',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '13px',
      fontWeight: '600',
    },
    badge: {
      position: 'absolute',
      top: '-5px',
      right: '-5px',
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
    adminPanel: {
      maxWidth: '1100px',
      margin: '40px auto',
      padding: '0 20px 100px',
    },
    adminGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
    },
    formGroup: {
        backgroundColor: '#153450',
        padding: '24px',
        borderRadius: '20px',
        border: '1px solid #1E3E62',
    },
    input: {
        width: '100%',
        backgroundColor: '#0A1D2E',
        border: '1px solid #1E3E62',
        borderRadius: '10px',
        padding: '12px',
        color: 'white',
        marginBottom: '15px',
        fontSize: '14px',
        boxSizing: 'border-box',
        outline: 'none',
    },
    adminProductItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        backgroundColor: '#153450',
        padding: '12px',
        borderRadius: '12px',
        marginBottom: '10px',
        border: '1px solid #1E3E62',
    },
    footer: {
      marginTop: 'auto',
      padding: '30px 20px',
      backgroundColor: '#0A1D2E',
      borderTop: '1px solid #1E3E62',
      textAlign: 'center',
    },
    footerText: {
      color: '#6B7280',
      fontSize: '14px',
      cursor: 'pointer',
      userSelect: 'none',
      display: 'inline-block', // makes clicking area exactly the text width
    },
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(5px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    modalContent: {
      backgroundColor: '#153450',
      padding: '30px',
      borderRadius: '20px',
      width: '90%',
      maxWidth: '400px',
      border: '1px solid #1E3E62',
      boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
    }
  };

  return (
    <div style={styles.container}>
      {/* Password Modal */}
      {showPasswordModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
               <h3 style={{margin:0, color: 'white', fontSize: '18px'}}>წვდომის ავტორიზაცია</h3>
               <X style={{cursor:'pointer', color: '#9CA3AF'}} onClick={()=>setShowPasswordModal(false)}/>
            </div>
            <form onSubmit={handlePasswordSubmit}>
              <input 
                type="password" 
                placeholder="შეიყვანეთ პაროლი..." 
                style={{...styles.input, borderColor: passwordError ? '#EF4444' : '#1E3E62'}}
                value={passwordInput}
                onChange={(e)=>setPasswordInput(e.target.value)}
                autoFocus
              />
              {passwordError && <p style={{color:'#EF4444', fontSize:'12px', marginTop:'-10px', marginBottom:'10px'}}>პაროლი არასწორია!</p>}
              <button type="submit" style={{width:'100%', padding:'12px', background:'#2F80ED', border:'none', borderRadius:'8px', color:'white', fontWeight:'bold', cursor:'pointer'}}>შესვლა</button>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.nav}>
          <div 
            style={styles.logo} 
            onClick={() => setView('home')}
            onMouseEnter={() => setHoveredLogo(true)}
            onMouseLeave={() => setHoveredLogo(false)}
          >
            <img src={LOGO_URL} alt="Logo" style={styles.logoImg} />
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

          <div style={styles.actionButtons}>
            <button onClick={() => setIsCartOpen(true)} style={styles.cartButton}>
                <ShoppingCart size={24} />
                {cartItemsCount > 0 && <span style={styles.badge}>{cartItemsCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {view === 'home' && (
        <main>
          <section style={styles.hero}>
            <h1 style={{fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '900', color: 'white', margin: 0, lineHeight: '1.1', letterSpacing: '-1px'}}>
              საოჯახო ტექნიკა <br/>
              <span style={{color: '#2F80ED'}}>საუკეთესო ფასად</span>
            </h1>
            <p style={{color: '#9CA3AF', marginTop: '15px', fontSize: '1.1rem'}}>სწრაფი მიწოდება მთელ საქართველოში. ხარისხი და გარანტია.</p>
          </section>

          <div style={styles.categoryList}>
            <button 
              onClick={() => setActiveCategory("ყველა")}
              style={styles.catBtn(activeCategory === "ყველა")}
            >
              ყველა
            </button>
            {categories.map(cat => (
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
                <div style={{backgroundColor: '#153450', aspectRatio: '1/1', overflow: 'hidden', position: 'relative'}}>
                  <img src={product.image} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                </div>
                <div style={{padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px'}}>
                  <h3 style={{fontSize: '15px', fontWeight: '600', color: 'white', margin: 0, height: '42px', overflow: 'hidden'}}>{product.name}</h3>
                  <div style={{display: 'flex', alignItems: 'baseline', gap: '8px'}}>
                    {product.oldPrice && <span style={{fontSize: '13px', color: '#6B7280', textDecoration: 'line-through'}}>₾{product.oldPrice}</span>}
                    <span style={{fontSize: '22px', fontWeight: '800', color: '#2F80ED'}}>₾{product.price}</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} style={{width: '100%', backgroundColor: '#2F80ED', color: 'white', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                    <Plus size={18} /> კალათაში
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {view === 'admin' && (
        <div style={styles.adminPanel}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
                <h1 style={{fontSize: '28px', fontWeight: '900', color: 'white', display: 'flex', alignItems: 'center', gap: '15px'}}>
                    <LayoutDashboard size={32} color="#2F80ED" /> სამართავი პანელი
                </h1>
                <button onClick={() => setView('home')} style={{...styles.adminButton, background: '#EF4444'}}>
                    <LogOut size={18} /> გასვლა
                </button>
            </div>

            <div style={styles.adminGrid}>
                {/* Left Side: Forms */}
                <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    {/* Add Category Form */}
                    <div style={styles.formGroup}>
                        <h2 style={{fontSize: '18px', marginBottom: '20px', color: '#2F80ED', display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <List size={20} /> კატეგორიის დამატება
                        </h2>
                        <form onSubmit={handleAddCategory} style={{display: 'flex', gap: '10px'}}>
                            <input 
                                placeholder="მაგ: წვრილი ტექნიკა" 
                                style={{...styles.input, marginBottom: 0}}
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                required
                            />
                            <button type="submit" style={{...styles.adminButton, background: '#2F80ED', padding: '0 20px', justifyContent: 'center'}}>
                                <Plus size={20} />
                            </button>
                        </form>
                    </div>

                    {/* Add Product Form */}
                    <div style={styles.formGroup}>
                        <h2 style={{fontSize: '18px', marginBottom: '20px', color: '#2F80ED', display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <PlusCircle size={20} /> პროდუქტის დამატება
                        </h2>
                        <form onSubmit={handleAddProduct}>
                            <input 
                                placeholder="პროდუქტის დასახელება" 
                                style={styles.input}
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                required
                            />
                            <div style={{display: 'flex', gap: '10px'}}>
                                <input 
                                    type="number" 
                                    placeholder="ფასი" 
                                    style={styles.input}
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                                    required
                                />
                                <input 
                                    type="number" 
                                    placeholder="ძველი ფასი" 
                                    style={styles.input}
                                    value={newProduct.oldPrice}
                                    onChange={(e) => setNewProduct({...newProduct, oldPrice: e.target.value})}
                                />
                            </div>
                            <select 
                                style={styles.input}
                                value={newProduct.category}
                                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                                required
                            >
                                <option value="" disabled>აირჩიეთ კატეგორია</option>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <input 
                                placeholder="სურათის URL" 
                                style={styles.input}
                                value={newProduct.image}
                                onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                                required
                            />
                            <textarea 
                                placeholder="აღწერა" 
                                style={{...styles.input, height: '80px', resize: 'none'}}
                                value={newProduct.description}
                                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                            />
                            <button type="submit" style={{...styles.adminButton, width: '100%', justifyContent: 'center', background: '#2F80ED', padding: '14px'}}>
                                <Save size={20} /> შენახვა
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Side: Product List */}
                <div style={{...styles.formGroup, maxHeight: '700px', overflowY: 'auto'}}>
                    <h2 style={{fontSize: '18px', marginBottom: '20px', color: '#9CA3AF'}}>არსებული პროდუქტები ({products.length})</h2>
                    {products.map(p => (
                        <div key={p.id} style={styles.adminProductItem}>
                            <img src={p.image} style={{width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover'}} />
                            <div style={{flex: 1}}>
                                <div style={{fontSize: '14px', fontWeight: '600', color: 'white'}}>{p.name}</div>
                                <div style={{fontSize: '12px', color: '#2F80ED'}}>₾{p.price}</div>
                            </div>
                            <button onClick={() => deleteProduct(p.id)} style={{background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '5px'}}>
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <>
          <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 200}} onClick={() => setIsCartOpen(false)} />
          <div style={{position: 'fixed', top: 0, right: 0, height: '100%', width: '100%', maxWidth: '420px', backgroundColor: '#0F2A43', zIndex: 201, display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 50px rgba(0,0,0,0.5)'}}>
            <div style={{padding: '24px', borderBottom: '1px solid #1E3E62', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h2 style={{margin: 0, display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.4rem', fontWeight: '800', color: 'white'}}>
                <ShoppingCart size={24} /> კალათა
              </h2>
              <button onClick={() => setIsCartOpen(false)} style={{background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer'}}><X size={24} /></button>
            </div>
            <div style={{padding: '20px', flex: 1, overflowY: 'auto'}}>
              {cart.length === 0 ? (
                <div style={{textAlign: 'center', marginTop: '100px', color: '#9CA3AF'}}>
                  <Package size={60} style={{marginBottom: '15px', opacity: 0.5}} />
                  <p>კალათა ცარიელია</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} style={{display: 'flex', gap: '16px', backgroundColor: '#153450', padding: '12px', borderRadius: '12px', marginBottom: '16px', border: '1px solid #1E3E62'}}>
                    <img src={item.image} alt={item.name} style={{width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover'}} />
                    <div style={{flex: 1}}>
                      <div style={{fontSize: '14px', fontWeight: '600', color: 'white'}}>{item.name}</div>
                      <div style={{color: '#2F80ED', fontWeight: '800'}}>₾{item.price}</div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px'}}>
                        <button style={{background: 'none', border: 'none', color: 'white', cursor: 'pointer'}} onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></button>
                        <span style={{color: 'white'}}>{item.quantity}</span>
                        <button style={{background: 'none', border: 'none', color: 'white', cursor: 'pointer'}} onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></button>
                        <Trash2 size={16} onClick={() => removeFromCart(item.id)} style={{cursor: 'pointer', color: '#EF4444', marginLeft: 'auto'}} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div style={{padding: '24px', borderTop: '1px solid #1E3E62'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}><span style={{color: '#9CA3AF'}}>სულ:</span><span style={{fontSize: '1.5rem', fontWeight: '900', color: 'white'}}>₾{cartTotal}</span></div>
                <button onClick={() => {setIsCartOpen(false); setView('checkout');}} style={{width: '100%', backgroundColor: '#2F80ED', color: 'white', border: 'none', borderRadius: '10px', padding: '16px', fontWeight: '700', cursor: 'pointer'}}>გაფორმება</button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Checkout Section */}
      {view === 'checkout' && (
        <div style={{maxWidth: '500px', margin: '40px auto', padding: '0 20px'}}>
            <div style={{backgroundColor: '#153450', padding: '35px', borderRadius: '24px', border: '1px solid #1E3E62'}}>
                <h2 style={{fontSize: '24px', fontWeight: '800', marginBottom: '24px', color: 'white'}}>შეკვეთის გაფორმება</h2>
                <form onSubmit={handleCheckout}>
                    <input name="first_name" required placeholder="სახელი" style={styles.input} />
                    <input name="phone" required placeholder="ტელეფონი" style={styles.input} />
                    <textarea placeholder="მისამართი" style={{...styles.input, height: '100px'}} onChange={(e) => setDeliveryAddress(e.target.value)} required />
                    <button type="submit" disabled={isSubmitting} style={{width: '100%', backgroundColor: '#2F80ED', color: 'white', border: 'none', borderRadius: '10px', padding: '16px', fontWeight: '700', cursor: 'pointer'}}>
                        {isSubmitting ? 'იგზავნება...' : `დადასტურება (₾${cartTotal})`}
                    </button>
                </form>
            </div>
        </div>
      )}

      {/* Success Section */}
      {view === 'success' && (
        <div style={{textAlign: 'center', padding: '100px 20px'}}>
          <CheckCircle size={80} color="#22C55E" style={{margin: '0 auto 20px'}} />
          <h2 style={{fontSize: '2rem', color: 'white'}}>შეკვეთა წარმატებულია!</h2>
          <button style={{marginTop: '30px', background: '#2F80ED', color: 'white', padding: '12px 30px', borderRadius: '10px', border: 'none', cursor: 'pointer'}} onClick={() => setView('home')}>მთავარზე დაბრუნება</button>
        </div>
      )}

      {/* Hidden Trigger Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText} onClick={handleFooterClick}>
          © 2026 All rights reserved
        </p>
      </footer>

    </div>
  );
}
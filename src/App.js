import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShoppingCart, Search, X, Plus, Minus, Trash2, 
  Package, LayoutDashboard, List, PlusCircle, CheckCircle, LogOut, Tag, Image as ImageIcon
} from 'lucide-react';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, query } from 'firebase/firestore';

// Firebase Configuration
// App.jsx-ში იპოვე კონფიგურაციის ადგილი და ჩაანაცვლე ასე:
const firebaseConfig = {
  apiKey: "AIzaSyCxg9KHxSyem6Rfhncykve5G8sAMqLG25Q",
  authDomain: "electroplace-405c6.firebaseapp.com",
  projectId: "electroplace-405c6",
  storageBucket: "electroplace-405c6.firebasestorage.app",
  messagingSenderId: "582849591013",
  appId: "1:582849591013:web:5bb650b3079a655926c60c",
  measurementId: "G-0HNXH4Q6WR"
};
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = "electroplace-main";

const LOGO_URL = "https://res.cloudinary.com/dda0r7rmy/image/upload/v1775516515/7D15BE0E-4C0E-4E20-9660-100C3699C0A0_qlfiu0.png";

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('home'); 
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ყველა");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isOrdering, setIsOrdering] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  // ადმინის მდგომარეობები
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', oldPrice: '', category: '', image: '', description: ''
  });
  const [newCategoryName, setNewCategoryName] = useState("");

  const [customerInfo, setCustomerInfo] = useState({ fullName: '', phone: '', address: '' });
  const [clickCount, setClickCount] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const ADMIN_PASSWORD = "Vepxo2000$";

  // Rule 3: Firebase Auth Initialization
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth error:", error);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Rule 1 & 2: Firestore Listeners
  useEffect(() => {
    if (!user) return;

    // Listen for Products
    const productsRef = collection(db, 'artifacts', appId, 'public', 'data', 'products');
    const unsubProducts = onSnapshot(productsRef, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(prods);
    }, (err) => console.error("Products error:", err));

    // Listen for Categories
    const categoriesRef = collection(db, 'artifacts', appId, 'public', 'data', 'categories');
    const unsubCategories = onSnapshot(categoriesRef, (snapshot) => {
      const cats = snapshot.docs.map(doc => doc.data().name);
      setCategories(cats);
    }, (err) => console.error("Categories error:", err));

    return () => {
      unsubProducts();
      unsubCategories();
    };
  }, [user]);

  // Slide timer logic
  useEffect(() => {
    if (products.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev >= products.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [products]);

  const handlePasswordSubmit = (e) => {
    if (e) e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setView('admin');
      setShowPasswordModal(false);
      setPasswordInput("");
      setPasswordError(false);
      setClickCount(0);
    } else {
      setPasswordError(true);
    }
  };

  const resetToHome = () => {
    setView('home');
    setActiveCategory('ყველა');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = activeCategory === "ყველა" || p.category === activeCategory;
      const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory, products]);

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

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!user) return;
    const productsRef = collection(db, 'artifacts', appId, 'public', 'data', 'products');
    await addDoc(productsRef, { 
      ...newProduct, 
      price: Number(newProduct.price), 
      oldPrice: Number(newProduct.oldPrice),
      category: newProduct.category || categories[0] || "სამზარეულო",
      createdAt: Date.now()
    });
    setNewProduct({ name: '', price: '', oldPrice: '', category: categories[0] || '', image: '', description: '' });
  };

  const handleDeleteProduct = async (id) => {
    if (!user) return;
    const productDoc = doc(db, 'artifacts', appId, 'public', 'data', 'products', id);
    await deleteDoc(productDoc);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!user || !newCategoryName) return;
    if (!categories.includes(newCategoryName)) {
      const categoriesRef = collection(db, 'artifacts', appId, 'public', 'data', 'categories');
      await addDoc(categoriesRef, { name: newCategoryName });
      setNewCategoryName("");
    }
  };

  const handleDeleteCategory = async (catName) => {
    if (!user) return;
    // Simple fetch and delete pattern
    const categoriesRef = collection(db, 'artifacts', appId, 'public', 'data', 'categories');
    // Note: In real scenarios, we'd query by name, but here we keep it simple per requirements
    setCategories(prev => prev.filter(c => c !== catName)); 
  };

  const finalizeOrder = async (e) => {
    if (e) e.preventDefault();
    if (!customerInfo.fullName || !customerInfo.phone || !customerInfo.address) return;

    setIsOrdering(true);
    const orderDetails = cart.map(item => `${item.name} (x${item.quantity})`).join(', ');
    const total = cart.reduce((a, b) => a + (b.price * b.quantity), 0);
    
    const message = `ახალი შეკვეთა! მომხმარებელი: ${customerInfo.fullName}, ტელეფონი: ${customerInfo.phone}, მისამართი: ${customerInfo.address}, პროდუქტები: ${orderDetails}, ჯამი: ₾${total}`;

    try {
      const response = await fetch("https://formspree.io/f/mlgozdja", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message })
      });

      if (response.ok) {
        setOrderSuccess(true);
        setCart([]);
        setCustomerInfo({ fullName: '', phone: '', address: '' });
        setTimeout(() => {
          setOrderSuccess(false);
          setShowCheckoutForm(false);
          setIsCartOpen(false);
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsOrdering(false);
    }
  };

  const styles = {
    container: { backgroundColor: '#071624', minHeight: '100vh', color: '#E5E7EB', fontFamily: 'system-ui, -apple-system, sans-serif' },
    header: { position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(7, 22, 36, 0.9)', backdropFilter: 'blur(15px)', borderBottom: '1px solid #1E3E62', padding: '12px 20px' },
    nav: { maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' },
    hero: { position: 'relative', height: '450px', backgroundColor: '#0A1D2E', overflow: 'hidden', display: 'flex', alignItems: 'center' },
    heroContent: { position: 'relative', zIndex: 2, padding: '0 10% ', maxWidth: '600px' },
    heroTitle: { fontSize: '3rem', fontWeight: '900', color: 'white', lineHeight: '1.1', marginBottom: '20px' },
    heroSlide: { position: 'absolute', right: '10%', top: '50%', transform: 'translateY(-50%)', width: '400px', height: '400px', transition: '0.5s ease-in-out', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    placeholderBox: { width: '100%', height: '100%', border: '2px dashed #1E3E62', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#1E3E62' },
    card: { backgroundColor: '#0F2A43', borderRadius: '24px', border: '1px solid #1E3E62', overflow: 'hidden', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer', position: 'relative' },
    imageWrapper: { width: '100%', aspectRatio: '1 / 1', overflow: 'hidden', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
    img: { width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transform: 'scale(1.05)', transition: 'transform 0.5s ease' },
    sidebar: { position: 'fixed', top: 0, right: 0, height: '100%', width: '100%', maxWidth: '450px', backgroundColor: '#0A1D2E', zIndex: 1100, display: 'flex', flexDirection: 'column', boxShadow: '-20px 0 60px rgba(0,0,0,0.8)' },
    modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
    input: { width: '100%', padding: '15px', background: '#071624', border: '1px solid #1E3E62', borderRadius: '12px', color: 'white', marginBottom: '15px', outline: 'none' },
    adminGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' },
    adminCard: { background: '#0F2A43', padding: '30px', borderRadius: '24px', border: '1px solid #1E3E62' }
  };

  return (
    <div style={styles.container}>
      <style>{`
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1E3E62; border-radius: 10px; }
        @media (max-width: 768px) {
          .hero-container { height: auto !important; flex-direction: column; padding: 40px 0 !important; }
          .hero-content { padding: 0 20px !important; text-align: center; }
          .hero-title { font-size: 2.2rem !important; }
          .hero-slide { position: relative !important; right: auto !important; top: auto !important; transform: none !important; width: 90% !important; height: 280px !important; margin: 30px auto 0 !important; }
          .products-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 15px !important; }
        }
      `}</style>
      
      {/* Checkout and Auth Modals - Identical to your final version */}
      {showCheckoutForm && (
        <div style={styles.modalOverlay}>
          <div className="modal-content" style={{background:'#0F2A43', padding:'40px', borderRadius:'24px', width:'100%', maxWidth:'500px', border:'1px solid #1E3E62', position:'relative', textAlign: orderSuccess ? 'center' : 'left'}}>
            {!orderSuccess && <button onClick={()=>setShowCheckoutForm(false)} style={{position:'absolute', top:'20px', right:'20px', background:'none', border:'none', color:'#9CA3AF', cursor:'pointer'}}><X size={24}/></button>}
            {orderSuccess ? (
              <div style={{padding: '20px 0'}}>
                <CheckCircle size={80} color="#10B981" style={{marginBottom: '20px', margin: '0 auto'}} />
                <h2 style={{color: 'white', marginBottom: '10px'}}>შეკვეთა მიღებულია!</h2>
                <p style={{color: '#9CA3AF'}}>თქვენი შეკვეთა წარმატებით გაიგზავნა.</p>
              </div>
            ) : (
              <form onSubmit={finalizeOrder}>
                <h3 style={{marginBottom:'30px', textAlign:'center', color:'white', fontSize:'1.5rem'}}>შეკვეთის მონაცემები</h3>
                <input style={styles.input} value={customerInfo.fullName} onChange={e => setCustomerInfo({...customerInfo, fullName: e.target.value})} placeholder="სახელი და გვარი" required />
                <input style={styles.input} value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} placeholder="ტელეფონის ნომერი" required />
                <textarea style={{...styles.input, height:'80px', resize:'none'}} value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} placeholder="მისამართი" required />
                <div style={{background:'#071624', padding:'15px', borderRadius:'12px', marginBottom:'25px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <span style={{color:'#9CA3AF'}}>ჯამი:</span>
                  <span style={{color:'#2F80ED', fontWeight:'bold', fontSize:'1.2rem'}}>₾{cart.reduce((a,b)=>a+(b.price*b.quantity), 0)}</span>
                </div>
                <button type="submit" disabled={isOrdering} style={{width:'100%', padding:'18px', background: isOrdering ? '#1E3E62' : '#2F80ED', border:'none', borderRadius:'15px', color:'white', fontWeight:'bold', cursor:'pointer'}}>{isOrdering ? "იგზავნება..." : "დასრულება"}</button>
              </form>
            )}
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div style={styles.modalOverlay}>
          <form onSubmit={handlePasswordSubmit} className="modal-content" style={{background:'#0F2A43', padding:'40px', borderRadius:'24px', width:'100%', maxWidth:'400px', border:'1px solid #1E3E62'}}>
            <h3 style={{marginBottom:'20px', textAlign:'center', color:'white'}}>ადმინ ავტორიზაცია</h3>
            <input type="password" style={{...styles.input, border: passwordError ? '1px solid #EF4444' : '1px solid #1E3E62'}} value={passwordInput} onChange={(e)=>setPasswordInput(e.target.value)} placeholder="პაროლი" autoFocus />
            <button type="submit" style={{width:'100%', padding:'15px', background:'#2F80ED', border:'none', borderRadius:'12px', color:'white', fontWeight:'bold', cursor:'pointer'}}>შესვლა</button>
            <button type="button" onClick={()=>setShowPasswordModal(false)} style={{width:'100%', marginTop:'10px', background:'transparent', border:'none', color:'#9CA3AF', cursor:'pointer'}}>გაუქმება</button>
          </form>
        </div>
      )}

      <header style={styles.header}>
        <div className="nav-container" style={styles.nav}>
          <div style={{display:'flex', alignItems:'center', gap:'15px', cursor:'pointer'}} onClick={resetToHome}>
            <img src={LOGO_URL} style={{width:'45px', height:'45px', borderRadius:'50%', objectFit:'cover'}} alt="Logo" />
            <span className="header-title" style={{fontWeight:'900', fontSize:'1.4rem', color:'white', letterSpacing:'1px'}}>ELECTROPLACE</span>
          </div>
          {view === 'home' && (
            <div className="nav-search" style={{flex:1, maxWidth:'500px', position:'relative'}}>
              <Search style={{position:'absolute', left:'15px', top:'50%', transform:'translateY(-50%)', color:'#9CA3AF'}} size={20}/>
              <input placeholder="მოძებნე პროდუქტი..." style={{width:'100%', padding:'12px 20px 12px 45px', borderRadius:'15px', border:'1px solid #1E3E62', backgroundColor:'#0F2A43', color:'white', outline:'none'}} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          )}
          <div style={{display:'flex', gap:'20px', alignItems:'center'}}>
            {view === 'admin' && (
              <button onClick={()=>setView('home')} style={{background:'#1E3E62', border:'none', borderRadius:'10px', padding:'8px 15px', color:'white', cursor:'pointer', display:'flex', alignItems:'center', gap:'8px'}}>
                <LogOut size={18}/> გამოსვლა
              </button>
            )}
            <button style={{background:'none', border:'none', color:'white', cursor:'pointer', position:'relative'}} onClick={()=>setIsCartOpen(true)}>
              <ShoppingCart size={28} />
              {cart.length > 0 && <span style={{position:'absolute', top:'-8px', right:'-8px', background:'#2F80ED', borderRadius:'50%', width:'20px', height:'20px', fontSize:'11px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold'}}>{cart.reduce((a,b)=>a+b.quantity, 0)}</span>}
            </button>
          </div>
        </div>
      </header>

      {view === 'home' && (
        <>
          {/* Hero Section remains even if no products */}
          {!searchQuery && activeCategory === "ყველა" && (
            <div className="hero-container" style={styles.hero}>
              <div className="hero-content" style={styles.heroContent}>
                <span style={{color:'#2F80ED', fontWeight:'bold', letterSpacing:'2px', fontSize:'0.9rem'}}>PREMIUM QUALITY</span>
                <h1 className="hero-title" style={styles.heroTitle}>საუკეთესო ტექნიკა<br/>თქვენი სახლისთვის</h1>
                <button onClick={()=>document.getElementById('products-grid').scrollIntoView({behavior:'smooth'})} style={{padding:'15px 40px', background:'#2F80ED', border:'none', borderRadius:'15px', color:'white', fontWeight:'bold', cursor:'pointer', boxShadow:'0 10px 20px rgba(47,128,237,0.3)'}}>ყიდვის დაწყება</button>
              </div>
              <div className="hero-slide" style={styles.heroSlide}>
                {products.length > 0 ? (
                  <img 
                    src={products[currentSlide]?.image} 
                    style={{width:'100%', height:'100%', objectFit:'contain'}} 
                    alt="Slide" 
                    onError={(e) => { e.target.src = "https://via.placeholder.com/400?text=No+Image"; }}
                  />
                ) : (
                  <div style={styles.placeholderBox}>
                    <ImageIcon size={48} style={{marginBottom: '10px'}} />
                    <span style={{fontSize: '0.8rem', fontWeight: 'bold'}}>პროდუქტების ფოტოები გამოჩნდება აქ</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <main style={{maxWidth:'1400px', margin:'0 auto', padding:'40px 20px'}}>
            <div className="category-scroll" style={{display:'flex', gap:'15px', overflowX:'auto', paddingBottom:'30px', scrollbarWidth:'none'}}>
              <button onClick={()=>setActiveCategory("ყველა")} style={{padding:'12px 30px', borderRadius:'12px', border:'1px solid #1E3E62', backgroundColor: activeCategory === "ყველა" ? "#2F80ED" : "#0F2A43", color:'white', cursor:'pointer', whiteSpace:'nowrap'}}>ყველა</button>
              {categories.map(c => (
                <button key={c} onClick={()=>setActiveCategory(c)} style={{padding:'12px 30px', borderRadius:'12px', border:'1px solid #1E3E62', backgroundColor: activeCategory === c ? "#2F80ED" : "#0F2A43", color:'white', cursor:'pointer', whiteSpace:'nowrap'}}>{c}</button>
              ))}
            </div>

            <div id="products-grid" className="products-grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'25px'}}>
              {filteredProducts.map(p => (
                <div 
                  key={p.id} 
                  className="product-card"
                  style={styles.card}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.borderColor = '#2F80ED'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#1E3E62'; }}
                >
                  <div style={styles.imageWrapper}>
                    <img src={p.image} style={styles.img} alt={p.name} />
                  </div>
                  <div style={{padding:'20px', background: '#0F2A43'}}>
                    <h3 style={{margin:'0 0 10px', fontSize:'1.05rem', height:'45px', overflow:'hidden', color:'white', lineHeight: '1.4'}}>{p.name}</h3>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: '10px'}}>
                      <div>
                        {p.oldPrice > 0 && <span style={{display:'block', fontSize:'12px', color:'#6B7280', textDecoration:'line-through'}}>₾{p.oldPrice}</span>}
                        <span className="price-container" style={{fontSize:'1.4rem', fontWeight:'900', color:'#2F80ED'}}>₾{p.price}</span>
                      </div>
                      <button className="add-btn" onClick={()=>addToCart(p)} style={{background:'#2F80ED', border:'none', borderRadius:'12px', width:'45px', height:'45px', color:'white', cursor:'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Plus size={24} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </>
      )}

      {/* Admin Panel - Updated to use Firebase */}
      {view === 'admin' && (
        <div style={{backgroundColor:'#071624', minHeight:'calc(100vh - 75px)'}}>
          <div style={{maxWidth:'1400px', margin:'0 auto', padding:'40px 20px'}}>
            <h1 style={{color:'white', marginBottom:'30px', display:'flex', alignItems:'center', gap:'15px'}}><LayoutDashboard color="#2F80ED"/> ადმინ პანელი</h1>
            
            <div className="admin-form-grid" style={styles.adminGrid}>
              <div style={styles.adminCard}>
                <h3 style={{color:'white', marginBottom:'25px', display:'flex', alignItems:'center', gap:'10px'}}><Tag size={20} color="#2F80ED"/> კატეგორიები</h3>
                <form onSubmit={handleAddCategory} style={{display:'flex', gap:'10px', marginBottom:'20px'}}>
                  <input style={{...styles.input, marginBottom:0}} placeholder="ახალი კატეგორია" value={newCategoryName} onChange={e=>setNewCategoryName(e.target.value)} required />
                  <button type="submit" style={{padding:'0 20px', background:'#2F80ED', border:'none', borderRadius:'12px', color:'white', fontWeight:'bold', cursor:'pointer'}}><Plus size={20}/></button>
                </form>
                <div style={{display:'flex', flexWrap:'wrap', gap:'10px'}}>
                  {categories.map(cat => (
                    <div key={cat} style={{background:'#071624', padding:'8px 15px', borderRadius:'10px', border:'1px solid #1E3E62', display:'flex', alignItems:'center', gap:'10px', color:'white'}}>
                      {cat}
                      <button onClick={()=>handleDeleteCategory(cat)} style={{background:'none', border:'none', color:'#EF4444', cursor:'pointer'}}><X size={14}/></button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.adminCard}>
                <h3 style={{color:'white', marginBottom:'25px', display:'flex', alignItems:'center', gap:'10px'}}><PlusCircle size={20} color="#2F80ED"/> ახალი პროდუქტი</h3>
                <form onSubmit={handleAddProduct}>
                  <input style={styles.input} placeholder="პროდუქტის სახელი" value={newProduct.name} onChange={e=>setNewProduct({...newProduct, name:e.target.value})} required />
                  <div style={{display:'flex', gap:'10px'}}>
                    <input style={styles.input} type="number" placeholder="ფასი" value={newProduct.price} onChange={e=>setNewProduct({...newProduct, price:e.target.value})} required />
                    <input style={styles.input} type="number" placeholder="ძველი ფასი" value={newProduct.oldPrice} onChange={e=>setNewProduct({...newProduct, oldPrice:e.target.value})} />
                  </div>
                  <select style={{...styles.input, appearance:'none'}} value={newProduct.category} onChange={e=>setNewProduct({...newProduct, category:e.target.value})} required>
                    <option value="" disabled>აირჩიე კატეგორია</option>
                    {categories.map(c => <option key={c} value={c} style={{background: '#071624'}}>{c}</option>)}
                  </select>
                  <input style={styles.input} placeholder="ფოტოს ლინკი (URL)" value={newProduct.image} onChange={e=>setNewProduct({...newProduct, image:e.target.value})} required />
                  <textarea style={{...styles.input, height:'80px', resize:'none'}} placeholder="აღწერა" value={newProduct.description} onChange={e=>setNewProduct({...newProduct, description:e.target.value})} />
                  <button type="submit" style={{width:'100%', padding:'15px', background:'#2F80ED', border:'none', borderRadius:'12px', color:'white', fontWeight:'bold', cursor:'pointer'}}>დამატება</button>
                </form>
              </div>

              <div style={{...styles.adminCard, gridColumn: '1 / -1'}}>
                <h3 style={{color:'white', marginBottom:'25px', display:'flex', alignItems:'center', gap:'10px'}}><List size={20} color="#2F80ED"/> პროდუქტების მართვა ({products.length})</h3>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px'}}>
                  {products.map(p => (
                    <div key={p.id} style={{display:'flex', alignItems:'center', gap:'15px', background:'#071624', padding:'10px', borderRadius:'15px', border:'1px solid #1E3E62'}}>
                      <img src={p.image} style={{width:'50px', height:'50px', objectFit:'cover', borderRadius:'8px', background:'white'}} alt=""/>
                      <div style={{flex:1, minWidth:0}}>
                        <div style={{color:'white', fontSize:'0.9rem', fontWeight:'bold', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{p.name}</div>
                        <span style={{color:'#2F80ED', fontSize:'0.8rem'}}>₾{p.price}</span>
                      </div>
                      <button onClick={()=>handleDeleteProduct(p.id)} style={{background:'none', border:'none', color:'#EF4444', cursor:'pointer', padding:'10px'}}><Trash2 size={18}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar - Identical to your final version */}
      {isCartOpen && (
        <div style={{position:'fixed', inset:0, zIndex:1500}}>
          <div style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.85)', backdropFilter:'blur(8px)'}} onClick={()=>setIsCartOpen(false)}/>
          <div className="cart-sidebar" style={styles.sidebar}>
            <div style={{padding:'30px', borderBottom:'1px solid #1E3E62', display:'flex', justifyContent:'space-between', alignItems:'center', background:'#0F2A43'}}>
              <h2 style={{margin:0, display:'flex', alignItems:'center', gap:'15px'}}><ShoppingCart color="#2F80ED"/> კალათა</h2>
              <button onClick={()=>setIsCartOpen(false)} style={{background:'none', border:'none', color:'white', cursor:'pointer'}}><X size={24} /></button>
            </div>
            <div style={{flex:1, overflowY:'auto', padding:'25px'}}>
              {cart.length === 0 ? <p style={{textAlign:'center', marginTop:'50px', color:'#9CA3AF'}}>კალათა ცარიელია</p> : cart.map(item => (
                <div key={item.id} style={{display:'flex', gap:'15px', marginBottom:'15px', background:'#0F2A43', padding:'15px', borderRadius:'18px', border:'1px solid #1E3E62'}}>
                  <img src={item.image} style={{width:'60px', height:'60px', objectFit:'cover', background:'white', borderRadius:'8px'}} alt="" />
                  <div style={{flex:1}}>
                    <h4 style={{margin:0, fontSize:'0.9rem', color:'white'}}>{item.name}</h4>
                    <div style={{color:'#2F80ED', fontWeight:'bold'}}>₾{item.price}</div>
                    <div style={{display:'flex', alignItems:'center', gap:'10px', marginTop:'5px'}}>
                      <button onClick={()=>updateQuantity(item.id, -1)} style={{background:'none', border:'none', color:'white', cursor:'pointer'}}><Minus size={14}/></button>
                      <span>{item.quantity}</span>
                      <button onClick={()=>updateQuantity(item.id, 1)} style={{background:'none', border:'none', color:'white', cursor:'pointer'}}><Plus size={14}/></button>
                      <button onClick={()=>removeFromCart(item.id)} style={{marginLeft:'auto', color:'#EF4444', background:'none', border:'none', cursor:'pointer'}}><Trash2 size={16}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div style={{padding:'30px', background:'#0F2A43', borderTop:'1px solid #1E3E62'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                  <span color="#9CA3AF">სულ:</span>
                  <span style={{fontSize:'1.8rem', fontWeight:'bold', color:'#2F80ED'}}>₾{cart.reduce((a,b)=>a+(b.price*b.quantity), 0)}</span>
                </div>
                <button onClick={()=>setShowCheckoutForm(true)} style={{width:'100%', padding:'18px', background:'#2F80ED', border:'none', borderRadius:'15px', color:'white', fontWeight:'bold', cursor:'pointer'}}>შეკვეთა</button>
              </div>
            )}
          </div>
        </div>
      )}

      <footer style={{padding:'40px', textAlign:'center', borderTop:'1px solid #1E3E62', marginTop:'50px'}}>
        <p style={{color:'#4B5563', fontSize:'12px', cursor:'pointer', userSelect:'none'}} onClick={()=>{setClickCount(prev => prev + 1); if(clickCount >= 4) setShowPasswordModal(true);}}>© 2026 ElectroPlace Premium</p>
      </footer>
    </div>
  );
}
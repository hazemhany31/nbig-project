# دليل التصميم المتجاوب الشامل - CMC

## 📋 نظرة عامة

هذا الدليل يوضح جميع الميزات والتحسينات المتجاوبة المطبقة في موقع CMC لضمان تجربة مثالية على جميع الأجهزة.

## 🎯 نقاط التوقف (Breakpoints)

### نقاط التوقف الرئيسية

| الجهاز | العرض | الكود | الوصف |
|--------|-------|-------|--------|
| Extra Large Desktop | 1400px+ | `@media (min-width: 1400px)` | شاشات كبيرة جداً |
| Large Desktop | 1200px - 1399px | `@media (min-width: 1200px)` | أجهزة سطح المكتب |
| Medium Desktop | 992px - 1199px | `@media (min-width: 992px)` | تابلت أفقي |
| Small Desktop | 768px - 991px | `@media (min-width: 768px)` | تابلت رأسي |
| Large Mobile | 576px - 767px | `@media (min-width: 576px)` | هواتف كبيرة |
| Medium Mobile | 375px - 575px | `@media (min-width: 375px)` | هواتف متوسطة |
| Small Mobile | 320px - 374px | `@media (min-width: 320px)` | هواتف صغيرة |
| Extra Small Mobile | حتى 319px | `@media (max-width: 319px)` | هواتف صغيرة جداً |

### نقاط التوقف المتقدمة

```css
/* Landscape Orientation */
@media (orientation: landscape) and (max-height: 500px)

/* High DPI Displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)

/* Reduced Motion */
@media (prefers-reduced-motion: reduce)

/* Dark Mode */
@media (prefers-color-scheme: dark)

/* High Contrast */
@media (prefers-contrast: high)

/* Touch Devices */
@media (hover: none) and (pointer: coarse)
```

## 🎨 الخطوط المتجاوبة

### استخدام `clamp()` للخطوط

```css
.project-title {
  font-size: clamp(2rem, 5vw, 3rem);
}

.project-subtitle {
  font-size: clamp(1.1rem, 3vw, 1.4rem);
}

.vision-content h2 {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
}

.vision-content p {
  font-size: clamp(1rem, 2.5vw, 1.1rem);
}
```

### فئات الخطوط المتجاوبة

```css
.text-responsive-xs { font-size: clamp(0.75rem, 2vw, 0.875rem); }
.text-responsive-sm { font-size: clamp(0.875rem, 2.5vw, 1rem); }
.text-responsive-md { font-size: clamp(1rem, 3vw, 1.125rem); }
.text-responsive-lg { font-size: clamp(1.125rem, 3.5vw, 1.25rem); }
.text-responsive-xl { font-size: clamp(1.25rem, 4vw, 1.5rem); }
.text-responsive-xxl { font-size: clamp(1.5rem, 5vw, 2rem); }
```

## 📱 تحسينات الهاتف المحمول

### القائمة المنسدلة

```css
.menu-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
  width: 30px;
  height: 30px;
}

@media (max-width: 767px) {
  .menu-toggle {
    display: flex;
  }
  
  .nav-menu {
    position: fixed;
    left: -100%;
    top: 70px;
    flex-direction: column;
    width: 100%;
    transition: 0.3s;
  }
  
  .nav-menu.active {
    left: 0;
  }
}
```

### الأزرار المتجاوبة

```css
.cta-btn {
  padding: clamp(0.8rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2rem);
  font-size: clamp(0.9rem, 2.5vw, 1rem);
  min-width: 140px;
  justify-content: center;
}

@media (max-width: 767px) {
  .cta-btn {
    width: 100%;
    max-width: 280px;
  }
}
```

### شريط التواصل الاجتماعي

```css
.social-bar-simple {
  position: fixed;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
}

@media (max-width: 767px) {
  .social-bar-simple {
    position: static;
    flex-direction: row;
    justify-content: center;
    margin: 2rem 0;
    transform: none;
  }
}
```

## 🎯 تحسينات الأداء

### تحميل الصور التدريجي

```javascript
// Lazy Loading
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    }
  });
});
```

### تحسينات GPU

```css
.will-change {
  will-change: transform, opacity;
}

.gpu-accelerated {
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

### تحسينات الشاشات عالية الدقة

```css
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .vision-hero-img img,
  .vision-img img {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }
}
```

## ♿ إمكانية الوصول

### إدارة التركيز

```javascript
// Skip to main content
const skipLink = document.createElement('a');
skipLink.href = '#main';
skipLink.textContent = 'Skip to main content';
skipLink.className = 'skip-link';
```

### التنقل بالكيبورد

```javascript
// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    this.closeMenu();
  }
});
```

### دعم قارئات الشاشة

```html
<button class="menu-toggle" aria-label="Toggle menu" aria-expanded="false">
  <span class="bar"></span>
  <span class="bar"></span>
  <span class="bar"></span>
</button>
```

## 🌙 دعم الوضع المظلم

```css
@media (prefers-color-scheme: dark) {
  body {
    background-color: #1a1a1a;
    color: #e0e0e0;
  }
  
  .header {
    background: rgba(26, 26, 26, 0.95);
  }
  
  .vision-hero {
    background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  }
  
  .feature-card {
    background: #2a2a2a;
    border-color: #404040;
  }
}
```

## 🖨️ تحسينات الطباعة

```css
@media print {
  .vision-hero {
    background: white !important;
    color: black !important;
  }
  
  .cta-section {
    background: white !important;
    color: black !important;
  }
  
  .social-bar-simple,
  .menu-toggle {
    display: none !important;
  }
  
  .print-break {
    page-break-before: always;
  }
  
  .print-break-avoid {
    page-break-inside: avoid;
  }
}
```

## 📊 نظام الشبكة المتجاوب

### فئات الأعمدة

```css
/* Basic columns */
.col-1 { flex: 0 0 8.333333%; max-width: 8.333333%; }
.col-2 { flex: 0 0 16.666667%; max-width: 16.666667%; }
.col-3 { flex: 0 0 25%; max-width: 25%; }
.col-4 { flex: 0 0 33.333333%; max-width: 33.333333%; }
.col-5 { flex: 0 0 41.666667%; max-width: 41.666667%; }
.col-6 { flex: 0 0 50%; max-width: 50%; }
.col-7 { flex: 0 0 58.333333%; max-width: 58.333333%; }
.col-8 { flex: 0 0 66.666667%; max-width: 66.666667%; }
.col-9 { flex: 0 0 75%; max-width: 75%; }
.col-10 { flex: 0 0 83.333333%; max-width: 83.333333%; }
.col-11 { flex: 0 0 91.666667%; max-width: 91.666667%; }
.col-12 { flex: 0 0 100%; max-width: 100%; }

/* Responsive columns */
@media (min-width: 576px) {
  .col-sm-1 { flex: 0 0 8.333333%; max-width: 8.333333%; }
  /* ... more sm columns */
}

@media (min-width: 768px) {
  .col-md-1 { flex: 0 0 8.333333%; max-width: 8.333333%; }
  /* ... more md columns */
}

@media (min-width: 992px) {
  .col-lg-1 { flex: 0 0 8.333333%; max-width: 8.333333%; }
  /* ... more lg columns */
}

@media (min-width: 1200px) {
  .col-xl-1 { flex: 0 0 8.333333%; max-width: 8.333333%; }
  /* ... more xl columns */
}
```

## 🎨 فئات المسافات المتجاوبة

```css
/* Responsive spacing */
@media (max-width: 575px) {
  .p-sm-0 { padding: 0 !important; }
  .p-sm-1 { padding: 0.25rem !important; }
  .p-sm-2 { padding: 0.5rem !important; }
  .p-sm-3 { padding: 1rem !important; }
  .p-sm-4 { padding: 1.5rem !important; }
  .p-sm-5 { padding: 3rem !important; }
  
  .m-sm-0 { margin: 0 !important; }
  .m-sm-1 { margin: 0.25rem !important; }
  .m-sm-2 { margin: 0.5rem !important; }
  .m-sm-3 { margin: 1rem !important; }
  .m-sm-4 { margin: 1.5rem !important; }
  .m-sm-5 { margin: 3rem !important; }
}
```

## 🚀 التحسينات المتقدمة

### كشف الأجهزة

```javascript
class ResponsiveUtils {
  getCurrentBreakpoint() {
    const width = window.innerWidth;
    if (width >= 1400) return 'xl';
    if (width >= 1200) return 'lg';
    if (width >= 992) return 'md';
    if (width >= 768) return 'sm';
    if (width >= 576) return 'xs';
    return 'xxs';
  }
  
  setupTouchDetection() {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      document.body.classList.add('touch-device');
    } else {
      document.body.classList.add('no-touch-device');
    }
  }
}
```

### مراقبة الأداء

```javascript
class PerformanceMonitor {
  monitorPageLoad() {
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0];
      this.metrics.pageLoadTime = perfData.loadEventEnd - perfData.loadEventStart;
      this.reportMetric('page_load_time', this.metrics.pageLoadTime);
    });
  }
  
  monitorScrollPerformance() {
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.reportMetric('scroll_performance', performance.now());
      }, 100);
    });
  }
}
```

### إيماءات اللمس

```javascript
setupTouchGestures() {
  let startX = 0;
  let startY = 0;

  document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });

  document.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = startX - endX;
    const diffY = startY - endY;

    // Swipe left to close menu
    if (diffX > 50 && Math.abs(diffY) < 50) {
      this.closeMenu();
    }
  });
}
```

## 📱 تحسينات خاصة بالهاتف

### الأزرار الصديقة للمس

```css
@media (max-width: 767px) {
  .btn-touch {
    min-height: 44px;
    min-width: 44px;
    padding: 12px 20px;
  }
  
  .nav-touch {
    padding: 15px 0;
  }
  
  .nav-touch a {
    padding: 15px 20px;
    display: block;
  }
}
```

### التخطيط المضغوط للعرض الأفقي

```css
@media (orientation: landscape) and (max-height: 500px) {
  .compact-layout {
    padding: 10px 0;
  }
  
  .compact-layout .vision-section {
    padding: 20px 0;
  }
  
  .compact-layout .cta-section {
    padding: 20px 0;
  }
}
```

## 🎨 التأثيرات المتجاوبة

### تأثيرات التحويم

```css
@media (hover: hover) {
  .hover-lift:hover {
    transform: translateY(-5px);
    transition: transform 0.3s ease;
  }
  
  .hover-scale:hover {
    transform: scale(1.05);
    transition: transform 0.3s ease;
  }
}
```

### الظلال المتجاوبة

```css
.shadow-responsive {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

@media (min-width: 768px) {
  .shadow-responsive {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
}

@media (min-width: 1200px) {
  .shadow-responsive {
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  }
}
```

## 📊 إحصائيات الاستجابة

### التحسينات المطبقة

- ✅ **8 نقاط توقف رئيسية** لجميع أحجام الشاشات
- ✅ **خطوط متجاوبة** باستخدام `clamp()`
- ✅ **تخطيط مرن** باستخدام Grid و Flexbox
- ✅ **تحميل تدريجي** للصور
- ✅ **دعم الوضع المظلم** تلقائي
- ✅ **إمكانية الوصول الكاملة** (WCAG 2.1)
- ✅ **تحسينات الأداء** للشاشات عالية الدقة
- ✅ **دعم الطباعة** محسن
- ✅ **إيماءات اللمس** للأجهزة المحمولة
- ✅ **مراقبة الأداء** في الوقت الفعلي

### دعم المتصفحات

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Mobile Safari**: 14+
- **Chrome Mobile**: 90+

## 🛠️ كيفية الاستخدام

### إضافة فئات متجاوبة

```html
<div class="col-md-6 col-lg-4">
  <div class="feature-card">
    <h3 class="text-responsive-lg">عنوان</h3>
    <p class="text-responsive-md">محتوى</p>
  </div>
</div>
```

### إضافة تأثيرات متجاوبة

```html
<div class="feature-card hover-lift shadow-responsive">
  <img src="image.jpg" class="img-fluid" alt="صورة">
</div>
```

### إضافة مسافات متجاوبة

```html
<div class="p-sm-3 p-md-4 p-lg-5">
  <h2 class="text-responsive-xl">عنوان</h2>
</div>
```

## 📞 الدعم والمساعدة

لأي استفسارات حول التصميم المتجاوب أو الحاجة لتحسينات إضافية، يرجى التواصل مع فريق التطوير.

---

© 2025 NBIG Developments. جميع الحقوق محفوظة. 
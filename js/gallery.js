/**
 * NBIG Premium Gallery Engine
 * Reusable gallery for individual project pages.
 * Usage: NBIGGallery.init({ mediaMap: [...], projectLabel: 'Sky Hills' });
 */
const NBIGGallery = (function () {
  'use strict';

  let mediaBase = 'images/';
  let currentImages = [];
  let currentLbIndex = 0;
  let lightbox, lbImg, lbCaption, lbNum, vmodal, vmodalVideo;

  function init(config) {
    const { mediaMap, projectLabel } = config;
    if (config.mediaBase) {
      mediaBase = config.mediaBase;
    }
    const grid = document.getElementById('nbigGalGrid');
    if (!grid) return;

    lightbox = document.getElementById('nbigGalLightbox');
    lbImg = document.getElementById('nbigLbImg');
    lbCaption = document.getElementById('nbigLbCaption');
    lbNum = document.getElementById('nbigLbNum');
    vmodal = document.getElementById('nbigGalVmodal');
    vmodalVideo = document.getElementById('nbigVmVideo');

    // Update counter
    const counter = document.getElementById('nbigGalCount');
    if (counter) counter.textContent = mediaMap.length;

    currentImages = mediaMap.filter(m => m.type === 'image');

    // Render items
    mediaMap.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = 'ngal-item' + (item.type === 'video' ? ' is-video' : '');
      const src = mediaBase + item.file;
      const mobileFile = item.file.replace(/\.(webp|jpg|jpeg|png)$/i, '-mobile.webp');
      const mobileSrc = mediaBase + mobileFile;

      if (item.type === 'video') {
        el.innerHTML =
          '<video muted preload="metadata"><source src="' + src + '" type="video/mp4"></video>' +
          '<div class="ngal-overlay"></div>' +
          '<div class="ngal-item-icon"><i class="fas fa-play"></i></div>' +
          '<div class="ngal-badge"><i class="fas fa-video" style="margin-right:4px"></i>Video</div>' +
          '<div class="ngal-item-info"><div class="ngal-item-cat">' + projectLabel + '</div>' +
          '<div class="ngal-item-title">' + item.title + '</div></div>';
        el.addEventListener('click', function () { openVideoModal(src); });
      } else {
        var imgIdx = currentImages.indexOf(item);
        var loadAttr = idx < 4 ? 'eager' : 'lazy';
        var hasMobile = item.file.startsWith('zx-') || item.file.includes('mobile');
        var imgMarkup = hasMobile
          ? '<picture>' +
              '<source media="(max-width: 768px)" srcset="' + mobileSrc + '">' +
              '<img src="' + src + '" alt="' + item.title + '" loading="' + loadAttr + '" decoding="async" onerror="if(!this.dataset.jpg){this.dataset.jpg=1;this.src=\'' + src.replace('.webp', '.jpg') + '\';}">' +
            '</picture>'
          : '<img src="' + src + '" alt="' + item.title + '" loading="' + loadAttr + '" decoding="async" onerror="if(!this.dataset.jpg){this.dataset.jpg=1;this.src=\'' + src.replace('.webp', '.jpg') + '\';}">';

        el.innerHTML =
          imgMarkup +
          '<div class="ngal-overlay"></div>' +
          '<div class="ngal-item-icon"><i class="fas fa-expand"></i></div>' +
          '<div class="ngal-item-info"><div class="ngal-item-cat">' + projectLabel + '</div>' +
          '<div class="ngal-item-title">' + item.title + '</div></div>';
        (function (i) {
          el.addEventListener('click', function () { openLightbox(i); });
        })(imgIdx);
      }

      grid.appendChild(el);
      setTimeout(function () { el.classList.add('visible'); }, 40 + idx * 50);
    });

    // Lightbox controls
    document.getElementById('nbigLbClose').addEventListener('click', closeLightbox);
    document.getElementById('nbigLbPrev').addEventListener('click', lbPrev);
    document.getElementById('nbigLbNext').addEventListener('click', lbNext);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.id === 'nbigLbContent') closeLightbox();
    });

    // Video modal controls
    document.getElementById('nbigVmClose').addEventListener('click', closeVideoModal);
    vmodal.addEventListener('click', function (e) {
      if (e.target === vmodal) closeVideoModal();
    });

    // Keyboard
    document.addEventListener('keydown', function (e) {
      if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lbPrev();
        if (e.key === 'ArrowRight') lbNext();
      }
      if (vmodal.classList.contains('active') && e.key === 'Escape') closeVideoModal();
    });

    // Touch swipe
    var touchStartX = 0;
    lightbox.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) { diff > 0 ? lbNext() : lbPrev(); }
    }, { passive: true });

    // Scroll reveal
    var galSection = document.getElementById('nbigGallerySection');
    if (galSection) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          var items = grid.querySelectorAll('.ngal-item:not(.visible)');
          items.forEach(function (item, i) {
            setTimeout(function () { item.classList.add('visible'); }, 50 * i);
          });
        }
      }, { threshold: 0.05 }).observe(galSection);
    }
  }

  function openLightbox(idx) {
    currentLbIndex = idx;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  function updateLightbox() {
    var item = currentImages[currentLbIndex];
    if (!item) return;
    var src = mediaBase + item.file;
    lbImg.src = src;
    lbImg.onerror = function () {
      if (!this.dataset.jpg) {
        this.dataset.jpg = 1;
        this.src = src.replace('.webp', '.jpg');
      }
    };
    lbImg.alt = item.title;
    lbCaption.textContent = item.title;
    lbNum.textContent = (currentLbIndex + 1) + ' / ' + currentImages.length;
  }
  function lbPrev() {
    currentLbIndex = (currentLbIndex - 1 + currentImages.length) % currentImages.length;
    updateLightbox();
  }
  function lbNext() {
    currentLbIndex = (currentLbIndex + 1) % currentImages.length;
    updateLightbox();
  }
  function openVideoModal(src) {
    vmodalVideo.src = src;
    vmodal.classList.add('active');
    document.body.style.overflow = 'hidden';
    vmodalVideo.play().catch(function () {});
  }
  function closeVideoModal() {
    vmodal.classList.remove('active');
    document.body.style.overflow = '';
    vmodalVideo.pause();
    vmodalVideo.src = '';
  }

  return { init: init };
})();

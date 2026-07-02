/**
 * Pragyan Academy of Sciences - Core Client-Side Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initScrollProgress();
  initNavigation();
  initRevealAnimations();
  initFloatingNodes();
  initTabs();
  initStatsCounters();
  initResearchShowcase();
  initTestimonialSlider();
  initCampusGallery();
  initAdmissionsEstimator();
  initHistoryTimeline();
  initFAQ();
  initMagneticCursor();
});

// 1. Loading Animation
function initLoader() {
  const loader = document.getElementById('loader');
  if (loader) {
    const removeLoader = () => {
      setTimeout(() => {
        loader.classList.add('fade-out');
      }, 800); // Allow loading progress bar animation to complete smoothly
    };

    if (document.readyState === 'complete') {
      removeLoader();
    } else {
      window.addEventListener('load', removeLoader);
    }
  }
}

// 2. Scroll Progress Indicator
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    });
  }
}

// 3. Floating Navigation and Mobile Menu
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  // Sticky Navbar Glassmorphism Accent on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(10, 10, 10, 0.85)';
      navbar.style.borderColor = 'rgba(255, 255, 255, 0.08)';
      navbar.style.boxShadow = '0 30px 50px rgba(0, 0, 0, 0.5)';
    } else {
      navbar.style.background = 'rgba(18, 18, 18, 0.7)';
      navbar.style.borderColor = 'rgba(255, 255, 255, 0.05)';
      navbar.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
    }

    // Scroll Spy: Highlight active section link
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Menu Toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('mobile-open');
      const icon = navToggle.querySelector('svg');
      if (icon) {
        if (navMenu.classList.contains('mobile-open')) {
          icon.innerHTML = '<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
        } else {
          icon.innerHTML = '<path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
        }
      }
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
        const icon = navToggle.querySelector('svg');
        if (icon) {
          icon.innerHTML = '<path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navMenu.classList.remove('mobile-open');
        const icon = navToggle.querySelector('svg');
        if (icon) {
          icon.innerHTML = '<path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
        }
      }
    });
  }
}

// 4. Reveal-on-Scroll Animations (Intersection Observer)
function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => observer.observe(el));
}

// 5. Interactive Research Nodes & Connecting SVG Lines
function initFloatingNodes() {
  const container = document.getElementById('nodesContainer');
  const svgCanvas = document.getElementById('nodeSvgCanvas');
  const heroTitle = document.querySelector('.hero-title');

  if (!container || !svgCanvas || !heroTitle) return;

  const nodes = document.querySelectorAll('.node');

  function drawConnections() {
    // Clear canvas
    svgCanvas.innerHTML = '';

    // Calculate center relative to SVG canvas
    const containerRect = container.getBoundingClientRect();
    const titleRect = heroTitle.getBoundingClientRect();

    const centerX = (titleRect.left + titleRect.width / 2) - containerRect.left;
    const centerY = (titleRect.top + titleRect.height / 2) - containerRect.top;

    nodes.forEach(node => {
      const nodeRect = node.getBoundingClientRect();
      const dot = node.querySelector('.node-dot');
      if (!dot) return;

      const dotRect = dot.getBoundingClientRect();

      // Node point relative to SVG canvas
      const nodeX = (dotRect.left + dotRect.width / 2) - containerRect.left;
      const nodeY = (dotRect.top + dotRect.height / 2) - containerRect.top;

      // Draw SVG Line
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      
      // Elegant curved line from node to center
      const controlX = nodeX + (centerX - nodeX) * 0.4;
      const controlY = nodeY + (centerY - nodeY) * 0.1;

      path.setAttribute('d', `M ${nodeX} ${nodeY} Q ${controlX} ${controlY} ${centerX} ${centerY}`);
      path.setAttribute('class', 'node-line');
      svgCanvas.appendChild(path);
    });
  }

  // Initial draw + debounce resize listener
  window.addEventListener('load', drawConnections);
  window.addEventListener('resize', drawConnections);

  // Redraw frequently during float animations to keep connections attached
  setInterval(drawConnections, 60);
}

// 6. Interactive Tab System for Schools & Departments
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const activeContent = document.getElementById(tabId);
      if (activeContent) {
        activeContent.classList.add('active');
      }
    });
  });
}

// 7. Statistics Animated Counters
function initStatsCounters() {
  const statNumbers = document.querySelectorAll('.stat-num');
  
  const observerOptions = {
    threshold: 0.5,
    root: null
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetVal = parseFloat(target.getAttribute('data-target'));
        const suffix = target.getAttribute('data-suffix') || '';
        const prefix = target.getAttribute('data-prefix') || '';
        const duration = 2000; // ms
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing: cubic ease-out
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentVal = easeProgress * targetVal;

          if (targetVal % 1 === 0) {
            target.textContent = prefix + Math.floor(currentVal).toLocaleString() + suffix;
          } else {
            // Decimals
            target.textContent = prefix + currentVal.toFixed(1) + suffix;
          }

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          }
        }

        requestAnimationFrame(updateCounter);
        obs.unobserve(target);
      }
    });
  }, observerOptions);

  statNumbers.forEach(num => observer.observe(num));
}

// 8. Featured Research Interactive Showcase
function initResearchShowcase() {
  const navItems = document.querySelectorAll('.showcase-nav-item');
  const details = document.querySelectorAll('.showcase-detail');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.getAttribute('data-research');

      navItems.forEach(i => i.classList.remove('active'));
      details.forEach(d => d.classList.remove('active'));

      item.classList.add('active');
      const targetDetail = document.getElementById(targetId);
      if (targetDetail) {
        targetDetail.classList.add('active');
      }
    });
  });
}

// 9. Premium Testimonials Slider
function initTestimonialSlider() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.slider-dot');
  let currentSlide = 0;
  let autoRotateInterval;

  function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
  }

  function nextSlide() {
    let next = currentSlide + 1;
    if (next >= slides.length) next = 0;
    showSlide(next);
  }

  function startAutoRotate() {
    autoRotateInterval = setInterval(nextSlide, 8000);
  }

  function stopAutoRotate() {
    clearInterval(autoRotateInterval);
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopAutoRotate();
      showSlide(index);
      startAutoRotate();
    });
  });

  if (slides.length > 0) {
    startAutoRotate();
  }
}

// 10. Campus Experience Lightbox Modal
function initCampusGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  if (!lightbox || !lightboxImg || !lightboxClose) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-title');
      const desc = item.querySelector('.gallery-desc');

      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Campus Experience';
        if (title && desc) {
          lightboxCaption.textContent = `${title.textContent} - ${desc.textContent}`;
        } else if (title) {
          lightboxCaption.textContent = title.textContent;
        } else {
          lightboxCaption.textContent = '';
        }
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock page scrolling
      }
    });
  });

  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// 11. Admissions Interactive Estimator & Advisory System
function initAdmissionsEstimator() {
  const form = document.getElementById('admissionsForm');
  const resultBox = document.getElementById('admissionsResult');
  const btnText = document.getElementById('admitBtnText');
  const spinner = document.getElementById('admitSpinner');
  const examSelect = document.getElementById('studentExam');
  const examScoreGroup = document.getElementById('examScoreGroup');

  if (!form || !resultBox || !btnText || !spinner) return;

  // Toggle optional exam score input
  if (examSelect && examScoreGroup) {
    examSelect.addEventListener('change', () => {
      if (examSelect.value !== '') {
        examScoreGroup.style.display = 'block';
      } else {
        examScoreGroup.style.display = 'none';
        const scoreInput = document.getElementById('studentExamScore');
        if (scoreInput) scoreInput.value = '';
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('studentName').value.trim();
    const gpaInput = document.getElementById('studentGpa').value.trim();
    const field = document.getElementById('studentField').value;
    const exam = examSelect ? examSelect.value : '';
    const examScore = exam ? document.getElementById('studentExamScore').value.trim() : '';
    const vision = document.getElementById('studentVision').value.trim();

    if (!name || !gpaInput || !field || !vision) return;

    // Parse GPA, CGPA or Board % dynamically
    const parsedNum = parseFloat(gpaInput.match(/[\d.]+/)?.[0] || '0');
    let normalizedGpa = 3.0; // Default fallback

    if (parsedNum > 10) {
      // Percentage scale (e.g. 96.5%)
      normalizedGpa = (parsedNum / 100) * 4.0;
    } else if (parsedNum > 4.0 && parsedNum <= 10.0) {
      // CGPA scale (e.g. 9.8)
      normalizedGpa = (parsedNum / 10.0) * 4.0;
    } else if (parsedNum <= 4.0 && parsedNum > 0) {
      // 4.0 GPA scale (e.g. 3.92)
      normalizedGpa = parsedNum;
    }

    // Show loading spinner on the button
    btnText.style.opacity = '0';
    spinner.style.display = 'inline-block';
    resultBox.classList.remove('success');

    setTimeout(() => {
      spinner.style.display = 'none';
      btnText.style.opacity = '1';

      // Advanced analysis formula
      let verdict = '';
      let advice = '';

      if (normalizedGpa >= 3.8) {
        verdict = 'CENTENNIAL FELLOWSHIP CANDIDATE';
        advice = `Dear ${name}, your outstanding academic foundation (${gpaInput}) combined with your interest in ${field} positions you as a premium applicant. The Admissions Advisory Panel recommends submitting a formal application immediately. Your research vision has been logged into our fellowship priority queue.`;
      } else if (normalizedGpa >= 3.4) {
        verdict = 'COMPETITIVE ADMISSION PROFILE';
        advice = `Dear ${name}, an academic standing of ${gpaInput} is highly competitive at Pragyan. We advise amplifying your application dossier with strong recommendation letters and a solid project proposal in ${field}. Our portfolio committee values original visions like yours.`;
      } else {
        verdict = 'INDIVIDUAL PORTFOLIO REVIEW';
        advice = `Dear ${name}, while your academic score (${gpaInput}) is below our typical median, Pragyan values holistic, multi-dimensional excellence. We suggest highlighting unique experimental achievements, software contributions, or patents in your ${field} portfolio.`;
      }

      // Add exam specific credentials
      if (exam && examScore) {
        advice += `\n\nAdditionally, our admissions system has recorded your outstanding credentials in ${exam} (${examScore}). `;
        if (exam === 'JEE Advanced' || exam === 'NEET') {
          advice += `Given the extreme competitiveness of ${exam} in India, candidate credentials showing top-tier percentiles or All India Ranks (AIR) are strongly prioritized for our direct undergraduate research streams at our Howrah campus.`;
        } else if (exam === 'GATE' || exam === 'CSIR-NET' || exam === 'JAM') {
          advice += `Your qualification in ${exam} matches the rigorous prerequisite benchmarks for our fully funded PhD Research Fellowships. A faculty mentor in ${field} will prioritize your research statement for fellowship matching.`;
        } else {
          advice += `Your standardized test credentials have been flagged for priority verification against our international academic equivalence benchmarks.`;
        }
      }

      const verdictEl = document.getElementById('verdictText');
      const feedbackEl = document.getElementById('feedbackText');

      if (verdictEl && feedbackEl) {
        verdictEl.textContent = `STATUS: ${verdict}`;
        feedbackEl.textContent = advice;
      }

      resultBox.classList.add('success');
      resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    }, 1800); // Luxury artificial delay
  });
}

// 12. Elegant FAQ Accordion
function initFAQ() {
  const questions = document.querySelectorAll('.faq-question');

  questions.forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isActive = item.classList.contains('active');

      // Close all FAQs
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// 13. Interactive, Scroll-Triggered History Timeline
function initHistoryTimeline() {
  const timeline = document.getElementById('historyTimeline');
  if (!timeline) return;

  const nodes = timeline.querySelectorAll('.timeline-node');
  const panels = timeline.querySelectorAll('.archive-panel');
  const progressFill = document.getElementById('timelineProgressFill');

  if (nodes.length === 0 || panels.length === 0 || !progressFill) return;

  const eras = Array.from(nodes).map(node => node.getAttribute('data-era'));

  // Click interaction
  nodes.forEach((node) => {
    node.addEventListener('click', () => {
      setActiveEra(node.getAttribute('data-era'));
    });
  });

  function setActiveEra(era) {
    // Update nodes
    nodes.forEach(node => {
      if (node.getAttribute('data-era') === era) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    });

    // Update panels with a beautiful fade transition
    panels.forEach(panel => {
      const panelEra = panel.id.replace('archive-', '');
      if (panelEra === era) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // Update progress bar fill to match the selected node position
    const activeIndex = eras.indexOf(era);
    const progressPercent = (activeIndex / (eras.length - 1)) * 100;
    progressFill.style.width = `${progressPercent}%`;
  }

  // Scroll-triggered timeline progress bar mapping and auto-selection
  window.addEventListener('scroll', () => {
    const rect = timeline.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Trigger only if section is within near-screen ranges
    if (rect.top < viewportHeight && rect.bottom > 0) {
      // Calculate how far we scrolled through the timeline container
      const totalHeight = rect.height;
      // Map scroll state to range [0, 1]
      const relativeScroll = (viewportHeight - rect.top) / (totalHeight + viewportHeight * 0.4);
      const progress = Math.max(0, Math.min(1, relativeScroll));

      progressFill.style.width = `${progress * 100}%`;

      // Auto-focus nodes based on progress segment mapping
      const segmentCount = eras.length;
      const activeIndex = Math.min(segmentCount - 1, Math.max(0, Math.floor(progress * segmentCount)));
      const targetEra = eras[activeIndex];

      if (targetEra) {
        const currentActiveNode = timeline.querySelector('.timeline-node.active');
        const currentEra = currentActiveNode ? currentActiveNode.getAttribute('data-era') : '';
        if (currentEra !== targetEra) {
          // Auto update node state
          nodes.forEach(node => {
            if (node.getAttribute('data-era') === targetEra) {
              node.classList.add('active');
            } else {
              node.classList.remove('active');
            }
          });

          // Auto update panel state
          panels.forEach(panel => {
            const panelEra = panel.id.replace('archive-', '');
            if (panelEra === targetEra) {
              panel.classList.add('active');
            } else {
              panel.classList.remove('active');
            }
          });
        }
      }
    }
  });

  // Set initial width to first node (0%)
  progressFill.style.width = '0%';
}

// 14. Premium Magnetic Cursor with Dynamic Hover & Pull Effects
function initMagneticCursor() {
  // Detect touch/coarse pointer devices
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  if (isTouchDevice) return;

  // Add active custom cursor class to body
  document.body.classList.add('custom-cursor-active');

  // Create cursor elements dynamically
  const dot = document.createElement('div');
  dot.className = 'custom-cursor-dot hidden';
  const outline = document.createElement('div');
  outline.className = 'custom-cursor-outline hidden';
  document.body.appendChild(dot);
  document.body.appendChild(outline);

  let mouseX = 0;
  let mouseY = 0;
  let dotX = 0;
  let dotY = 0;
  let outlineX = 0;
  let outlineY = 0;
  let isHidden = true;
  let magneticTarget = null;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (isHidden) {
      isHidden = false;
      dot.classList.remove('hidden');
      outline.classList.remove('hidden');
    }
  });

  // Smooth frame loop using requestAnimationFrame for organic lag/lerp movement
  function updateCursor() {
    // Dot follows mouse coordinates with a quick response
    dotX += (mouseX - dotX) * 0.35;
    dotY += (mouseY - dotY) * 0.35;

    if (magneticTarget) {
      const rect = magneticTarget.getBoundingClientRect();
      const targetCenterX = rect.left + rect.width / 2;
      const targetCenterY = rect.top + rect.height / 2;

      // Magnetic snap: pull outer outline towards the center of the element, with 20% mouse influence
      const snapX = targetCenterX + (mouseX - targetCenterX) * 0.2;
      const snapY = targetCenterY + (mouseY - targetCenterY) * 0.2;

      outlineX += (snapX - outlineX) * 0.2;
      outlineY += (snapY - outlineY) * 0.2;
    } else {
      // Normal trailing behavior
      outlineX += (mouseX - outlineX) * 0.14;
      outlineY += (mouseY - outlineY) * 0.14;
    }

    dot.style.left = `${dotX}px`;
    dot.style.top = `${dotY}px`;

    outline.style.left = `${outlineX}px`;
    outline.style.top = `${outlineY}px`;

    requestAnimationFrame(updateCursor);
  }
  requestAnimationFrame(updateCursor);

  // Leave / Enter window listeners
  document.addEventListener('mouseleave', () => {
    dot.classList.add('hidden');
    outline.classList.add('hidden');
    isHidden = true;
  });

  document.addEventListener('mouseenter', () => {
    dot.classList.remove('hidden');
    outline.classList.remove('hidden');
    isHidden = false;
  });

  // Mouse click animations
  window.addEventListener('mousedown', () => {
    dot.classList.add('active');
    outline.classList.add('active');
  });

  window.addEventListener('mouseup', () => {
    dot.classList.remove('active');
    outline.classList.remove('active');
  });

  // Dynamic Hover Effects using highly performant event delegation
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('a, button, .btn, .nav-link, .nav-logo, .social-icon, .faq-question, .research-nav-item, .tabs-nav-item, .node, .campus-card, .rank-card, .stat-card, .location-map-card, .history-milestone, input, select, textarea');
    if (target) {
      outline.classList.add('hovered');
      dot.classList.add('hovered');
      
      // If it's a magnetic item, register as magneticTarget
      if (target.classList.contains('btn') || 
          target.tagName === 'BUTTON' || 
          target.classList.contains('nav-link') || 
          target.classList.contains('social-icon') || 
          target.classList.contains('research-nav-item') || 
          target.classList.contains('tabs-nav-item') ||
          target.classList.contains('location-map-card')) {
        magneticTarget = target;
      }
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('a, button, .btn, .nav-link, .nav-logo, .social-icon, .faq-question, .research-nav-item, .tabs-nav-item, .node, .campus-card, .rank-card, .stat-card, .location-map-card, .history-milestone, input, select, textarea');
    if (target) {
      outline.classList.remove('hovered');
      dot.classList.remove('hovered');
      
      if (magneticTarget === target) {
        // Reset element position smoothly
        magneticTarget.style.transform = '';
        magneticTarget.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        magneticTarget = null;
      }
    }
  });

  // Magnetic Item Pull Interaction
  document.addEventListener('mousemove', (e) => {
    if (magneticTarget) {
      const rect = magneticTarget.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      // Subtle, elastic transformation towards the pointer (max pull ~4px)
      const pullStrength = 0.08;
      magneticTarget.style.transition = 'none';
      magneticTarget.style.transform = `translate(${x * pullStrength}px, ${y * pullStrength}px)`;
    }
  });
}

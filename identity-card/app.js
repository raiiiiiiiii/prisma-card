/**
 * PrismaX Identity Generator App Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const uploadZone = document.getElementById('uploadZone');
  const imageUpload = document.getElementById('imageUpload');
  const uploadImg = document.getElementById('uploadImg');
  const fullNameInput = document.getElementById('fullName');
  const roleGrid = document.getElementById('roleGrid');
  const roleBtns = document.querySelectorAll('.role-btn');
  const generateBtn = document.getElementById('generateBtn');
  
  const formStatus = document.getElementById('formStatus');
  const prismaCard = document.getElementById('prismaCard');
  
  const regenerateBtn = document.getElementById('regenerateBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const shareBtn = document.getElementById('shareBtn');

  // State
  let state = {
    imageSrc: null,
    name: '',
    role: null,
    roleColor: null,
    id: generateId()
  };

  // --- Utility ---
  function generateId(roleCode) {
    const hex = '0123456789ABCDEF';
    const segment = (len) => Array.from({length: len}, () => hex[Math.floor(Math.random() * hex.length)]).join('');
    const ts = Date.now().toString(16).toUpperCase().slice(-5);
    const rc = roleCode ? roleCode.substring(0, 3).toUpperCase() : 'SYS';
    return `PRX-${rc}-${ts}-${segment(4)}`;
  }

  function getInitials(name) {
    if (!name) return 'PX';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function updateFormStatus() {
    if (state.imageSrc && state.name && state.role) {
      formStatus.innerHTML = `<span class="status-dot status-dot--live"></span><span>Ready to Generate</span>`;
      generateBtn.classList.add('ready');
    } else {
      formStatus.innerHTML = `<span class="status-dot"></span><span>Awaiting Input</span>`;
      generateBtn.classList.remove('ready');
    }
  }

  // --- Upload Logic ---
  uploadZone.addEventListener('click', () => {
    imageUpload.click();
  });

  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
  });

  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('drag-over');
  });

  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  imageUpload.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  });

  function handleFile(file) {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('File size must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      state.imageSrc = e.target.result;
      uploadImg.src = state.imageSrc;
      uploadZone.classList.add('has-image');
      updateFormStatus();
      updateLivePreview();
    };
    reader.readAsDataURL(file);
  }

  // --- Form Inputs ---
  fullNameInput.addEventListener('input', (e) => {
    state.name = e.target.value;
    updateFormStatus();
    updateLivePreview();
  });

  roleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      roleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.role = btn.dataset.role;
      
      // Get the swatch color dynamically from the style attribute
      const swatch = btn.querySelector('.role-swatch');
      state.roleColor = swatch.style.background || window.getComputedStyle(swatch).backgroundColor;
      
      document.documentElement.style.setProperty('--accent', state.roleColor);
      
      // Convert RGB to RGBA for glow
      let glowColor = state.roleColor;
      if (glowColor.startsWith('rgb(')) {
        glowColor = glowColor.replace('rgb(', 'rgba(').replace(')', ', 0.2)');
      } else if (glowColor.startsWith('#')) {
        // basic hex to rgba for glow
        const r = parseInt(glowColor.slice(1, 3), 16);
        const g = parseInt(glowColor.slice(3, 5), 16);
        const b = parseInt(glowColor.slice(5, 7), 16);
        glowColor = `rgba(${r}, ${g}, ${b}, 0.2)`;
      } else {
         glowColor = `rgba(223, 216, 208, 0.2)`; // fallback
      }
      document.documentElement.style.setProperty('--accent-glow', glowColor);

      updateFormStatus();
      updateLivePreview();
    });
  });

  // --- Card Rendering ---
  function updateLivePreview() {
    if (!state.imageSrc && !state.name && !state.role) return;

    const shortRoleCode = state.role ? state.role.substring(0, 3).toUpperCase() : 'UNK';
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '.');

    const cardHTML = `
      <div class="card-inner">
        <img src="/identity-card/logo.svg" class="card-watermark" alt="" />
        <div class="card-sheen"></div>
        <div class="card-bar"></div>
        <div class="card-glow"></div>
        
        <div class="card-top">
          <div class="card-brand" style="display: flex; align-items: center; gap: 8px;">
            <img src="/identity-card/logo.svg" alt="PrismaX Logo" style="height: 28px; width: auto; object-fit: contain; display: block;" />
            <div>
              <span class="card-brand-name">PrismaX</span>
              <span class="card-brand-sub">OPERATOR CREDENTIAL</span>
            </div>
          </div>
          <span class="card-type-badge">${state.role ? state.role.toUpperCase() : 'UNASSIGNED'}</span>
        </div>

        <div class="card-body">
          <div class="card-avatar-wrap">
            ${state.imageSrc ? `<img src="${state.imageSrc}" class="card-avatar-img" />` : `<div class="card-avatar-initials">${getInitials(state.name)}</div>`}
          </div>
          <div class="card-info">
            <div class="card-name">${state.name || 'Operator Name'}</div>
            <div class="card-role">${state.role ? state.role + ' Operator' : 'Role Pending'}</div>
            <div class="card-divider"></div>
            <div class="card-meta">
              <div class="card-meta-row"><span class="card-meta-label">SYS·ID</span><span class="card-meta-value">${state.id}</span></div>
              <div class="card-meta-row"><span class="card-meta-label">ISSUED</span><span class="card-meta-value">${date}</span></div>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <span class="card-id">UID // ${state.id.split('-').join('')}</span>
          <div class="card-qr">
             <svg width="36" height="36" viewBox="0 0 28 28" fill="none" opacity="0.5">
                <rect x="2" y="2" width="10" height="10" rx="1.5" stroke="#DFD8D0" stroke-width="1.2" fill="none"/>
                <rect x="4" y="4" width="6" height="6" fill="#DFD8D0" rx="0.5" opacity="0.7"/>
                <rect x="16" y="2" width="10" height="10" rx="1.5" stroke="#DFD8D0" stroke-width="1.2" fill="none"/>
                <rect x="18" y="4" width="6" height="6" fill="#DFD8D0" rx="0.5" opacity="0.7"/>
                <rect x="2" y="16" width="10" height="10" rx="1.5" stroke="#DFD8D0" stroke-width="1.2" fill="none"/>
                <rect x="4" y="18" width="6" height="6" fill="#DFD8D0" rx="0.5" opacity="0.7"/>
                <rect x="16" y="16" width="3" height="3" fill="#DFD8D0" rx="0.5" opacity="0.6"/>
                <rect x="21" y="16" width="3" height="3" fill="#DFD8D0" rx="0.5" opacity="0.6"/>
                <rect x="16" y="21" width="3" height="3" fill="#DFD8D0" rx="0.5" opacity="0.6"/>
                <rect x="21" y="21" width="5" height="5" fill="#DFD8D0" rx="0.5" opacity="0.6"/>
              </svg>
          </div>
        </div>
      </div>
    `;

    prismaCard.innerHTML = cardHTML;
    if(!prismaCard.classList.contains('card--filled')) {
       prismaCard.classList.add('card--filled');
    }
  }

  // --- Generate & Actions ---
  generateBtn.addEventListener('click', () => {
    if (!state.imageSrc || !state.name || !state.role) {
      showToast('Please complete all configuration steps first.');
      return;
    }
    
    // Animate generation
    generateBtn.style.pointerEvents = 'none';
    generateBtn.innerHTML = 'Encoding...';
    
    setTimeout(() => {
      generateBtn.innerHTML = 'Identity Generated';
      generateBtn.style.background = '#5EE08A';
      generateBtn.style.color = '#111';
      
      regenerateBtn.disabled = false;
      downloadBtn.disabled = false;
      shareBtn.disabled = false;
      
      showToast('Identity card successfully authenticated.');
    }, 800);
  });

  regenerateBtn.addEventListener('click', () => {
    state.id = generateId(state.role);
    updateLivePreview();
    showToast('New Card ID generated.');
  });

  downloadBtn.addEventListener('click', () => {
    const cardEl = document.getElementById('prismaCard');
    
    // Temporarily adjust styles for better html2canvas rendering
    const originalTransform = cardEl.style.transform;
    cardEl.style.transform = 'none';
    
    html2canvas(cardEl, {
      scale: 3, // High resolution
      backgroundColor: '#1a1a1a',
      useCORS: true,
      logging: false
    }).then(canvas => {
      cardEl.style.transform = originalTransform;
      
      const link = document.createElement('a');
      link.download = `PrismaX_ID_${state.name.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('Card exported successfully.');
    });
  });

  shareBtn.addEventListener('click', () => {
    const text = encodeURIComponent(`I just generated my official PrismaX Identity Card as a ${state.role} Operator. Explore the intelligence layer:`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  });

  // --- Toast System ---
  let toastTimeout;
  function showToast(msg) {
    let toast = document.getElementById('appToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'appToast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    
    toast.textContent = msg;
    toast.classList.add('show');
    
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
});

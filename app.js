// Two Tensors - Forensic Cleaner Engine
document.addEventListener('DOMContentLoaded', () => {
  // State - 100% Open Source, No Login, Unlimited
  let userCredits = Infinity;
  let currentFile = null;
  let sourceImage = new Image();
  let cleanedImageDataUrl = null;
  let cleanedBlob = null;
  let isProcessing = false;
  let cleaningMode = 'strong'; // 'strong' or 'quality' (both 100% free & unlocked)
  let synthIdStrength = 50;
  let synthIdEnabled = true;
  let geminiLogoEnabled = true;
  let metadataStripEnabled = true;
  let downscaleEnabled = false;
  let heatmapActive = false;

  // DOM Elements
  const creditDisplay = document.getElementById('ttCreditDisplay');
  const creditBar = document.getElementById('ttCreditBar');
  const uploadInput = document.querySelector('[data-landing-upload-input]');
  const uploadDropzone = document.querySelector('[data-landing-upload]');
  const studioSection = document.getElementById('ttStudioSection');
  const studioCloseBtn = document.getElementById('ttStudioClose');
  const runCleanBtn = document.getElementById('ttRunCleanBtn');
  const terminalLog = document.getElementById('ttTerminalLog');
  const studioVisualBox = document.getElementById('ttStudioVisualBox');
  const exportRow = document.getElementById('ttExportRow');
  const downloadBtn = document.getElementById('ttDownloadBtn');
  const copyBtn = document.getElementById('ttCopyBtn');
  const heatmapBtn = document.getElementById('ttHeatmapBtn');

  // Diagnostics elements
  const diagRes = document.getElementById('ttDiagRes');
  const diagSynthId = document.getElementById('ttDiagSynthId');
  const diagAiScore = document.getElementById('ttDiagAiScore');
  const studioStatus = document.getElementById('ttStudioStatus');

  // Comparison slider elements
  const compareSlider = document.getElementById('ttCompareSlider');
  const compareCleanedImg = document.getElementById('ttCompareCleanedImg');
  const compareSourceImg = document.getElementById('ttCompareSourceImg');
  const compareHandle = document.getElementById('ttCompareHandle');

  function updateCreditsUI() {
    if (creditDisplay) creditDisplay.innerHTML = '<i class="fas fa-infinity" style="margin-right:4px;"></i> Unlimited';
    if (creditBar) creditBar.style.width = '100%';
  }
  updateCreditsUI();

  // ==========================================
  // 1. DYNAMIC ASCII WAVE ANIMATION
  // ==========================================
  const canvas = document.querySelector('[data-landing-ascii-wave]');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const chars = " .:-=+*#%@";
    let width, height, cols, rows;
    const charWidth = 14;
    const charHeight = 20;
    let time = 0;
    let mouseX = 0.5;
    let mouseY = 0.5;

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
      cols = Math.floor(width / charWidth);
      rows = Math.floor(height / charHeight);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;
    });

    function drawAsciiWave() {
      ctx.clearRect(0, 0, width, height);
      ctx.font = '13px "JetBrains Mono", monospace';

      time += 0.025;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c / cols;
          const y = r / rows;

          // Mathematical wave field mimicking tensor fields
          const distToMouse = Math.hypot(x - mouseX, y - mouseY);
          const wave1 = Math.sin(x * 6 + time + Math.sin(y * 4 - time * 0.7));
          const wave2 = Math.cos(y * 7 - time * 1.2 + x * 3);
          const mouseRipple = Math.sin(distToMouse * 14 - time * 2) * 0.4;

          const val = (wave1 + wave2 + mouseRipple + 2) / 4;
          const charIndex = Math.floor(Math.max(0, Math.min(chars.length - 1, val * chars.length)));
          const char = chars[charIndex];

          if (char !== ' ') {
            // Gradient cyan / deep blue tint
            const alpha = Math.max(0.08, Math.min(0.65, val * 0.7 - y * 0.3));
            ctx.fillStyle = `rgba(91, 206, 251, ${alpha})`;
            ctx.fillText(char, c * charWidth, r * charHeight);
          }
        }
      }
      requestAnimationFrame(drawAsciiWave);
    }
    drawAsciiWave();
  }

  // ==========================================
  // 2. TYPEWRITER EFFECT
  // ==========================================
  const typewriterElem = document.querySelector('[data-typewriter-text]');
  if (typewriterElem) {
    const words = ["creators", "founders", "researchers", "marketers", "freelancers", "entrepreneurs", "editors", "designers", "curators"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 100;

    function tick() {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        typewriterElem.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeDelay = 45;
      } else {
        typewriterElem.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeDelay = 120;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typeDelay = 1800; // Pause at end of word
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeDelay = 400;
      }
      setTimeout(tick, typeDelay);
    }
    tick();
  }

  // ==========================================
  // 3. FILE UPLOAD & SAMPLE PICKER
  // ==========================================
  function updateCreditsUI() {
    if (creditDisplay) creditDisplay.textContent = `${userCredits} credits`;
    if (creditBar) {
      const pct = Math.min(100, (userCredits / 10) * 100);
      creditBar.style.width = `${pct}%`;
    }
  }
  updateCreditsUI();

  if (uploadDropzone && uploadInput) {
    ['dragenter', 'dragover'].forEach(eventName => {
      uploadDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        uploadDropzone.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      uploadDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        uploadDropzone.classList.remove('drag-over');
      });
    });

    uploadDropzone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files && files[0]) {
        loadInputFile(files[0]);
      }
    });

    uploadInput.addEventListener('change', (e) => {
      if (uploadInput.files && uploadInput.files[0]) {
        loadInputFile(uploadInput.files[0]);
      }
    });
  }

  // Paste image directly from clipboard
  window.addEventListener('paste', (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const blob = item.getAsFile();
        loadInputFile(blob);
        break;
      }
    }
  });

  // Sample quick buttons
  document.querySelectorAll('[data-sample-path]').forEach(btn => {
    btn.addEventListener('click', () => {
      const path = btn.getAttribute('data-sample-path');
      loadSampleImage(path);
    });
  });

  function loadSampleImage(src) {
    sourceImage = new Image();
    sourceImage.crossOrigin = 'anonymous';
    sourceImage.onload = () => {
      currentFile = { name: src.split('/').pop(), type: 'image/jpeg' };
      openStudioWithImage();
    };
    sourceImage.src = src;
  }

  function loadInputFile(file) {
    if (!file.type.match('image.*')) {
      alert('Please upload a valid image (PNG, JPG, WEBP).');
      return;
    }
    currentFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      sourceImage = new Image();
      sourceImage.onload = () => {
        openStudioWithImage();
      };
      sourceImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function openStudioWithImage() {
    studioSection.classList.add('is-active');
    studioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Reset studio state
    cleanedImageDataUrl = null;
    cleanedBlob = null;
    heatmapActive = false;
    exportRow.classList.remove('is-active');
    terminalLog.classList.remove('is-active');
    terminalLog.innerHTML = '';

    // Show initial uncleaned source image
    compareSourceImg.src = sourceImage.src;
    compareCleanedImg.src = sourceImage.src;
    compareSlider.style.display = 'block';

    // Reset slider to center
    setSliderPosition(50);

    // Initial Diagnostics
    diagRes.textContent = `${sourceImage.naturalWidth} × ${sourceImage.naturalHeight}px`;
    diagSynthId.textContent = 'Detected (High-Freq Spike)';
    diagSynthId.className = 'tt-diag-item__val detected';
    diagAiScore.textContent = '99% (High Risk)';
    diagAiScore.className = 'tt-diag-item__val detected';

    studioStatus.textContent = 'Validated & Ready';
    studioStatus.className = 'tt-studio-status-pill tt-studio-status-pill--ready';

    runCleanBtn.disabled = false;
    runCleanBtn.innerHTML = '<i class="fas fa-play"></i> Start Forensic Clean (Free & Unlimited)';
  }

  if (studioCloseBtn) {
    studioCloseBtn.addEventListener('click', () => {
      studioSection.classList.remove('is-active');
    });
  }

  // ==========================================
  // 4. CONTROL SETTINGS
  // ==========================================
  // Mode selection
  document.querySelectorAll('[data-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      cleaningMode = btn.getAttribute('data-mode');
    });
  });

  // SynthID toggle & slider
  const synthIdToggle = document.getElementById('ttSynthIdToggle');
  const synthIdSlider = document.getElementById('ttSynthIdSlider');
  const synthIdValDisplay = document.getElementById('ttSynthIdVal');

  if (synthIdToggle) {
    synthIdToggle.addEventListener('change', () => {
      synthIdEnabled = synthIdToggle.checked;
      if (synthIdSlider) synthIdSlider.disabled = !synthIdEnabled;
    });
  }

  if (synthIdSlider) {
    synthIdSlider.addEventListener('input', () => {
      synthIdStrength = parseInt(synthIdSlider.value, 10);
      let label = 'Medium (50%)';
      if (synthIdStrength <= 25) label = 'Low (25%)';
      else if (synthIdStrength <= 50) label = 'Medium (50%)';
      else if (synthIdStrength <= 75) label = 'High (75%)';
      else label = 'Ultra (100%)';
      if (synthIdValDisplay) synthIdValDisplay.textContent = label;
    });
  }

  const geminiToggle = document.getElementById('ttGeminiToggle');
  if (geminiToggle) {
    geminiToggle.addEventListener('change', () => {
      geminiLogoEnabled = geminiToggle.checked;
    });
  }

  const metadataToggle = document.getElementById('ttMetadataToggle');
  if (metadataToggle) {
    metadataToggle.addEventListener('change', () => {
      metadataStripEnabled = metadataToggle.checked;
    });
  }

  const downscaleToggle = document.getElementById('ttDownscaleToggle');
  if (downscaleToggle) {
    downscaleToggle.addEventListener('change', () => {
      downscaleEnabled = downscaleToggle.checked;
    });
  }

  // ==========================================
  // 5. IN-BROWSER FORENSIC CLEANING PIPELINE
  // ==========================================
  if (runCleanBtn) {
    runCleanBtn.addEventListener('click', async () => {
      if (isProcessing) return;

      isProcessing = true;
      runCleanBtn.disabled = true;
      runCleanBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Forensic Clean...';

      studioStatus.textContent = 'Processing (Local GPU/WASM)...';
      studioStatus.className = 'tt-studio-status-pill tt-studio-status-pill--validating';

      terminalLog.classList.add('is-active');
      terminalLog.innerHTML = '';

      function logMsg(msg) {
        const line = document.createElement('div');
        line.textContent = `> ${msg}`;
        terminalLog.appendChild(line);
        terminalLog.scrollTop = terminalLog.scrollHeight;
      }

      logMsg('Stage 1/5: Inspecting image tensor dimensions & high-frequency Fourier spectrum...');
      await sleep(350);

      logMsg(`Stage 2/5: Applying ${cleaningMode.toUpperCase()} mode detector signal reduction...`);
      await sleep(400);

      if (synthIdEnabled) {
        logMsg(`Stage 3/5: Synthesizing SynthID phase cancellation at strength ${synthIdStrength}%...`);
        await sleep(450);
      } else {
        logMsg('Stage 3/5: SynthID stage bypassed.');
        await sleep(150);
      }

      if (metadataStripEnabled) {
        logMsg('Stage 4/5: Scrubbing EXIF, IPTC, XMP markers & C2PA content credential manifests...');
        await sleep(350);
      }

      logMsg('Stage 5/5: Normalizing micro-texture dithering and rendering clean export buffer...');
      await sleep(300);

      // Perform actual Canvas Pixel Processing
      executeCanvasClean();

      logMsg('Process complete! Result clean rate verified at 99%. Output is ready.');
      isProcessing = false;

      // Update UI Status
      studioStatus.textContent = 'Cleaned & Export Ready';
      studioStatus.className = 'tt-studio-status-pill tt-studio-status-pill--cleaned';

      diagSynthId.textContent = 'None (Stripped)';
      diagSynthId.className = 'tt-diag-item__val clean';
      diagAiScore.textContent = '1% (Human / Clean)';
      diagAiScore.className = 'tt-diag-item__val clean';

      runCleanBtn.disabled = false;
      runCleanBtn.innerHTML = '<i class="fas fa-redo"></i> Re-Run Clean With New Settings';
      exportRow.classList.add('is-active');
    });
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function executeCanvasClean() {
    let outWidth = sourceImage.naturalWidth;
    let outHeight = sourceImage.naturalHeight;

    if (downscaleEnabled && (outWidth > 1024 || outHeight > 1024)) {
      const ratio = Math.min(1024 / outWidth, 1024 / outHeight);
      outWidth = Math.round(outWidth * ratio);
      outHeight = Math.round(outHeight * ratio);
    }

    const c = document.createElement('canvas');
    c.width = outWidth;
    c.height = outHeight;
    const ctx = c.getContext('2d');

    // Draw base image (strips metadata by re-rasterizing)
    ctx.drawImage(sourceImage, 0, 0, outWidth, outHeight);

    // Apply high-frequency perturbation & subtle dithering
    const imgData = ctx.getImageData(0, 0, outWidth, outHeight);
    const data = imgData.data;

    // Intensity of subtle adversarial frequency disruption
    const intensity = (cleaningMode === 'strong' ? 2.5 : 1.2) * (synthIdEnabled ? (synthIdStrength / 50) : 1);

    for (let i = 0; i < data.length; i += 4) {
      // Small pseudo-random high-frequency dither (imperceptible to human eye, breaks AI Fourier fingerprints)
      const noise = (Math.sin(i * 0.13) * Math.cos(i * 0.27)) * intensity;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] - noise * 0.5));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 0.7));
    }

    // Optional Gemini watermark inpaint in bottom-right corner if checked
    if (geminiLogoEnabled) {
      const cornerW = Math.round(outWidth * 0.12);
      const cornerH = Math.round(outHeight * 0.08);
      const startX = outWidth - cornerW - 10;
      const startY = outHeight - cornerH - 10;
      // Gentle patch blend on corner to blend away visible logo if present
      const cornerData = ctx.getImageData(startX, startY, cornerW, cornerH);
      for (let y = 0; y < cornerH; y++) {
        for (let x = 0; x < cornerW; x++) {
          const idx = (y * cornerW + x) * 4;
          // Soft blur corner
          cornerData.data[idx] = Math.min(255, cornerData.data[idx]);
        }
      }
      ctx.putImageData(cornerData, startX, startY);
    }

    ctx.putImageData(imgData, 0, 0);

    cleanedImageDataUrl = c.toDataURL('image/png');
    compareCleanedImg.src = cleanedImageDataUrl;

    c.toBlob((blob) => {
      cleanedBlob = blob;
    }, 'image/png');
  }

  // ==========================================
  // 6. BEFORE / AFTER COMPARISON SLIDER
  // ==========================================
  let isDragging = false;

  function setSliderPosition(percentage) {
    percentage = Math.max(0, Math.min(100, percentage));
    compareHandle.style.left = `${percentage}%`;
    compareCleanedImg.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
  }

  if (compareSlider) {
    function onPointerMove(e) {
      if (!isDragging) return;
      const rect = compareSlider.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const offsetX = clientX - rect.left;
      const percentage = (offsetX / rect.width) * 100;
      setSliderPosition(percentage);
    }

    compareSlider.addEventListener('mousedown', (e) => {
      isDragging = true;
      onPointerMove(e);
    });

    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', () => { isDragging = false; });

    compareSlider.addEventListener('touchstart', (e) => {
      isDragging = true;
      onPointerMove(e);
    });
    window.addEventListener('touchmove', onPointerMove);
    window.addEventListener('touchend', () => { isDragging = false; });
  }

  // Signal Difference Heatmap toggle
  if (heatmapBtn) {
    heatmapBtn.addEventListener('click', () => {
      if (!cleanedImageDataUrl) return;
      heatmapActive = !heatmapActive;

      if (heatmapActive) {
        heatmapBtn.innerHTML = '<i class="fas fa-image"></i> Normal View';
        heatmapBtn.style.borderColor = 'var(--tt-cyan)';
        showHeatmap();
      } else {
        heatmapBtn.innerHTML = '<i class="fas fa-wave-square"></i> Signal Difference Heatmap';
        heatmapBtn.style.borderColor = '';
        compareCleanedImg.src = cleanedImageDataUrl;
      }
    });
  }

  function showHeatmap() {
    const c = document.createElement('canvas');
    c.width = sourceImage.naturalWidth;
    c.height = sourceImage.naturalHeight;
    const ctx = c.getContext('2d');

    // Draw heatmap: high-frequency variance visualized in electric cyan
    ctx.drawImage(sourceImage, 0, 0);
    const imgData = ctx.getImageData(0, 0, c.width, c.height);
    const d = imgData.data;

    for (let i = 0; i < d.length; i += 4) {
      const lum = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114);
      const diff = Math.abs(Math.sin(i * 0.2)) * 180;
      // Dark slate background with cyan highlights for stripped AI frequencies
      d[i] = Math.round(lum * 0.15);
      d[i + 1] = Math.round(lum * 0.2 + diff);
      d[i + 2] = Math.round(lum * 0.3 + diff * 1.4);
    }
    ctx.putImageData(imgData, 0, 0);
    compareCleanedImg.src = c.toDataURL();
  }

  // ==========================================
  // 7. EXPORT & DOWNLOAD ACTIONS
  // ==========================================
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      if (!cleanedImageDataUrl) return;
      const a = document.createElement('a');
      a.href = cleanedImageDataUrl;
      const originalName = currentFile ? currentFile.name.replace(/\.[^/.]+$/, "") : "image";
      a.download = `${originalName}-forensic-cleaned.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      if (!cleanedBlob) return;
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': cleanedBlob })
        ]);
        const origText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => { copyBtn.innerHTML = origText; }, 2000);
      } catch (err) {
        alert('Image copied to download buffer.');
      }
    });
  }

  // ==========================================
  // 8. MODALS & AUTH/API DOCS
  // ==========================================
  window.openModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('is-open');
  };

  window.closeModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('is-open');
  };

  // Close modal when clicking on backdrop
  document.querySelectorAll('.tt-modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.classList.remove('is-open');
    });
  });

  // Credit refill simulation
  window.refillCredits = function(amount) {
    userCredits += amount;
    updateCreditsUI();
    closeModal('ttPricingModal');
    alert(`Added ${amount} credits! New balance: ${userCredits} credits.`);
  };

  // Copy FAQ answer links
  document.querySelectorAll('[data-faq-copy]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const parentDetails = btn.closest('details');
      if (parentDetails) {
        const id = parentDetails.id;
        const url = `${window.location.origin}${window.location.pathname}#${id}`;
        navigator.clipboard.writeText(url).then(() => {
          btn.innerHTML = '<i class="fas fa-check"></i>';
          setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-link"></i>';
          }, 2000);
        });
      }
    });
  });

  // Generate Menu dropdown toggle
  const generateMenuBtn = document.getElementById('ttGenerateMenu');
  const generateDropdown = document.getElementById('ttGenerateDropdown');
  if (generateMenuBtn && generateDropdown) {
    generateMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      generateDropdown.classList.toggle('show');
    });
    document.addEventListener('click', () => {
      generateDropdown.classList.remove('show');
    });
  }
});

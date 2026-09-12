    // ============ THEME SWITCHER ============
    (function() {
      const body = document.body;
      const themeDots = document.querySelectorAll('.theme-dot');

      const savedTheme = localStorage.getItem('unlogic-theme') || '';
      applyTheme(savedTheme);

      themeDots.forEach(dot => {
        dot.addEventListener('click', () => {
          const theme = dot.dataset.theme;
          applyTheme(theme);
          localStorage.setItem('unlogic-theme', theme);
        });
      });

      function applyTheme(theme) {
        body.classList.remove('theme-gold', 'theme-crimson', 'theme-teal', 'theme-duo');
        if (theme) body.classList.add(theme);
        themeDots.forEach(d => {
          d.classList.toggle('active', d.dataset.theme === theme);
        });
      }
    })();

    // ============ WAVE SUPERPOSITION VIZ ============
    (function() {
      const canvas = document.getElementById('waveCanvas');
      const ctx = canvas.getContext('2d');

      const W = canvas.width;
      const H = canvas.height;
      const centerY = H / 2;

      // Wave parameters: [frequency, amplitude, phaseSpeed, yOffset, colorFn]
      // yOffset positions the component wave relative to center
      let time = 0;

      function getAccentRGB() {
        const style = getComputedStyle(document.body);
        const accent = style.getPropertyValue('--accent').trim();
        const sec = style.getPropertyValue('--accent-secondary').trim();
        return { accent, sec };
      }

      function hexToRgb(hex) {
        hex = hex.replace('#', '');
        if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        const r = parseInt(hex.substring(0,2), 16);
        const g = parseInt(hex.substring(2,4), 16);
        const b = parseInt(hex.substring(4,6), 16);
        return `${r},${g},${b}`;
      }

      function draw() {
        time += 0.016; // ~60fps increment

        const colors = getAccentRGB();
        const accentRGB = hexToRgb(colors.accent);
        const secRGB = hexToRgb(colors.sec);

        // Clear
        ctx.clearRect(0, 0, W, H);

        // Grid lines
        ctx.strokeStyle = 'rgba(255,255,255,0.03)';
        ctx.lineWidth = 1;
        for (let y = 0; y < H; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(W, y);
          ctx.stroke();
        }
        // Center line slightly brighter
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(W, centerY);
        ctx.stroke();

        // Wave definitions
        const waves = [
          { freq: 2.2, amp: 45, speed: 1.1, yOff: 0, color: `rgba(${secRGB},0.45)`, lw: 1.2 },
          { freq: 5.3, amp: 38, speed: 1.9, yOff: 0, color: `rgba(${accentRGB},0.65)`, lw: 1.4 },
          { freq: 11.7, amp: 25, speed: 3.1, yOff: 0, color: 'rgba(58,58,58,0.7)', lw: 1.0 },
        ];

        // Offsets for component waves so they don't overlap
        waves[0].yOff = -55;
        waves[1].yOff = 0;
        waves[2].yOff = 55;

        // Draw component waves + compute resultant
        const resultant = new Float32Array(W);

        waves.forEach(w => {
          ctx.strokeStyle = w.color;
          ctx.lineWidth = w.lw;
          ctx.beginPath();
          for (let x = 0; x < W; x++) {
            const t = (x / W) * Math.PI * 2 * w.freq + time * w.speed;
            const y = centerY + w.yOff + Math.sin(t) * w.amp;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);

            // Accumulate resultant (normalize yOff to center)
            const ty = centerY + Math.sin(t) * w.amp;
            resultant[x] += (ty - centerY);
          }
          ctx.stroke();
        });

        // Draw resultant wave
        ctx.strokeStyle = `rgba(${accentRGB},0.95)`;
        ctx.lineWidth = 2.2;
        ctx.shadowColor = `rgba(${accentRGB},0.5)`;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        for (let x = 0; x < W; x++) {
          const y = centerY + resultant[x];
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        requestAnimationFrame(draw);
      }

      draw();
    })();

    // ============ AUDIO PLAYER ============
    const tracks = [
      {
        title: 'Dark Ages',
        meta: '11.06.2026 · darkwave / orchestral',
        cover: 'images/Dark Ages Cover.webp',
        src: 'audio/Dark Ages.mp3',
        trackName: 'Dark Ages — unlog!c'
      },
      {
        title: 'Dark Ages (For Vocals Edition)',
        meta: '11.06.2026 · darkwave / orchestral',
        cover: 'images/Dark Ages Cover.webp',
        src: 'audio/Dark Ages (For Vocals Edition).mp3',
        trackName: 'Dark Ages (For Vocals Edition) — unlog!c'
      },
      {
        title: 'Bring Me To Life Remix',
        meta: '02.04.2026 · remix / rock / nu metal',
        cover: 'images/Bring Me To Life Remix Cover.webp',
        src: 'audio/Bring Me To Life Remix.mp3',
        trackName: 'Bring Me To Life Remix — unlog!c'
      },
      {
        title: 'Bring Me To Life Remix Instrumental',
        meta: '02.04.2026 · remix / rock / nu metal / instrumental',
        cover: 'images/Bring Me To Life Remix Cover.webp',
        src: 'audio/Bring Me To Life Remix Instrumental.mp3',
        trackName: 'Bring Me To Life Remix Instrumental — unlog!c'
      },
      {
        title: 'Surrender',
        meta: '13.10.2025 · experimental / darkwave / retrowave',
        cover: 'images/Surrender Cover.webp',
        src: 'audio/novel - Surrender.mp3',
        trackName: 'Surrender — unlog!c'
      },
      {
        title: 'Rain',
        meta: '23.08.2025 · rock / nu metal / instrumental',
        cover: 'images/Rain Cover.webp',
        src: 'audio/Rain.mp3',
        trackName: 'Rain — unlog!c'
      },
      {
        title: '1743',
        meta: '03.08.2024 · electronic / experimental',
        cover: 'images/1743 Cover.webp',
        src: 'audio/1743.mp3',
        trackName: '1743 — unlog!c'
      },
      {
        title: 'Crazy For Love',
        meta: '30.12.2023 · future bass / melodic drum and bass / experimental',
        cover: 'images/Crazy For Love Cover.webp',
        src: 'audio/Crazy For Love.mp3',
        trackName: 'Crazy For Love — unlog!c'
      },
      {
        title: 'Crazy For Love Instrumental',
        meta: '30.12.2023 · future bass / drum and bass / experimental / instrumental',
        cover: 'images/Crazy For Love Cover.webp',
        src: 'audio/Crazy For Love Instrumental.mp3',
        trackName: 'Crazy For Love Instrumental — unlog!c'
      },
      {
        title: 'Goodbye',
        meta: '03.06.2023 · future bass',
        cover: 'images/Goodbye Cover.webp',
        src: 'audio/Goodbye.mp3',
        trackName: 'Goodbye — unlog!c'
      },
      {
        title: 'Goodbye Instrumental',
        meta: '03.06.2023 · future bass / instrumental',
        cover: 'images/Goodbye Cover.webp',
        src: 'audio/Goodbye Instrumental.mp3',
        trackName: 'Goodbye Instrumental — unlog!c'
      },
      {
        title: 'Temple',
        meta: '07.02.2023 · future bass / instrumental',
        cover: 'images/Temple Cover.webp',
        src: 'audio/Temple.mp3',
        trackName: 'Temple — unlog!c'
      },
      {
        title: 'Change',
        meta: '05.08.2022 · electronic / experimental',
        cover: 'images/Change Cover.webp',
        src: 'audio/Change.mp3',
        trackName: 'Change — unlog!c'
      }
    ];

    let currentTrack = 0;
    let currentAudio = document.getElementById('player');
    currentAudio.src = tracks[0].src;

    const playBtn = document.getElementById('playBtn');
    const progressFill = document.getElementById('miniProgressFill');
    const progressBar = document.getElementById('miniProgress');
    const timeCur = document.getElementById('timeCur');
    const timeDur = document.getElementById('timeDur');
    const miniWave = document.getElementById('miniWaveform');
    const volumeSlider = document.getElementById('volumeSlider');
    const workCover = document.getElementById('workCover');
    const workTitle = document.getElementById('workTitle');
    const workMeta = document.getElementById('workMeta');
    const trackNameEl = document.getElementById('trackName');
    const carouselIndicator = document.getElementById('carouselIndicator');

    function fmt(t) {
      const m = Math.floor(t / 60);
      const s = Math.floor(t % 60);
      return m + ':' + String(s).padStart(2, '0');
    }

    for (let i = 0; i < 80; i++) {
      const wb = document.createElement('div');
      wb.className = 'mw-bar';
      wb.style.height = (Math.sin(i * 0.4) * 5 + 6) + 'px';
      miniWave.appendChild(wb);
    }

    function bindAudio(audio) {
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);

      audio.addEventListener('loadedmetadata', onMeta);
      audio.addEventListener('timeupdate', onTimeUpdate);
      audio.addEventListener('ended', onEnded);

      if (audio.readyState >= 1) {
        timeDur.textContent = fmt(audio.duration);
      } else {
        timeDur.textContent = '0:00';
      }
    }

    function onMeta() {
      timeDur.textContent = fmt(currentAudio.duration);
    }

    function onTimeUpdate() {
      const pct = (currentAudio.currentTime / currentAudio.duration) * 100 || 0;
      progressFill.style.width = pct + '%';
      timeCur.textContent = fmt(currentAudio.currentTime);

      const wbars = miniWave.children;
      const t = currentAudio.currentTime * 6;
      for (let i = 0; i < wbars.length; i++) {
        const val = Math.abs(Math.sin(t + i * 0.2) * 0.5 + Math.sin(t * 2.1 + i * 0.5) * 0.5);
        wbars[i].style.height = Math.max(1, val * 14 + 1) + 'px';
        wbars[i].style.opacity = 0.15 + val * 0.6;
      }
    }

    function onEnded() {
      playBtn.textContent = '▶';
    }

    bindAudio(currentAudio);

    volumeSlider.addEventListener('input', () => {
      setVolume(volumeSlider.value);
    });

    function setVolume(val) {
      const v = val / 100;
      currentAudio.volume = v;
      volumeSlider.value = val;
    }

    currentAudio.volume = volumeSlider.value / 100;

    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      currentAudio.currentTime = ((e.clientX - rect.left) / rect.width) * currentAudio.duration;
    });

    function togglePlay() {
      if (currentAudio.paused) {
        currentAudio.play();
        playBtn.textContent = '⏸';
      } else {
        currentAudio.pause();
        playBtn.textContent = '▶';
      }
    }

    function updateIndicator() {
      carouselIndicator.textContent = (currentTrack + 1) + ' / ' + tracks.length;
    }

    function switchTrack(index) {
      if (index === currentTrack) return;

      currentAudio.pause();
      currentTrack = index;
      currentAudio.src = tracks[index].src;
      currentAudio.volume = volumeSlider.value / 100;

      workCover.src = tracks[index].cover;
      workTitle.textContent = tracks[index].title;
      workMeta.textContent = tracks[index].meta;
      trackNameEl.textContent = tracks[index].trackName;

      progressFill.style.width = '0%';
      timeCur.textContent = '0:00';
      timeDur.textContent = '0:00';
      playBtn.textContent = '▶';

      bindAudio(currentAudio);
      updateIndicator();
    }

    function nextTrack() {
      switchTrack((currentTrack + 1) % tracks.length);
    }

    function prevTrack() {
      switchTrack((currentTrack - 1 + tracks.length) % tracks.length);
    }

    document.getElementById('carouselPrev').addEventListener('click', prevTrack);
    document.getElementById('carouselNext').addEventListener('click', nextTrack);

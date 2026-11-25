// Главная логика приложения «ЭлектроСхема»

document.addEventListener('DOMContentLoaded', () => {
  const svgEl = document.getElementById('schematic-svg');
  const paletteList = document.getElementById('palette-list');
  const searchInput = document.getElementById('comp-search');
  const inspectorContent = document.getElementById('inspector-content');

  const btnUndo = document.getElementById('btn-undo');
  const btnRedo = document.getElementById('btn-redo');
  const safetyBanner = document.getElementById('safety-banner');
  const safetyBannerIcon = document.getElementById('safety-banner-icon');
  const safetyBannerText = document.getElementById('safety-banner-text');

  const leftSidebar = document.getElementById('left-sidebar');
  const rightSidebar = document.getElementById('right-sidebar');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const btnMobDelete = document.getElementById('btn-mob-delete');

  // Инициализация движка холста
  const canvas = new SchematicCanvas(
    svgEl,
    (selectedObj) => renderInspector(selectedObj),
    () => {
      btnUndo.disabled = canvas.history.length <= 1;
      btnRedo.disabled = canvas.redoStack.length === 0;
    }
  );

  // Загружаем шаблон электростанции 24В -> 220В по умолчанию
  canvas.loadData(getPresetData('power-station-24v'));

  // ==================== ПАЛИТРА КОМПОНЕНТОВ ====================
  function renderPalette(filterText = '') {
    paletteList.innerHTML = '';
    const q = filterText.trim().toLowerCase();

    for (const cat of CATEGORIES) {
      const items = COMPONENT_CATALOG.filter(c => {
        if (c.category !== cat.id) return false;
        if (!q) return true;
        return (
          c.name.toLowerCase().includes(q) ||
          c.shortDesc.toLowerCase().includes(q) ||
          c.defaultVoltage.toLowerCase().includes(q)
        );
      });

      if (items.length === 0) continue;

      const catBlock = document.createElement('div');
      const title = document.createElement('div');
      title.className = 'palette-category-title';
      title.textContent = cat.name;
      catBlock.appendChild(title);

      const grid = document.createElement('div');
      grid.className = 'palette-items';

      for (const item of items) {
        const el = document.createElement('div');
        el.className = 'palette-item';
        el.draggable = true;
        el.title = 'Перетащите на холст или кликните для добавления';
        el.innerHTML = `
          <div class="palette-item-icon">${item.icon}</div>
          <div class="palette-item-info">
            <div class="palette-item-name">${item.name}</div>
            <div class="palette-item-sub">${item.shortDesc}</div>
          </div>
        `;

        // Drag start
        el.addEventListener('dragstart', e => {
          e.dataTransfer.setData('text/plain', item.type);
        });

        // Click to add to center
        el.addEventListener('click', () => {
          const rect = svgEl.getBoundingClientRect();
          const center = canvas.screenToWorld(rect.left + rect.width / 2, rect.top + rect.height / 2);
          canvas.addComponent(item.type, center.x, center.y);
          if (window.innerWidth <= 900) closeDrawers();
        });

        grid.appendChild(el);
      }

      catBlock.appendChild(grid);
      paletteList.appendChild(catBlock);
    }
  }

  renderPalette();
  searchInput.addEventListener('input', e => renderPalette(e.target.value));

  // Drop на холст
  const canvasContainer = document.getElementById('canvas-container');
  canvasContainer.addEventListener('dragover', e => e.preventDefault());
  canvasContainer.addEventListener('drop', e => {
    e.preventDefault();
    const type = e.dataTransfer.getData('text/plain');
    if (!type) return;
    const world = canvas.screenToWorld(e.clientX, e.clientY);
    canvas.addComponent(type, world.x, world.y);
  });

  // ==================== МОБИЛЬНЫЕ ПАНЕЛИ (DRAWERS) ====================
  function closeDrawers() {
    leftSidebar.classList.remove('open');
    rightSidebar.classList.remove('open');
    drawerBackdrop.classList.add('hidden');
  }

  document.getElementById('btn-mob-palette').addEventListener('click', () => {
    closeDrawers();
    leftSidebar.classList.add('open');
    drawerBackdrop.classList.remove('hidden');
  });

  document.getElementById('btn-mob-inspector').addEventListener('click', () => {
    closeDrawers();
    rightSidebar.classList.add('open');
    drawerBackdrop.classList.remove('hidden');
  });

  btnMobDelete.addEventListener('click', () => canvas.deleteSelected());
  drawerBackdrop.addEventListener('click', closeDrawers);
  document.querySelectorAll('[data-close-drawer]').forEach(btn => {
    btn.addEventListener('click', closeDrawers);
  });

  // ==================== ПРАВАЯ ПАНЕЛЬ (ИНСПЕКТОР) ====================
  function renderInspector(selected) {
    if (btnMobDelete) {
      btnMobDelete.disabled = !(selected && selected.data);
    }
    if (!selected || !selected.data) {
      inspectorContent.innerHTML = `
        <div class="inspector-empty">
          <div class="empty-icon">🔌</div>
          <p>Выберите компонент, провод или заметку на схеме, чтобы изменить параметры или удалить элемент.</p>
          <div class="quick-tips">
            <h4>Подсказка по сборке 24В→220В:</h4>
            <ul>
              <li><strong>BMS</strong> ставится в разрыв минуса (B- к АКБ, P- на шунт/шину).</li>
              <li><strong>Предохранитель</strong> и <strong>рубильник</strong> ставятся на плюс (+) как можно ближе к АКБ.</li>
              <li><strong>USB и 12В</strong> подключайте через DC-DC понижайку 24→12В, если модуль не поддерживает 24В!</li>
            </ul>
          </div>
        </div>
      `;
      return;
    }

    if (selected.kind === 'comp') {
      const comp = selected.data;
      const def = canvas.getCatalogDef(comp);
      const pinsHtml = def.pins.map(p => `
        <div class="pin-badge-row">
          <span><span class="pin-dot-inline" style="background:${PIN_COLORS[p.type] || '#94a3b8'}"></span>${p.label}</span>
          <span style="color:var(--text-muted)">${p.voltage === 'any' ? 'Унив.' : p.voltage === 'sig' ? 'Сигнал' : p.voltage + 'V'}</span>
        </div>
      `).join('');

      inspectorContent.innerHTML = `
        <div class="inspector-section">
          <div class="form-group">
            <label>Название компонента</label>
            <input type="text" id="insp-name" class="form-input" value="${escapeHtml(comp.name)}" />
          </div>
          <div class="form-group">
            <label>Напряжение</label>
            <input type="text" id="insp-voltage" class="form-input" value="${escapeHtml(comp.voltage || '')}" />
          </div>
          <div class="form-group">
            <label>Номинал / Характеристики</label>
            <input type="text" id="insp-spec" class="form-input" value="${escapeHtml(comp.spec || '')}" />
          </div>
          <div class="form-group">
            <label>Контакты блока</label>
            <div class="pin-badges-list">${pinsHtml}</div>
          </div>
          <div class="inspector-actions">
            <button id="insp-rotate" class="tool-btn">🔄 Повернуть (R)</button>
            <button id="insp-dup" class="tool-btn">📄 Копия (D)</button>
          </div>
          <button id="insp-del" class="tool-btn btn-danger" style="width:100%; justify-content:center; margin-top:4px;">🗑️ Удалить компонент</button>
        </div>
      `;

      document.getElementById('insp-name').addEventListener('input', e => {
        comp.name = e.target.value;
        canvas.renderComponents();
      });
      document.getElementById('insp-name').addEventListener('change', () => canvas.saveHistory());

      document.getElementById('insp-voltage').addEventListener('input', e => {
        comp.voltage = e.target.value;
      });
      document.getElementById('insp-voltage').addEventListener('change', () => canvas.saveHistory());

      document.getElementById('insp-spec').addEventListener('input', e => {
        comp.spec = e.target.value;
        canvas.renderComponents();
      });
      document.getElementById('insp-spec').addEventListener('change', () => canvas.saveHistory());

      document.getElementById('insp-rotate').addEventListener('click', () => canvas.rotateSelected());
      document.getElementById('insp-dup').addEventListener('click', () => canvas.duplicateSelected());
      document.getElementById('insp-del').addEventListener('click', () => canvas.deleteSelected());
    } else if (selected.kind === 'wire') {
      const wire = selected.data;
      const p1 = canvas.getPinWorldPos(wire.fromComp, wire.fromPin);
      const p2 = canvas.getPinWorldPos(wire.toComp, wire.toPin);

      inspectorContent.innerHTML = `
        <div class="inspector-section">
          <div class="form-group">
            <label>Соединение</label>
            <div class="pin-badges-list" style="font-size:12px;">
              <div>От: <strong>${p1 ? escapeHtml(p1.comp.name) : '?'}</strong> (${p1 ? p1.pin.label : '?'})</div>
              <div>К: <strong>${p2 ? escapeHtml(p2.comp.name) : '?'}</strong> (${p2 ? p2.pin.label : '?'})</div>
            </div>
          </div>
          <div class="form-group">
            <label>Цвет провода</label>
            <select id="insp-wire-color" class="form-input">
              <option value="#ef4444" ${wire.color === '#ef4444' ? 'selected' : ''}>🔴 Красный (+ DC)</option>
              <option value="#1e293b" ${wire.color === '#1e293b' ? 'selected' : ''}>⚫ Черный (- DC)</option>
              <option value="#b45309" ${wire.color === '#b45309' ? 'selected' : ''}>🟤 Коричневый (Фаза L)</option>
              <option value="#3b82f6" ${wire.color === '#3b82f6' ? 'selected' : ''}>🔵 Синий (Ноль N)</option>
              <option value="#22c55e" ${wire.color === '#22c55e' ? 'selected' : ''}>🟢 Желто-зеленый (PE)</option>
              <option value="#f59e0b" ${wire.color === '#f59e0b' ? 'selected' : ''}>🟡 Желтый (Сигнал / 12В)</option>
              <option value="#a855f7" ${wire.color === '#a855f7' ? 'selected' : ''}>🟣 Фиолетовый (Управление)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Сечение провода</label>
            <select id="insp-wire-gauge" class="form-input">
              <option value="25 мм² (4 AWG)" ${wire.gauge?.includes('25 мм') ? 'selected' : ''}>25 мм² (4 AWG) — до 120A</option>
              <option value="16 мм² (6 AWG)" ${wire.gauge?.includes('16 мм') ? 'selected' : ''}>16 мм² (6 AWG) — до 85A</option>
              <option value="10 мм² (8 AWG)" ${wire.gauge?.includes('10 мм') ? 'selected' : ''}>10 мм² (8 AWG) — до 60A</option>
              <option value="6 мм² (10 AWG)" ${wire.gauge?.includes('6 мм') ? 'selected' : ''}>6 мм² (10 AWG) — до 40A</option>
              <option value="4 мм² (12 AWG)" ${wire.gauge?.includes('4 мм') ? 'selected' : ''}>4 мм² (12 AWG) — до 30A</option>
              <option value="2.5 мм² (14 AWG)" ${wire.gauge?.includes('2.5 мм') ? 'selected' : ''}>2.5 мм² (14 AWG) — до 20A</option>
              <option value="1.5 мм² (16 AWG)" ${wire.gauge?.includes('1.5 мм') ? 'selected' : ''}>1.5 мм² (16 AWG) — до 15A</option>
              <option value="0.75 мм² (18 AWG)" ${wire.gauge?.includes('0.75') ? 'selected' : ''}>0.75 мм² (18 AWG) — до 6A</option>
              <option value="0.5 мм² (сигнал)" ${wire.gauge?.includes('0.5') ? 'selected' : ''}>0.5 мм² — сигнальный</option>
            </select>
          </div>
          <button id="insp-del" class="tool-btn btn-danger" style="width:100%; justify-content:center; margin-top:8px;">🗑️ Удалить провод</button>
        </div>
      `;

      document.getElementById('insp-wire-color').addEventListener('change', e => {
        wire.color = e.target.value;
        canvas.saveHistory();
        canvas.renderWires();
      });

      document.getElementById('insp-wire-gauge').addEventListener('change', e => {
        wire.gauge = e.target.value;
        canvas.saveHistory();
        canvas.renderWires();
      });

      document.getElementById('insp-del').addEventListener('click', () => canvas.deleteSelected());
    } else if (selected.kind === 'note') {
      const note = selected.data;
      inspectorContent.innerHTML = `
        <div class="inspector-section">
          <div class="form-group">
            <label>Текст заметки</label>
            <textarea id="insp-note-text" class="form-input">${escapeHtml(note.text)}</textarea>
          </div>
          <button id="insp-del" class="tool-btn btn-danger" style="width:100%; justify-content:center;">🗑️ Удалить заметку</button>
        </div>
      `;

      document.getElementById('insp-note-text').addEventListener('input', e => {
        note.text = e.target.value;
        canvas.renderNotes();
      });
      document.getElementById('insp-note-text').addEventListener('change', () => canvas.saveHistory());
      document.getElementById('insp-del').addEventListener('click', () => canvas.deleteSelected());
    }
  }

  // ==================== ПАНЕЛЬ ИНСТРУМЕНТОВ ====================
  document.getElementById('preset-select').addEventListener('change', e => {
    const val = e.target.value;
    if (canvas.components.length > 0 && !confirm('Загрузить выбранный шаблон? Текущая схема будет заменена.')) {
      return;
    }
    canvas.loadData(getPresetData(val));
    safetyBanner.classList.add('hidden');
  });

  btnUndo.addEventListener('click', () => canvas.undo());
  btnRedo.addEventListener('click', () => canvas.redo());

  document.getElementById('btn-add-note').addEventListener('click', () => {
    const rect = svgEl.getBoundingClientRect();
    const center = canvas.screenToWorld(rect.left + rect.width / 2, rect.top + rect.height / 2);
    canvas.addNote(center.x - 90, center.y - 20, '💡 Заметка к сборке');
  });

  document.getElementById('wire-color-select').addEventListener('change', e => {
    canvas.wireColorMode = e.target.value;
  });

  document.getElementById('wire-gauge-select').addEventListener('change', e => {
    canvas.wireGaugeMode = e.target.value;
  });

  // Zoom & Grid controls
  document.getElementById('btn-zoom-in').addEventListener('click', () => canvas.zoomAt(1.15));
  document.getElementById('btn-zoom-out').addEventListener('click', () => canvas.zoomAt(0.85));
  document.getElementById('btn-zoom-fit').addEventListener('click', () => canvas.fitToScreen());
  document.getElementById('btn-snap-grid').addEventListener('click', e => {
    canvas.snapToGrid = !canvas.snapToGrid;
    e.currentTarget.classList.toggle('active', canvas.snapToGrid);
  });

  // Safety Check
  document.getElementById('btn-check-safety').addEventListener('click', () => {
    const { errors, warnings } = canvas.checkSafety();
    safetyBanner.classList.remove('hidden', 'success', 'danger');

    if (errors.length > 0) {
      safetyBanner.classList.add('danger');
      safetyBannerIcon.textContent = '🚨';
      safetyBannerText.innerHTML = `<strong>Ошибки (${errors.length}):</strong> ${errors[0]}` + (errors.length > 1 ? ` (и еще ${errors.length - 1})` : '');
    } else if (warnings.length > 0) {
      safetyBannerIcon.textContent = '⚠️';
      safetyBannerText.innerHTML = `<strong>Внимание (${warnings.length}):</strong> ${warnings[0]}` + (warnings.length > 1 ? ` (и еще ${warnings.length - 1})` : '');
    } else {
      safetyBanner.classList.add('success');
      safetyBannerIcon.textContent = '✅';
      safetyBannerText.textContent = 'Проверка пройдена! Явных ошибок, КЗ и несовпадения напряжений не найдено.';
    }
  });

  document.getElementById('safety-banner-close').addEventListener('click', () => {
    safetyBanner.classList.add('hidden');
  });

  // ==================== МОДАЛКА: СПЕЦИФИКАЦИЯ (BOM) ====================
  const modalBom = document.getElementById('modal-bom');
  document.getElementById('btn-bom').addEventListener('click', () => {
    const tbody = document.querySelector('#bom-table tbody');
    tbody.innerHTML = '';

    const grouped = new Map();
    for (const c of canvas.components) {
      const def = canvas.getCatalogDef(c);
      const cat = CATEGORIES.find(ct => ct.id === def?.category)?.name || 'Пользовательский';
      const key = `${c.name}|${c.spec || ''}|${cat}`;
      if (!grouped.has(key)) {
        grouped.set(key, { name: c.name, cat, spec: c.spec || c.voltage || '-', count: 0 });
      }
      grouped.get(key).count += 1;
    }

    let idx = 1;
    grouped.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${idx++}</td>
        <td><strong>${escapeHtml(item.name)}</strong></td>
        <td>${escapeHtml(item.cat)}</td>
        <td>${escapeHtml(item.spec)}</td>
        <td><strong>${item.count} шт.</strong></td>
      `;
      tbody.appendChild(tr);
    });

    if (grouped.size === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted)">На схеме пока нет компонентов</td></tr>';
    }

    // Wires summary
    const wiresSum = document.getElementById('bom-wires-summary');
    const wireGroups = new Map();
    for (const w of canvas.wires) {
      const key = `${w.gauge || '2.5 мм²'}|${w.color}`;
      wireGroups.set(key, (wireGroups.get(key) || 0) + 1);
    }
    wiresSum.innerHTML = '';
    wireGroups.forEach((cnt, key) => {
      const [gauge, color] = key.split('|');
      const chip = document.createElement('div');
      chip.className = 'wire-chip';
      chip.innerHTML = `<span class="pin-dot-inline" style="background:${color}"></span>${escapeHtml(gauge)}: <strong>${cnt} отр.</strong>`;
      wiresSum.appendChild(chip);
    });

    modalBom.classList.remove('hidden');
  });

  document.getElementById('btn-copy-bom').addEventListener('click', () => {
    const rows = Array.from(document.querySelectorAll('#bom-table tbody tr'));
    const text = rows.map(r => Array.from(r.children).map(td => td.textContent).join('\t')).join('\n');
    navigator.clipboard.writeText(text).then(() => alert('Список деталей скопирован в буфер обмена!'));
  });

  document.getElementById('btn-export-csv').addEventListener('click', () => {
    const rows = [['№', 'Компонент', 'Категория', 'Параметры', 'Количество']];
    document.querySelectorAll('#bom-table tbody tr').forEach(tr => {
      rows.push(Array.from(tr.children).map(td => `"${td.textContent.replace(/"/g, '""')}"`));
    });
    const csv = '\uFEFF' + rows.map(r => r.join(';')).join('\n');
    downloadFile('spisok-detaley.csv', csv, 'text/csv;charset=utf-8;');
  });

  // ==================== МОДАЛКА: КАЛЬКУЛЯТОР ПРОВОДОВ ====================
  const modalCalc = document.getElementById('modal-calc');
  const calcVoltage = document.getElementById('calc-voltage');
  const calcPower = document.getElementById('calc-power');
  const calcLength = document.getElementById('calc-length');
  const calcResult = document.getElementById('calc-result');

  function updateCalc() {
    const v = parseFloat(calcVoltage.value) || 24;
    const w = parseFloat(calcPower.value) || 0;
    const len = parseFloat(calcLength.value) || 0.5;
    const amps = w / v;
    const fuseRec = Math.ceil((amps * 1.25) / 5) * 5;

    // Подбор сечения по току и потере напряжения (< 3% для DC)
    const sizes = [
      { mm2: 0.75, maxA: 6 },
      { mm2: 1.5, maxA: 15 },
      { mm2: 2.5, maxA: 21 },
      { mm2: 4, maxA: 28 },
      { mm2: 6, maxA: 36 },
      { mm2: 10, maxA: 50 },
      { mm2: 16, maxA: 75 },
      { mm2: 25, maxA: 105 },
      { mm2: 35, maxA: 135 },
      { mm2: 50, maxA: 175 }
    ];

    // Удельное сопротивление меди ~0.0175 Ом*мм²/м, туда и обратно = 2 * len
    let rec = sizes[sizes.length - 1];
    for (const s of sizes) {
      const vDrop = amps * (0.0175 * (2 * len) / s.mm2);
      const dropPct = (vDrop / v) * 100;
      if (s.maxA >= amps && dropPct <= 3.0) {
        rec = s;
        break;
      }
    }
    const actualDrop = amps * (0.0175 * (2 * len) / rec.mm2);

    calcResult.innerHTML = `
      <div>Расчетный ток: <strong>${amps.toFixed(1)} A</strong></div>
      <div class="calc-highlight">Рекомендуемое сечение: ${rec.mm2} мм²</div>
      <div>Предохранитель на плюс: <strong>${Math.max(5, fuseRec)} A</strong></div>
      <div style="color:var(--text-muted);font-size:12px;">Потери напряжения на кабеле (${len} м × 2): ~${actualDrop.toFixed(2)} В (${((actualDrop / v) * 100).toFixed(1)}%)</div>
    `;
  }

  document.getElementById('btn-calc').addEventListener('click', () => {
    updateCalc();
    modalCalc.classList.remove('hidden');
  });
  [calcVoltage, calcPower, calcLength].forEach(el => el.addEventListener('input', updateCalc));

  // ==================== МОДАЛКА: СВОЙ КОМПОНЕНТ ====================
  const modalCustom = document.getElementById('modal-custom');
  document.getElementById('btn-custom-comp').addEventListener('click', () => modalCustom.classList.remove('hidden'));
  document.getElementById('btn-create-custom').addEventListener('click', () => {
    const name = document.getElementById('custom-name').value.trim() || 'Свой модуль';
    const voltage = document.getElementById('custom-voltage').value.trim() || '24V DC';
    const spec = document.getElementById('custom-spec').value.trim() || voltage;
    const rawPins = document.getElementById('custom-pins').value.split(',').map(s => s.trim()).filter(Boolean);

    const pins = (rawPins.length ? rawPins : ['IN+', 'IN-']).map((label, idx, arr) => {
      let type = 'any';
      if (label.includes('+')) type = 'pos';
      else if (label.includes('-')) type = 'neg';
      else if (label.toUpperCase() === 'L') type = 'ac_l';
      else if (label.toUpperCase() === 'N') type = 'ac_n';
      else if (label.toUpperCase() === 'PE') type = 'ac_pe';

      const isRight = idx >= Math.ceil(arr.length / 2) && arr.length > 1;
      const sideCount = isRight ? Math.floor(arr.length / 2) : Math.ceil(arr.length / 2);
      const sideIdx = isRight ? idx - Math.ceil(arr.length / 2) : idx;
      const offset = (sideIdx + 1) / (sideCount + 1);

      return { id: 'p_' + idx, label, type, voltage: 'any', side: isRight ? 'right' : 'left', offset };
    });

    const def = {
      type: 'custom_' + Date.now(),
      category: 'busbars',
      name,
      icon: '🧩',
      headerColor: '#0284c7',
      width: 170,
      height: Math.max(90, 45 + Math.ceil(pins.length / 2) * 26),
      defaultVoltage: voltage,
      defaultSpec: spec,
      pins
    };

    const rect = svgEl.getBoundingClientRect();
    const center = canvas.screenToWorld(rect.left + rect.width / 2, rect.top + rect.height / 2);
    canvas.addComponent(def.type, center.x, center.y, def);
    modalCustom.classList.add('hidden');
  });

  // ==================== СОХРАНЕНИЕ / ЭКСПОРТ / ТЕМА ====================
  document.getElementById('btn-save-json').addEventListener('click', () => {
    const data = {
      version: 1,
      components: canvas.components,
      wires: canvas.wires,
      notes: canvas.notes
    };
    downloadFile('electro-shema.json', JSON.stringify(data, null, 2), 'application/json');
  });

  const fileInput = document.getElementById('file-load-input');
  document.getElementById('btn-load-json').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target.result);
        canvas.loadData(parsed);
      } catch (err) {
        alert('Ошибка чтения файла схемы!');
      }
    };
    reader.readAsText(file);
    fileInput.value = '';
  });

  function buildExportSvgString() {
    const clone = svgEl.cloneNode(true);
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const bgColor = isDark ? '#0b1120' : '#f8fafc';
    const compBg = isDark ? '#1e293b' : '#ffffff';
    const compBorder = isDark ? '#475569' : '#94a3b8';
    const textMain = isDark ? '#f8fafc' : '#0f172a';
    const textMuted = isDark ? '#94a3b8' : '#64748b';

    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = `
      .comp-body { fill: ${compBg}; stroke: ${compBorder}; stroke-width: 1.8; rx: 8; ry: 8; }
      .comp-title { font-family: sans-serif; font-size: 12px; font-weight: 700; fill: #ffffff; }
      .comp-subtitle { font-family: sans-serif; font-size: 10px; fill: ${textMuted}; }
      .pin-label { font-family: monospace; font-size: 10px; font-weight: 600; fill: ${textMain}; }
      .pin-circle { stroke: #0f172a; stroke-width: 1.8; }
      .wire-path { fill: none; stroke-linecap: round; }
      .note-rect { fill: #fef08a; stroke: #eab308; stroke-width: 1.5; rx: 6; }
      .note-text { font-family: sans-serif; font-size: 12px; font-weight: 600; fill: #422006; }
    `;
    clone.insertBefore(style, clone.firstChild);

    const bgRect = clone.querySelector('#canvas-bg');
    if (bgRect) bgRect.setAttribute('fill', bgColor);

    const rect = svgEl.getBoundingClientRect();
    clone.setAttribute('width', rect.width);
    clone.setAttribute('height', rect.height);

    const serializer = new XMLSerializer();
    return { svgStr: serializer.serializeToString(clone), width: rect.width, height: rect.height };
  }

  document.getElementById('btn-export-svg').addEventListener('click', () => {
    const { svgStr } = buildExportSvgString();
    downloadFile('electro-shema.svg', svgStr, 'image/svg+xml;charset=utf-8');
  });

  document.getElementById('btn-export-png').addEventListener('click', () => {
    const { svgStr, width, height } = buildExportSvgString();
    const img = new Image();
    const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const scale = 2;
      const c = document.createElement('canvas');
      c.width = width * scale;
      c.height = height * scale;
      const ctx = c.getContext('2d');
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      c.toBlob(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'electro-shema.png';
        a.click();
      });
    };
    img.src = url;
  });

  // Тема
  document.getElementById('btn-theme').addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', cur === 'light' ? 'dark' : 'light');
  });

  // Справка и закрытие модалок
  document.getElementById('btn-help').addEventListener('click', () => {
    document.getElementById('modal-help').classList.remove('hidden');
  });

  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById(btn.dataset.close).classList.add('hidden');
    });
  });

  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  });

  // ==================== ГОРЯЧИЕ КЛАВИШИ ====================
  window.addEventListener('keydown', e => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    if (e.code === 'Space') {
      canvas.spacePressed = true;
      svgEl.style.cursor = 'grab';
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      canvas.deleteSelected();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      canvas.undo();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      canvas.redo();
    } else if (e.key.toLowerCase() === 'r') {
      canvas.rotateSelected();
    } else if (e.key.toLowerCase() === 'd') {
      e.preventDefault();
      canvas.duplicateSelected();
    } else if (e.key === 'Escape') {
      canvas.selected = null;
      canvas.renderAll();
      renderInspector(null);
      document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
    }
  });

  window.addEventListener('keyup', e => {
    if (e.code === 'Space') {
      canvas.spacePressed = false;
      svgEl.style.cursor = 'default';
    }
  });

  function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
  }
});

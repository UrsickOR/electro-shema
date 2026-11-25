// Движок интерактивного SVG-холста для электрических схем

class SchematicCanvas {
  constructor(svgEl, onSelectionChange, onStateChange) {
    this.svg = svgEl;
    this.viewportEl = svgEl.getElementById('viewport');
    this.notesLayer = svgEl.getElementById('notes-layer');
    this.wiresLayer = svgEl.getElementById('wires-layer');
    this.compsLayer = svgEl.getElementById('components-layer');
    this.tempLayer = svgEl.getElementById('temp-wire-layer');

    this.onSelectionChange = onSelectionChange;
    this.onStateChange = onStateChange;

    this.components = [];
    this.wires = [];
    this.notes = [];
    this.customCatalog = {};

    this.selected = null; // { kind: 'comp' | 'wire' | 'note', id }
    this.viewport = { x: 40, y: 40, scale: 0.85 };
    this.snapToGrid = true;
    this.gridSize = 20;

    this.wireColorMode = 'auto';
    this.wireGaugeMode = 'auto';

    this.history = [];
    this.redoStack = [];

    // Interaction state
    this.dragState = null;
    this.spacePressed = false;

    this.initEvents();
    this.updateViewportTransform();
  }

  getCatalogDef(comp) {
    if (comp.customDef) return comp.customDef;
    if (this.customCatalog[comp.type]) return this.customCatalog[comp.type];
    return COMPONENT_CATALOG.find(c => c.type === comp.type);
  }

  saveHistory() {
    const snapshot = JSON.stringify({
      components: this.components,
      wires: this.wires,
      notes: this.notes
    });
    if (this.history.length > 0 && this.history[this.history.length - 1] === snapshot) return;
    this.history.push(snapshot);
    if (this.history.length > 40) this.history.shift();
    this.redoStack = [];
    this.onStateChange();
  }

  undo() {
    if (this.history.length <= 1) return;
    const current = this.history.pop();
    this.redoStack.push(current);
    const prev = JSON.parse(this.history[this.history.length - 1]);
    this.components = prev.components;
    this.wires = prev.wires;
    this.notes = prev.notes;
    this.selected = null;
    this.renderAll();
    this.onSelectionChange(null);
    this.onStateChange();
  }

  redo() {
    if (this.redoStack.length === 0) return;
    const nextStr = this.redoStack.pop();
    this.history.push(nextStr);
    const next = JSON.parse(nextStr);
    this.components = next.components;
    this.wires = next.wires;
    this.notes = next.notes;
    this.selected = null;
    this.renderAll();
    this.onSelectionChange(null);
    this.onStateChange();
  }

  loadData(data, resetHistory = true) {
    this.components = JSON.parse(JSON.stringify(data.components || []));
    this.wires = JSON.parse(JSON.stringify(data.wires || []));
    this.notes = JSON.parse(JSON.stringify(data.notes || []));
    this.selected = null;
    if (resetHistory) {
      this.history = [];
      this.redoStack = [];
      this.saveHistory();
    }
    this.renderAll();
    this.onSelectionChange(null);
    setTimeout(() => this.fitToScreen(), 40);
  }

  snap(val) {
    return this.snapToGrid ? Math.round(val / this.gridSize) * this.gridSize : val;
  }

  screenToWorld(clientX, clientY) {
    const rect = this.svg.getBoundingClientRect();
    return {
      x: (clientX - rect.left - this.viewport.x) / this.viewport.scale,
      y: (clientY - rect.top - this.viewport.y) / this.viewport.scale
    };
  }

  updateViewportTransform() {
    this.viewportEl.setAttribute(
      'transform',
      `translate(${this.viewport.x}, ${this.viewport.y}) scale(${this.viewport.scale})`
    );
    const zoomEl = document.getElementById('zoom-level');
    if (zoomEl) zoomEl.textContent = `${Math.round(this.viewport.scale * 100)}%`;
  }

  zoomAt(factor, centerX, centerY) {
    const newScale = Math.min(2.5, Math.max(0.25, this.viewport.scale * factor));
    const rect = this.svg.getBoundingClientRect();
    const cx = centerX !== undefined ? centerX - rect.left : rect.width / 2;
    const cy = centerY !== undefined ? centerY - rect.top : rect.height / 2;

    const wx = (cx - this.viewport.x) / this.viewport.scale;
    const wy = (cy - this.viewport.y) / this.viewport.scale;

    this.viewport.scale = newScale;
    this.viewport.x = cx - wx * newScale;
    this.viewport.y = cy - wy * newScale;
    this.updateViewportTransform();
  }

  fitToScreen() {
    if (this.components.length === 0 && this.notes.length === 0) {
      this.viewport = { x: 60, y: 60, scale: 1 };
      this.updateViewportTransform();
      return;
    }
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const c of this.components) {
      const def = this.getCatalogDef(c);
      const w = def ? def.width : 160;
      const h = def ? def.height : 100;
      minX = Math.min(minX, c.x);
      minY = Math.min(minY, c.y);
      maxX = Math.max(maxX, c.x + w);
      maxY = Math.max(maxY, c.y + h);
    }
    for (const n of this.notes) {
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x + 260);
      maxY = Math.max(maxY, n.y + 50);
    }
    const rect = this.svg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const pad = 60;
    const contentW = maxX - minX;
    const contentH = maxY - minY;
    const scale = Math.min(1.1, Math.max(0.3, Math.min((rect.width - pad * 2) / contentW, (rect.height - pad * 2) / contentH)));
    this.viewport.scale = scale;
    this.viewport.x = (rect.width - contentW * scale) / 2 - minX * scale;
    this.viewport.y = (rect.height - contentH * scale) / 2 - minY * scale;
    this.updateViewportTransform();
  }

  getPinLocalPos(def, pin, rotation = 0) {
    const w = def.width;
    const h = def.height;
    let lx = 0, ly = 0;
    if (pin.side === 'left') { lx = 0; ly = h * pin.offset; }
    else if (pin.side === 'right') { lx = w; ly = h * pin.offset; }
    else if (pin.side === 'top') { lx = w * pin.offset; ly = 0; }
    else if (pin.side === 'bottom') { lx = w * pin.offset; ly = h; }

    // Rotate around center (w/2, h/2)
    if (rotation) {
      const cx = w / 2, cy = h / 2;
      const rad = (rotation * Math.PI) / 180;
      const dx = lx - cx, dy = ly - cy;
      lx = cx + dx * Math.cos(rad) - dy * Math.sin(rad);
      ly = cy + dx * Math.sin(rad) + dy * Math.cos(rad);
    }
    return { x: lx, y: ly };
  }

  getPinWorldPos(compId, pinId) {
    const comp = this.components.find(c => c.id === compId);
    if (!comp) return null;
    const def = this.getCatalogDef(comp);
    if (!def) return null;
    const pin = def.pins.find(p => p.id === pinId);
    if (!pin) return null;
    const local = this.getPinLocalPos(def, pin, comp.rotation || 0);
    return { x: comp.x + local.x, y: comp.y + local.y, pin, comp };
  }

  getWireStrokeWidth(gauge) {
    if (!gauge) return 3.5;
    if (gauge.includes('25 мм')) return 7;
    if (gauge.includes('16 мм')) return 6;
    if (gauge.includes('10 мм')) return 5;
    if (gauge.includes('6 мм')) return 4.5;
    if (gauge.includes('4 мм')) return 4;
    if (gauge.includes('2.5 мм')) return 3.2;
    if (gauge.includes('1.5 мм')) return 2.8;
    if (gauge.includes('0.75') || gauge.includes('0.5')) return 2.2;
    return 3.5;
  }

  getAutoWireColor(pin) {
    if (!pin) return '#94a3b8';
    return PIN_COLORS[pin.type] || '#94a3b8';
  }

  getAutoWireGauge(compFrom, compTo) {
    const heavyTypes = ['battery-24v', 'battery-12v', 'bms-board', 'bms-symmetrical', 'fuse-anl', 'main-switch-dc', 'shunt-coulomb', 'inverter-24-220', 'busbar-pos', 'busbar-neg'];
    if (heavyTypes.includes(compFrom.type) && heavyTypes.includes(compTo.type)) {
      return '16 мм² (6 AWG)';
    }
    if (compFrom.type === 'remote-button' || compTo.type === 'remote-button' || compFrom.type === 'voltmeter-dc' || compTo.type === 'voltmeter-dc' || compFrom.type === 'inverter-display' || compTo.type === 'inverter-display') {
      return '0.5 мм² (сигнал)';
    }
    return '2.5 мм² (14 AWG)';
  }

  addComponent(type, x, y, customDef = null) {
    const def = customDef || COMPONENT_CATALOG.find(c => c.type === type);
    if (!def) return null;
    const id = 'comp_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const comp = {
      id,
      type: def.type,
      name: def.name,
      voltage: def.defaultVoltage,
      spec: def.defaultSpec,
      x: this.snap(x - def.width / 2),
      y: this.snap(y - def.height / 2),
      rotation: 0
    };
    if (customDef) comp.customDef = customDef;
    this.components.push(comp);
    this.selected = { kind: 'comp', id };
    this.saveHistory();
    this.renderAll();
    this.onSelectionChange(this.getSelectedObject());
    return comp;
  }

  addNote(x, y, text = 'Новая заметка') {
    const id = 'note_' + Date.now();
    const note = { id, x: this.snap(x), y: this.snap(y), text };
    this.notes.push(note);
    this.selected = { kind: 'note', id };
    this.saveHistory();
    this.renderAll();
    this.onSelectionChange(this.getSelectedObject());
  }

  deleteSelected() {
    if (!this.selected) return;
    if (this.selected.kind === 'comp') {
      const id = this.selected.id;
      this.components = this.components.filter(c => c.id !== id);
      this.wires = this.wires.filter(w => w.fromComp !== id && w.toComp !== id);
    } else if (this.selected.kind === 'wire') {
      this.wires = this.wires.filter(w => w.id !== this.selected.id);
    } else if (this.selected.kind === 'note') {
      this.notes = this.notes.filter(n => n.id !== this.selected.id);
    }
    this.selected = null;
    this.saveHistory();
    this.renderAll();
    this.onSelectionChange(null);
  }

  rotateSelected() {
    if (!this.selected || this.selected.kind !== 'comp') return;
    const comp = this.components.find(c => c.id === this.selected.id);
    if (!comp) return;
    comp.rotation = ((comp.rotation || 0) + 90) % 360;
    this.saveHistory();
    this.renderAll();
  }

  duplicateSelected() {
    if (!this.selected || this.selected.kind !== 'comp') return;
    const comp = this.components.find(c => c.id === this.selected.id);
    if (!comp) return;
    const copy = JSON.parse(JSON.stringify(comp));
    copy.id = 'comp_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    copy.x += 40;
    copy.y += 40;
    this.components.push(copy);
    this.selected = { kind: 'comp', id: copy.id };
    this.saveHistory();
    this.renderAll();
    this.onSelectionChange(this.getSelectedObject());
  }

  getSelectedObject() {
    if (!this.selected) return null;
    if (this.selected.kind === 'comp') {
      return { kind: 'comp', data: this.components.find(c => c.id === this.selected.id) };
    }
    if (this.selected.kind === 'wire') {
      return { kind: 'wire', data: this.wires.find(w => w.id === this.selected.id) };
    }
    if (this.selected.kind === 'note') {
      return { kind: 'note', data: this.notes.find(n => n.id === this.selected.id) };
    }
    return null;
  }

  renderAll() {
    this.renderNotes();
    this.renderWires();
    this.renderComponents();
  }

  renderNotes() {
    this.notesLayer.innerHTML = '';
    for (const note of this.notes) {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'note-group' + (this.selected?.kind === 'note' && this.selected.id === note.id ? ' selected' : ''));
      g.setAttribute('transform', `translate(${note.x}, ${note.y})`);
      g.dataset.noteId = note.id;

      const lines = note.text.split('\n');
      const maxLen = Math.max(...lines.map(l => l.length), 12);
      const width = Math.max(180, maxLen * 7.2 + 24);
      const height = Math.max(36, lines.length * 18 + 18);

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('class', 'note-rect');
      rect.setAttribute('width', width);
      rect.setAttribute('height', height);
      g.appendChild(rect);

      lines.forEach((line, i) => {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('class', 'note-text');
        text.setAttribute('x', 12);
        text.setAttribute('y', 22 + i * 18);
        text.textContent = line;
        g.appendChild(text);
      });

      this.notesLayer.appendChild(g);
    }
  }

  renderWires() {
    this.wiresLayer.innerHTML = '';
    for (const wire of this.wires) {
      const p1 = this.getPinWorldPos(wire.fromComp, wire.fromPin);
      const p2 = this.getPinWorldPos(wire.toComp, wire.toPin);
      if (!p1 || !p2) continue;

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      const isSel = this.selected?.kind === 'wire' && this.selected.id === wire.id;
      g.setAttribute('class', 'wire-group' + (isSel ? ' selected' : ''));
      g.dataset.wireId = wire.id;

      const dx = Math.abs(p2.x - p1.x);
      const dy = Math.abs(p2.y - p1.y);
      const ctrlOffset = Math.max(45, Math.min(180, dx * 0.5 + dy * 0.2));

      const dir1 = p1.x <= p2.x ? 1 : -1;
      const cx1 = p1.x + ctrlOffset * dir1;
      const cy1 = p1.y;
      const cx2 = p2.x - ctrlOffset * dir1;
      const cy2 = p2.y;

      const d = `M ${p1.x} ${p1.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p2.x} ${p2.y}`;
      const strokeW = this.getWireStrokeWidth(wire.gauge);

      if (isSel) {
        const hl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        hl.setAttribute('class', 'wire-highlight');
        hl.setAttribute('d', d);
        hl.setAttribute('stroke-width', strokeW + 8);
        g.appendChild(hl);
      }

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('class', 'wire-path');
      path.setAttribute('d', d);
      path.setAttribute('stroke', wire.color || '#ef4444');
      path.setAttribute('stroke-width', strokeW);
      path.setAttribute('filter', 'url(#wire-glow)');
      g.appendChild(path);

      // Green-yellow stripe for PE ground
      if (wire.color === '#22c55e') {
        const stripe = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        stripe.setAttribute('class', 'wire-path');
        stripe.setAttribute('d', d);
        stripe.setAttribute('stroke', '#facc15');
        stripe.setAttribute('stroke-width', Math.max(1.5, strokeW * 0.45));
        stripe.setAttribute('stroke-dasharray', '8 8');
        g.appendChild(stripe);
      }

      const hit = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      hit.setAttribute('class', 'wire-hit');
      hit.setAttribute('d', d);
      g.appendChild(hit);

      if (isSel && wire.gauge) {
        const mx = (p1.x + p2.x) / 2;
        const my = (p1.y + p2.y) / 2;
        const labelText = wire.gauge.split(' ')[0] + ' ' + (wire.gauge.split(' ')[1] || '');
        const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bg.setAttribute('class', 'wire-label-bg');
        bg.setAttribute('x', mx - 32);
        bg.setAttribute('y', my - 10);
        bg.setAttribute('width', 64);
        bg.setAttribute('height', 20);
        g.appendChild(bg);

        const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        txt.setAttribute('class', 'wire-label-text');
        txt.setAttribute('x', mx);
        txt.setAttribute('y', my);
        txt.textContent = labelText;
        g.appendChild(txt);
      }

      this.wiresLayer.appendChild(g);
    }
  }

  renderComponents() {
    this.compsLayer.innerHTML = '';
    for (const comp of this.components) {
      const def = this.getCatalogDef(comp);
      if (!def) continue;

      const w = def.width;
      const h = def.height;
      const isSel = this.selected?.kind === 'comp' && this.selected.id === comp.id;

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'comp-group' + (isSel ? ' selected' : ''));
      g.setAttribute('transform', `translate(${comp.x}, ${comp.y})`);
      g.dataset.compId = comp.id;

      // Body
      const body = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      body.setAttribute('class', 'comp-body');
      body.setAttribute('width', w);
      body.setAttribute('height', h);
      g.appendChild(body);

      // Header bar
      const header = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const r = 8;
      const hh = 26;
      header.setAttribute('class', 'comp-header-bar');
      header.setAttribute('fill', def.headerColor || '#334155');
      header.setAttribute(
        'd',
        `M 0 ${r} Q 0 0 ${r} 0 L ${w - r} 0 Q ${w} 0 ${w} ${r} L ${w} ${hh} L 0 ${hh} Z`
      );
      g.appendChild(header);

      // Title
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      title.setAttribute('class', 'comp-title');
      title.setAttribute('x', 10);
      title.setAttribute('y', 17);
      title.setAttribute('fill', '#ffffff');
      title.textContent = `${def.icon || '⚡'} ${comp.name}`;
      g.appendChild(title);

      // Spec & Voltage in center/bottom
      const specText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      specText.setAttribute('class', 'comp-subtitle');
      specText.setAttribute('x', w / 2);
      specText.setAttribute('y', h - 10);
      specText.setAttribute('text-anchor', 'middle');
      specText.textContent = comp.spec || comp.voltage || '';
      g.appendChild(specText);

      // Render Pins
      for (const pin of def.pins) {
        const pos = this.getPinLocalPos(def, pin, comp.rotation || 0);
        const pg = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        pg.setAttribute('class', 'pin-group');
        pg.dataset.compId = comp.id;
        pg.dataset.pinId = pin.id;

        const hit = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        hit.setAttribute('class', 'pin-hit');
        hit.setAttribute('cx', pos.x);
        hit.setAttribute('cy', pos.y);
        hit.setAttribute('r', 13);
        pg.appendChild(hit);

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('class', 'pin-circle');
        circle.setAttribute('cx', pos.x);
        circle.setAttribute('cy', pos.y);
        circle.setAttribute('r', 5.5);
        circle.setAttribute('fill', PIN_COLORS[pin.type] || '#94a3b8');
        pg.appendChild(circle);

        // Pin label inside component
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('class', 'pin-label');
        if (pos.x < w * 0.25) {
          label.setAttribute('x', pos.x + 10);
          label.setAttribute('y', pos.y + 3.5);
          label.setAttribute('text-anchor', 'start');
        } else if (pos.x > w * 0.75) {
          label.setAttribute('x', pos.x - 10);
          label.setAttribute('y', pos.y + 3.5);
          label.setAttribute('text-anchor', 'end');
        } else if (pos.y < h * 0.25) {
          label.setAttribute('x', pos.x);
          label.setAttribute('y', pos.y + 15);
          label.setAttribute('text-anchor', 'middle');
        } else {
          label.setAttribute('x', pos.x);
          label.setAttribute('y', pos.y - 10);
          label.setAttribute('text-anchor', 'middle');
        }
        label.textContent = pin.label;
        pg.appendChild(label);

        g.appendChild(pg);
      }

      this.compsLayer.appendChild(g);
    }
  }

  initEvents() {
    this.svg.addEventListener('contextmenu', e => e.preventDefault());

    this.svg.addEventListener('mousedown', e => {
      // Pan with Middle Mouse, Right Mouse, or Space + Left Mouse
      if (e.button === 1 || e.button === 2 || (e.button === 0 && this.spacePressed)) {
        this.dragState = {
          mode: 'pan',
          startX: e.clientX,
          startY: e.clientY,
          origX: this.viewport.x,
          origY: this.viewport.y
        };
        this.svg.classList.add('panning');
        return;
      }

      if (e.button !== 0) return;

      // 1. Check if clicked on a Pin
      const pinEl = e.target.closest('.pin-group');
      if (pinEl) {
        const compId = pinEl.dataset.compId;
        const pinId = pinEl.dataset.pinId;
        const startPos = this.getPinWorldPos(compId, pinId);
        if (startPos) {
          this.dragState = {
            mode: 'wire',
            fromComp: compId,
            fromPin: pinId,
            startPos
          };
          pinEl.classList.add('pin-active');
        }
        return;
      }

      // 2. Check if clicked on a Component
      const compEl = e.target.closest('.comp-group');
      if (compEl) {
        const compId = compEl.dataset.compId;
        const comp = this.components.find(c => c.id === compId);
        this.selected = { kind: 'comp', id: compId };
        this.renderAll();
        this.onSelectionChange(this.getSelectedObject());

        const world = this.screenToWorld(e.clientX, e.clientY);
        this.dragState = {
          mode: 'comp',
          comp,
          offsetX: world.x - comp.x,
          offsetY: world.y - comp.y,
          moved: false
        };
        return;
      }

      // 3. Check if clicked on a Wire
      const wireEl = e.target.closest('.wire-group');
      if (wireEl) {
        const wireId = wireEl.dataset.wireId;
        this.selected = { kind: 'wire', id: wireId };
        this.renderAll();
        this.onSelectionChange(this.getSelectedObject());
        return;
      }

      // 4. Check if clicked on a Note
      const noteEl = e.target.closest('.note-group');
      if (noteEl) {
        const noteId = noteEl.dataset.noteId;
        const note = this.notes.find(n => n.id === noteId);
        this.selected = { kind: 'note', id: noteId };
        this.renderAll();
        this.onSelectionChange(this.getSelectedObject());

        const world = this.screenToWorld(e.clientX, e.clientY);
        this.dragState = {
          mode: 'note',
          note,
          offsetX: world.x - note.x,
          offsetY: world.y - note.y,
          moved: false
        };
        return;
      }

      // 5. Clicked empty background -> deselect & allow pan on drag
      this.selected = null;
      this.renderAll();
      this.onSelectionChange(null);
      this.dragState = {
        mode: 'pan',
        startX: e.clientX,
        startY: e.clientY,
        origX: this.viewport.x,
        origY: this.viewport.y
      };
    });

    window.addEventListener('mousemove', e => {
      if (!this.dragState) return;

      if (this.dragState.mode === 'pan') {
        this.viewport.x = this.dragState.origX + (e.clientX - this.dragState.startX);
        this.viewport.y = this.dragState.origY + (e.clientY - this.dragState.startY);
        this.updateViewportTransform();
      } else if (this.dragState.mode === 'comp') {
        const world = this.screenToWorld(e.clientX, e.clientY);
        const nx = this.snap(world.x - this.dragState.offsetX);
        const ny = this.snap(world.y - this.dragState.offsetY);
        if (nx !== this.dragState.comp.x || ny !== this.dragState.comp.y) {
          this.dragState.comp.x = nx;
          this.dragState.comp.y = ny;
          this.dragState.moved = true;
          this.renderWires();
          this.renderComponents();
        }
      } else if (this.dragState.mode === 'note') {
        const world = this.screenToWorld(e.clientX, e.clientY);
        const nx = this.snap(world.x - this.dragState.offsetX);
        const ny = this.snap(world.y - this.dragState.offsetY);
        if (nx !== this.dragState.note.x || ny !== this.dragState.note.y) {
          this.dragState.note.x = nx;
          this.dragState.note.y = ny;
          this.dragState.moved = true;
          this.renderNotes();
        }
      } else if (this.dragState.mode === 'wire') {
        const world = this.screenToWorld(e.clientX, e.clientY);
        const p1 = this.dragState.startPos;
        const dx = Math.abs(world.x - p1.x);
        const ctrl = Math.max(40, dx * 0.5);
        const dir = p1.x <= world.x ? 1 : -1;
        const d = `M ${p1.x} ${p1.y} C ${p1.x + ctrl * dir} ${p1.y}, ${world.x - ctrl * dir} ${world.y}, ${world.x} ${world.y}`;

        this.tempLayer.innerHTML = `<path d="${d}" stroke="${this.wireColorMode === 'auto' ? this.getAutoWireColor(p1.pin) : this.wireColorMode}" stroke-width="3.5" stroke-dasharray="6 4" fill="none" stroke-linecap="round"/>`;
      }
    });

    window.addEventListener('mouseup', e => {
      if (!this.dragState) return;

      if (this.dragState.mode === 'pan') {
        this.svg.classList.remove('panning');
      } else if ((this.dragState.mode === 'comp' || this.dragState.mode === 'note') && this.dragState.moved) {
        this.saveHistory();
      } else if (this.dragState.mode === 'wire') {
        this.tempLayer.innerHTML = '';
        document.querySelectorAll('.pin-active').forEach(el => el.classList.remove('pin-active'));

        const targetPinEl = e.target.closest('.pin-group');
        if (targetPinEl) {
          const toComp = targetPinEl.dataset.compId;
          const toPin = targetPinEl.dataset.pinId;
          if (!(toComp === this.dragState.fromComp && toPin === this.dragState.fromPin)) {
            const p1 = this.getPinWorldPos(this.dragState.fromComp, this.dragState.fromPin);
            const p2 = this.getPinWorldPos(toComp, toPin);
            if (p1 && p2) {
              const color = this.wireColorMode === 'auto' ? this.getAutoWireColor(p1.pin) : this.wireColorMode;
              const gauge = this.wireGaugeMode === 'auto' ? this.getAutoWireGauge(p1.comp, p2.comp) : this.wireGaugeMode;
              const wire = {
                id: 'w_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                fromComp: this.dragState.fromComp,
                fromPin: this.dragState.fromPin,
                toComp,
                toPin,
                color,
                gauge
              };
              this.wires.push(wire);
              this.selected = { kind: 'wire', id: wire.id };
              this.saveHistory();
              this.renderAll();
              this.onSelectionChange(this.getSelectedObject());
            }
          }
        }
      }

      this.dragState = null;
    });

    this.svg.addEventListener('wheel', e => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      this.zoomAt(factor, e.clientX, e.clientY);
    }, { passive: false });

    // Touch support for smartphones & tablets
    this.svg.addEventListener('touchstart', e => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const t1 = e.touches[0], t2 = e.touches[1];
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const midX = (t1.clientX + t2.clientX) / 2;
        const midY = (t1.clientY + t2.clientY) / 2;
        this.dragState = {
          mode: 'pinch',
          startDist: dist,
          startScale: this.viewport.scale,
          midX,
          midY,
          origX: this.viewport.x,
          origY: this.viewport.y
        };
        this.tempLayer.innerHTML = '';
        return;
      }

      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      const target = document.elementFromPoint(t.clientX, t.clientY) || e.target;

      const pinEl = target.closest?.('.pin-group');
      if (pinEl) {
        e.preventDefault();
        const compId = pinEl.dataset.compId;
        const pinId = pinEl.dataset.pinId;
        const startPos = this.getPinWorldPos(compId, pinId);
        if (startPos) {
          this.dragState = { mode: 'wire', fromComp: compId, fromPin: pinId, startPos };
          pinEl.classList.add('pin-active');
        }
        return;
      }

      const compEl = target.closest?.('.comp-group');
      if (compEl) {
        e.preventDefault();
        const compId = compEl.dataset.compId;
        const comp = this.components.find(c => c.id === compId);
        this.selected = { kind: 'comp', id: compId };
        this.renderAll();
        this.onSelectionChange(this.getSelectedObject());
        const world = this.screenToWorld(t.clientX, t.clientY);
        this.dragState = { mode: 'comp', comp, offsetX: world.x - comp.x, offsetY: world.y - comp.y, moved: false };
        return;
      }

      const wireEl = target.closest?.('.wire-group');
      if (wireEl) {
        e.preventDefault();
        this.selected = { kind: 'wire', id: wireEl.dataset.wireId };
        this.renderAll();
        this.onSelectionChange(this.getSelectedObject());
        return;
      }

      const noteEl = target.closest?.('.note-group');
      if (noteEl) {
        e.preventDefault();
        const noteId = noteEl.dataset.noteId;
        const note = this.notes.find(n => n.id === noteId);
        this.selected = { kind: 'note', id: noteId };
        this.renderAll();
        this.onSelectionChange(this.getSelectedObject());
        const world = this.screenToWorld(t.clientX, t.clientY);
        this.dragState = { mode: 'note', note, offsetX: world.x - note.x, offsetY: world.y - note.y, moved: false };
        return;
      }

      e.preventDefault();
      this.selected = null;
      this.renderAll();
      this.onSelectionChange(null);
      this.dragState = {
        mode: 'pan',
        startX: t.clientX,
        startY: t.clientY,
        origX: this.viewport.x,
        origY: this.viewport.y
      };
    }, { passive: false });

    this.svg.addEventListener('touchmove', e => {
      if (!this.dragState) return;
      e.preventDefault();

      if (this.dragState.mode === 'pinch' && e.touches.length === 2) {
        const t1 = e.touches[0], t2 = e.touches[1];
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const factor = dist / this.dragState.startDist;
        const newScale = Math.min(2.5, Math.max(0.25, this.dragState.startScale * factor));

        const rect = this.svg.getBoundingClientRect();
        const cx = this.dragState.midX - rect.left;
        const cy = this.dragState.midY - rect.top;
        const wx = (cx - this.dragState.origX) / this.dragState.startScale;
        const wy = (cy - this.dragState.origY) / this.dragState.startScale;

        this.viewport.scale = newScale;
        this.viewport.x = cx - wx * newScale;
        this.viewport.y = cy - wy * newScale;
        this.updateViewportTransform();
        return;
      }

      if (e.touches.length !== 1) return;
      const t = e.touches[0];

      if (this.dragState.mode === 'pan') {
        this.viewport.x = this.dragState.origX + (t.clientX - this.dragState.startX);
        this.viewport.y = this.dragState.origY + (t.clientY - this.dragState.startY);
        this.updateViewportTransform();
      } else if (this.dragState.mode === 'comp') {
        const world = this.screenToWorld(t.clientX, t.clientY);
        const nx = this.snap(world.x - this.dragState.offsetX);
        const ny = this.snap(world.y - this.dragState.offsetY);
        if (nx !== this.dragState.comp.x || ny !== this.dragState.comp.y) {
          this.dragState.comp.x = nx;
          this.dragState.comp.y = ny;
          this.dragState.moved = true;
          this.renderWires();
          this.renderComponents();
        }
      } else if (this.dragState.mode === 'note') {
        const world = this.screenToWorld(t.clientX, t.clientY);
        const nx = this.snap(world.x - this.dragState.offsetX);
        const ny = this.snap(world.y - this.dragState.offsetY);
        if (nx !== this.dragState.note.x || ny !== this.dragState.note.y) {
          this.dragState.note.x = nx;
          this.dragState.note.y = ny;
          this.dragState.moved = true;
          this.renderNotes();
        }
      } else if (this.dragState.mode === 'wire') {
        const world = this.screenToWorld(t.clientX, t.clientY);
        const p1 = this.dragState.startPos;
        const dx = Math.abs(world.x - p1.x);
        const ctrl = Math.max(40, dx * 0.5);
        const dir = p1.x <= world.x ? 1 : -1;
        const d = `M ${p1.x} ${p1.y} C ${p1.x + ctrl * dir} ${p1.y}, ${world.x - ctrl * dir} ${world.y}, ${world.x} ${world.y}`;
        this.tempLayer.innerHTML = `<path d="${d}" stroke="${this.wireColorMode === 'auto' ? this.getAutoWireColor(p1.pin) : this.wireColorMode}" stroke-width="3.5" stroke-dasharray="6 4" fill="none" stroke-linecap="round"/>`;
      }
    }, { passive: false });

    const endTouch = e => {
      if (!this.dragState) return;
      if ((this.dragState.mode === 'comp' || this.dragState.mode === 'note') && this.dragState.moved) {
        this.saveHistory();
      } else if (this.dragState.mode === 'wire') {
        this.tempLayer.innerHTML = '';
        document.querySelectorAll('.pin-active').forEach(el => el.classList.remove('pin-active'));
        const t = e.changedTouches[0];
        if (t) {
          const target = document.elementFromPoint(t.clientX, t.clientY);
          const targetPinEl = target?.closest?.('.pin-group');
          if (targetPinEl) {
            const toComp = targetPinEl.dataset.compId;
            const toPin = targetPinEl.dataset.pinId;
            if (!(toComp === this.dragState.fromComp && toPin === this.dragState.fromPin)) {
              const p1 = this.getPinWorldPos(this.dragState.fromComp, this.dragState.fromPin);
              const p2 = this.getPinWorldPos(toComp, toPin);
              if (p1 && p2) {
                const color = this.wireColorMode === 'auto' ? this.getAutoWireColor(p1.pin) : this.wireColorMode;
                const gauge = this.wireGaugeMode === 'auto' ? this.getAutoWireGauge(p1.comp, p2.comp) : this.wireGaugeMode;
                const wire = {
                  id: 'w_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                  fromComp: this.dragState.fromComp,
                  fromPin: this.dragState.fromPin,
                  toComp,
                  toPin,
                  color,
                  gauge
                };
                this.wires.push(wire);
                this.selected = { kind: 'wire', id: wire.id };
                this.saveHistory();
                this.renderAll();
                this.onSelectionChange(this.getSelectedObject());
              }
            }
          }
        }
      }
      this.dragState = null;
    };

    this.svg.addEventListener('touchend', endTouch);
    this.svg.addEventListener('touchcancel', endTouch);
  }

  checkSafety() {
    const warnings = [];
    const errors = [];

    for (const w of this.wires) {
      const p1 = this.getPinWorldPos(w.fromComp, w.fromPin);
      const p2 = this.getPinWorldPos(w.toComp, w.toPin);
      if (!p1 || !p2) continue;

      const t1 = p1.pin.type;
      const t2 = p2.pin.type;

      // 1. Direct + to - short circuit check
      if ((t1 === 'pos' && t2 === 'neg') || (t1 === 'neg' && t2 === 'pos')) {
        // Exception: rocker switch LED GND pin should connect to neg, not pos, so pos->neg is still wrong;
        // Wait: if someone connects battery + directly to battery - or busbar + to busbar -
        errors.push(`Короткое замыкание (+ на −): «${p1.comp.name}» (${p1.pin.label}) → «${p2.comp.name}» (${p2.pin.label})!`);
      }

      // 2. AC 220V mixed with DC
      const isAC1 = ['ac_l', 'ac_n', 'ac_pe'].includes(t1);
      const isAC2 = ['ac_l', 'ac_n', 'ac_pe'].includes(t2);
      if (isAC1 !== isAC2 && t1 !== 'any' && t2 !== 'any') {
        errors.push(`Опасное смешение 220V AC и DC: «${p1.comp.name}» → «${p2.comp.name}»!`);
      }

      // 3. AC L connected to N or PE
      if ((t1 === 'ac_l' && (t2 === 'ac_n' || t2 === 'ac_pe')) || (t2 === 'ac_l' && (t1 === 'ac_n' || t1 === 'ac_pe'))) {
        errors.push(`Короткое замыкание 220V (Фаза на Ноль/Землю): «${p1.comp.name}» → «${p2.comp.name}»!`);
      }

      // 4. 24V directly into 12V load without DC-DC
      const v1 = p1.pin.voltage;
      const v2 = p2.pin.voltage;
      if ((v1 === 24 && v2 === 12) || (v1 === 12 && v2 === 24)) {
        warnings.push(`Несовпадение напряжения (24V → 12V): «${p1.comp.name}» → «${p2.comp.name}». Используйте DC-DC понижайку!`);
      }

      // 5. Thin wire on Inverter DC input
      const isInv = (p1.comp.type === 'inverter-24-220' && p1.pin.id.startsWith('dc')) ||
                    (p2.comp.type === 'inverter-24-220' && p2.pin.id.startsWith('dc'));
      if (isInv && (w.gauge.includes('0.5') || w.gauge.includes('0.75') || w.gauge.includes('1.5') || w.gauge.includes('2.5'))) {
        warnings.push(`Тонкий провод (${w.gauge}) на силовом входе инвертора! Для 24В инвертора нужно 10–25 мм².`);
      }
    }

    // Check if there is a 24V battery without a fuse
    const hasBat = this.components.some(c => c.type === 'battery-24v' || c.type === 'battery-12v');
    const hasFuse = this.components.some(c => c.type === 'fuse-anl' || c.type === 'main-switch-dc' || c.type === 'fuse-box');
    if (hasBat && !hasFuse && this.components.length > 2) {
      warnings.push('На схеме есть АКБ, но нет предохранителя или автомата защиты на плюсе!');
    }

    return { errors, warnings };
  }
}

// Каталог электрических компонентов для конструктора схем

const PIN_COLORS = {
  pos: '#ef4444',      // Плюс DC (+)
  neg: '#334155',      // Минус DC (-)
  ac_l: '#b45309',     // Фаза 220V (L)
  ac_n: '#3b82f6',     // Ноль 220V (N)
  ac_pe: '#22c55e',    // Заземление (PE)
  sig: '#f59e0b',      // Сигнал / Управление / Вспомогательный
  any: '#94a3b8'       // Универсальный контакт
};

const CATEGORIES = [
  { id: 'power', name: '🔋 Источники и АКБ' },
  { id: 'converters', name: '🔄 Преобразователи' },
  { id: 'outputs', name: '🔌 Выходы и Нагрузка' },
  { id: 'protection', name: '🛡️ Защита и Автоматы' },
  { id: 'switches', name: '🔘 Кнопки и Реле' },
  { id: 'metering', name: '📊 Мониторинг' },
  { id: 'busbars', name: '🔗 Шины и Клеммы' }
];

const COMPONENT_CATALOG = [
  // ================= ИСТОЧНИКИ И АКБ =================
  {
    type: 'battery-24v',
    category: 'power',
    name: 'Сборка АКБ 24V',
    shortDesc: 'LiFePO4 8S / Li-ion 7S',
    icon: '🔋',
    headerColor: '#059669',
    width: 170,
    height: 110,
    defaultVoltage: '24V DC',
    defaultSpec: '8S LiFePO4 100Ah (25.6V)',
    pins: [
      { id: 'pos', label: '+24V', type: 'pos', voltage: 24, side: 'right', offset: 0.32 },
      { id: 'neg', label: 'B- (Общ)', type: 'neg', voltage: 24, side: 'right', offset: 0.72 }
    ]
  },
  {
    type: 'battery-12v',
    category: 'power',
    name: 'АКБ 12V',
    shortDesc: 'LiFePO4 4S / AGM 12V',
    icon: '🪫',
    headerColor: '#0d9488',
    width: 160,
    height: 100,
    defaultVoltage: '12V DC',
    defaultSpec: '12.8V 100Ah',
    pins: [
      { id: 'pos', label: '+12V', type: 'pos', voltage: 12, side: 'right', offset: 0.32 },
      { id: 'neg', label: '-', type: 'neg', voltage: 12, side: 'right', offset: 0.72 }
    ]
  },
  {
    type: 'bms-board',
    category: 'power',
    name: 'BMS (Асимметричная)',
    shortDesc: 'Раздельные порты C- и P-',
    icon: '🧩',
    headerColor: '#0284c7',
    width: 175,
    height: 110,
    defaultVoltage: '24V DC',
    defaultSpec: '8S 100A (Раздельный порт)',
    pins: [
      { id: 'b_minus', label: 'B- (к АКБ)', type: 'neg', voltage: 24, side: 'left', offset: 0.35 },
      { id: 'c_minus', label: 'C- (Заряд)', type: 'neg', voltage: 24, side: 'left', offset: 0.75 },
      { id: 'p_minus', label: 'P- (Выход)', type: 'neg', voltage: 24, side: 'right', offset: 0.55 }
    ]
  },
  {
    type: 'bms-symmetrical',
    category: 'power',
    name: 'BMS (Симметричная)',
    shortDesc: 'Заряд и разряд через 1 порт',
    icon: '🔄',
    headerColor: '#0369a1',
    width: 180,
    height: 95,
    defaultVoltage: '24V DC',
    defaultSpec: '8S 100A (Общий порт P-)',
    pins: [
      { id: 'b_minus', label: 'B- (к АКБ)', type: 'neg', voltage: 24, side: 'left', offset: 0.5 },
      { id: 'p_minus', label: 'P-/C- (Общий)', type: 'neg', voltage: 24, side: 'right', offset: 0.5 }
    ]
  },
  {
    type: 'charge-port-xt60',
    category: 'power',
    name: 'Порт зарядки XT60',
    shortDesc: 'Вход от зарядного устройства',
    icon: '🔌',
    headerColor: '#d97706',
    width: 150,
    height: 90,
    defaultVoltage: '29.2V DC',
    defaultSpec: 'XT60 Панельный (до 30A)',
    pins: [
      { id: 'pos', label: '+ Заряд', type: 'pos', voltage: 24, side: 'right', offset: 0.32 },
      { id: 'neg', label: '- Заряд', type: 'neg', voltage: 24, side: 'right', offset: 0.72 }
    ]
  },
  {
    type: 'solar-panel',
    category: 'power',
    name: 'Солнечная панель',
    shortDesc: 'Вход солнечной энергии',
    icon: '☀️',
    headerColor: '#1d4ed8',
    width: 150,
    height: 95,
    defaultVoltage: '36V DC',
    defaultSpec: '200W Солнечная панель',
    pins: [
      { id: 'pos', label: 'PV+', type: 'pos', voltage: 36, side: 'right', offset: 0.32 },
      { id: 'neg', label: 'PV-', type: 'neg', voltage: 36, side: 'right', offset: 0.72 }
    ]
  },
  {
    type: 'mppt-controller',
    category: 'power',
    name: 'Контроллер MPPT',
    shortDesc: 'Заряд от солнечных панелей',
    icon: '🎛️',
    headerColor: '#2563eb',
    width: 175,
    height: 120,
    defaultVoltage: '12/24V Auto',
    defaultSpec: 'MPPT 30A',
    pins: [
      { id: 'pv_pos', label: 'PV+', type: 'pos', voltage: 36, side: 'left', offset: 0.3 },
      { id: 'pv_neg', label: 'PV-', type: 'neg', voltage: 36, side: 'left', offset: 0.7 },
      { id: 'bat_pos', label: 'BAT+', type: 'pos', voltage: 24, side: 'right', offset: 0.3 },
      { id: 'bat_neg', label: 'BAT-', type: 'neg', voltage: 24, side: 'right', offset: 0.7 }
    ]
  },

  // ================= ПРЕОБРАЗОВАТЕЛИ =================
  {
    type: 'inverter-24-220',
    category: 'converters',
    name: 'Инвертор 24В → 220В',
    shortDesc: 'Чистый синус 220V AC',
    icon: '⚡',
    headerColor: '#7c3aed',
    width: 215,
    height: 160,
    defaultVoltage: '24V DC → 220V AC',
    defaultSpec: '1500W / Пик 3000W',
    pins: [
      { id: 'dc_pos', label: '+24V IN', type: 'pos', voltage: 24, side: 'left', offset: 0.25 },
      { id: 'dc_neg', label: '-24V IN', type: 'neg', voltage: 24, side: 'left', offset: 0.46 },
      { id: 'rem_sw', label: 'REM (Кн)', type: 'sig', voltage: 'sig', side: 'left', offset: 0.67 },
      { id: 'lcd_bus', label: 'LCD (Экран)', type: 'sig', voltage: 'sig', side: 'left', offset: 0.87 },
      { id: 'ac_l', label: '220V L', type: 'ac_l', voltage: 220, side: 'right', offset: 0.28 },
      { id: 'ac_n', label: '220V N', type: 'ac_n', voltage: 220, side: 'right', offset: 0.56 },
      { id: 'ac_pe', label: 'Земля PE', type: 'ac_pe', voltage: 220, side: 'right', offset: 0.84 }
    ]
  },
  {
    type: 'dcdc-24-12',
    category: 'converters',
    name: 'Понижайка DC-DC 24→12В',
    shortDesc: 'Стабилизатор 24V в 12V',
    icon: '🔽',
    headerColor: '#4f46e5',
    width: 185,
    height: 110,
    defaultVoltage: '24V → 12V DC',
    defaultSpec: '20A (240W)',
    pins: [
      { id: 'in_pos', label: 'IN +24V', type: 'pos', voltage: 24, side: 'left', offset: 0.32 },
      { id: 'in_neg', label: 'IN -', type: 'neg', voltage: 24, side: 'left', offset: 0.72 },
      { id: 'out_pos', label: 'OUT +12V', type: 'pos', voltage: 12, side: 'right', offset: 0.32 },
      { id: 'out_neg', label: 'OUT -', type: 'neg', voltage: 12, side: 'right', offset: 0.72 }
    ]
  },
  {
    type: 'usb-qc-pd',
    category: 'converters',
    name: 'Модуль USB PD + QC3.0',
    shortDesc: 'Быстрая зарядка Type-C / USB-A',
    icon: '📱',
    headerColor: '#0891b2',
    width: 175,
    height: 100,
    defaultVoltage: '12-24V DC (вход)',
    defaultSpec: 'PD 65W + QC 18W',
    pins: [
      { id: 'in_pos', label: 'IN + (12-24V)', type: 'pos', voltage: '12-24', side: 'left', offset: 0.32 },
      { id: 'in_neg', label: 'IN -', type: 'neg', voltage: '12-24', side: 'left', offset: 0.72 }
    ]
  },

  // ================= ВЫХОДЫ И НАГРУЗКА =================
  {
    type: 'socket-220v',
    category: 'outputs',
    name: 'Розетка 220V (Евро)',
    shortDesc: 'Встраиваемая с заземлением',
    icon: '🔌',
    headerColor: '#be123c',
    width: 160,
    height: 115,
    defaultVoltage: '220V AC',
    defaultSpec: '16A Schuko IP44',
    pins: [
      { id: 'l', label: 'L (Фаза)', type: 'ac_l', voltage: 220, side: 'left', offset: 0.25 },
      { id: 'n', label: 'N (Ноль)', type: 'ac_n', voltage: 220, side: 'left', offset: 0.55 },
      { id: 'pe', label: 'PE (Земля)', type: 'ac_pe', voltage: 220, side: 'left', offset: 0.85 }
    ]
  },
  {
    type: 'car-socket-12v',
    category: 'outputs',
    name: 'Прикуриватель 12V',
    shortDesc: 'Автомобильное гнездо 12V',
    icon: '🚗',
    headerColor: '#0f766e',
    width: 155,
    height: 90,
    defaultVoltage: '12V DC',
    defaultSpec: '15A (180W max)',
    pins: [
      { id: 'pos', label: '+12V (Центр)', type: 'pos', voltage: 12, side: 'left', offset: 0.32 },
      { id: 'neg', label: '- (Корпус)', type: 'neg', voltage: 12, side: 'left', offset: 0.72 }
    ]
  },
  {
    type: 'cooling-fan',
    category: 'outputs',
    name: 'Кулер охлаждения',
    shortDesc: 'Вентилятор корпуса',
    icon: '🌀',
    headerColor: '#0369a1',
    width: 150,
    height: 90,
    defaultVoltage: '12V / 24V DC',
    defaultSpec: '80x80mm 0.25A',
    pins: [
      { id: 'pos', label: '+ Пит', type: 'pos', voltage: '12-24', side: 'left', offset: 0.32 },
      { id: 'neg', label: '- Пит', type: 'neg', voltage: '12-24', side: 'left', offset: 0.72 }
    ]
  },
  {
    type: 'led-light',
    category: 'outputs',
    name: 'LED Подсветка / Фонарь',
    shortDesc: 'Освещение корпуса или прожектор',
    icon: '💡',
    headerColor: '#ca8a04',
    width: 155,
    height: 90,
    defaultVoltage: '12V DC',
    defaultSpec: '5W LED',
    pins: [
      { id: 'pos', label: '+12V', type: 'pos', voltage: 12, side: 'left', offset: 0.32 },
      { id: 'neg', label: '-', type: 'neg', voltage: 12, side: 'left', offset: 0.72 }
    ]
  },

  // ================= ЗАЩИТА И АВТОМАТЫ =================
  {
    type: 'main-switch-dc',
    category: 'protection',
    name: 'Главный рубильник DC',
    shortDesc: 'Автомат / Выключатель массы',
    icon: '🛑',
    headerColor: '#dc2626',
    width: 165,
    height: 90,
    defaultVoltage: 'до 48V DC',
    defaultSpec: '100A Автомат DC',
    pins: [
      { id: 'in', label: 'IN (от АКБ)', type: 'pos', voltage: 'any', side: 'left', offset: 0.5 },
      { id: 'out', label: 'OUT (Шина)', type: 'pos', voltage: 'any', side: 'right', offset: 0.5 }
    ]
  },
  {
    type: 'fuse-anl',
    category: 'protection',
    name: 'Предохранитель ANL/MIDI',
    shortDesc: 'Силовая защита плюса',
    icon: '🛡️',
    headerColor: '#ea580c',
    width: 160,
    height: 85,
    defaultVoltage: 'до 58V DC',
    defaultSpec: '80A ANL',
    pins: [
      { id: 'in', label: 'IN', type: 'pos', voltage: 'any', side: 'left', offset: 0.5 },
      { id: 'out', label: 'OUT', type: 'pos', voltage: 'any', side: 'right', offset: 0.5 }
    ]
  },
  {
    type: 'fuse-box',
    category: 'protection',
    name: 'Блок предохранителей',
    shortDesc: 'Распределитель с защитой',
    icon: '📦',
    headerColor: '#c2410c',
    width: 175,
    height: 125,
    defaultVoltage: '12-24V DC',
    defaultSpec: '4 канала (по 10A-20A)',
    pins: [
      { id: 'in_pos', label: 'IN + (Общ)', type: 'pos', voltage: '12-24', side: 'left', offset: 0.5 },
      { id: 'ch1', label: 'CH1 + (10A)', type: 'pos', voltage: '12-24', side: 'right', offset: 0.22 },
      { id: 'ch2', label: 'CH2 + (15A)', type: 'pos', voltage: '12-24', side: 'right', offset: 0.48 },
      { id: 'ch3', label: 'CH3 + (15A)', type: 'pos', voltage: '12-24', side: 'right', offset: 0.74 }
    ]
  },
  {
    type: 'breaker-ac-220',
    category: 'protection',
    name: 'Автомат 220V (2P)',
    shortDesc: 'Защита выхода 220V AC',
    icon: '⚡',
    headerColor: '#b91c1c',
    width: 165,
    height: 100,
    defaultVoltage: '220V AC',
    defaultSpec: 'C10 (10A) 2-полюсный',
    pins: [
      { id: 'in_l', label: 'L IN', type: 'ac_l', voltage: 220, side: 'left', offset: 0.32 },
      { id: 'in_n', label: 'N IN', type: 'ac_n', voltage: 220, side: 'left', offset: 0.72 },
      { id: 'out_l', label: 'L OUT', type: 'ac_l', voltage: 220, side: 'right', offset: 0.32 },
      { id: 'out_n', label: 'N OUT', type: 'ac_n', voltage: 220, side: 'right', offset: 0.72 }
    ]
  },
  {
    type: 'power-resistor-rx24',
    category: 'protection',
    name: 'Силовой резистор (RX24)',
    shortDesc: 'Предзаряд и ограничение тока',
    icon: '🔶',
    headerColor: '#b45309',
    width: 180,
    height: 85,
    defaultVoltage: 'до 100V',
    defaultSpec: '20 Ом 25W (Алюминиевый)',
    pins: [
      { id: 'in', label: '1 (Вход)', type: 'any', voltage: 'any', side: 'left', offset: 0.5 },
      { id: 'out', label: '2 (Выход)', type: 'any', voltage: 'any', side: 'right', offset: 0.5 }
    ]
  },
  {
    type: 'power-resistor-ceramic',
    category: 'protection',
    name: 'Керамический резистор',
    shortDesc: 'Цементный SQP 5–20W',
    icon: '🧱',
    headerColor: '#78716c',
    width: 170,
    height: 85,
    defaultVoltage: 'до 250V',
    defaultSpec: '10 Ом 10W (SQP)',
    pins: [
      { id: 'in', label: '1 (Вход)', type: 'any', voltage: 'any', side: 'left', offset: 0.5 },
      { id: 'out', label: '2 (Выход)', type: 'any', voltage: 'any', side: 'right', offset: 0.5 }
    ]
  },

  // ================= КНОПКИ И РЕЛЕ =================
  {
    type: 'rocker-switch',
    category: 'switches',
    name: 'Кнопка с подсветкой',
    shortDesc: 'Клавишный KCD4 / Круглая',
    icon: '🔘',
    headerColor: '#0284c7',
    width: 155,
    height: 100,
    defaultVoltage: '12-24V DC',
    defaultSpec: '20A с LED подсветкой',
    pins: [
      { id: 'in', label: 'IN (+)', type: 'pos', voltage: 'any', side: 'left', offset: 0.32 },
      { id: 'gnd', label: 'GND (LED)', type: 'neg', voltage: 'any', side: 'left', offset: 0.72 },
      { id: 'out', label: 'OUT (+)', type: 'pos', voltage: 'any', side: 'right', offset: 0.5 }
    ]
  },
  {
    type: 'toggle-switch',
    category: 'switches',
    name: 'Тумблер (Вкл/Выкл)',
    shortDesc: 'В разрыв одного провода',
    icon: '🎚️',
    headerColor: '#475569',
    width: 145,
    height: 80,
    defaultVoltage: 'до 250V',
    defaultSpec: '15A 2-pin',
    pins: [
      { id: 'in', label: '1 (Вход)', type: 'any', voltage: 'any', side: 'left', offset: 0.5 },
      { id: 'out', label: '2 (Выход)', type: 'any', voltage: 'any', side: 'right', offset: 0.5 }
    ]
  },
  {
    type: 'dpst-switch',
    category: 'switches',
    name: 'Двойная кнопка (2 контура)',
    shortDesc: 'DPST 4-pin: две независимые цепи',
    icon: '🎛️',
    headerColor: '#0ea5e9',
    width: 185,
    height: 110,
    defaultVoltage: 'до 250V / 24V',
    defaultSpec: 'KCD2-202 (2 изолир. цепи)',
    pins: [
      { id: 'in1', label: '1 IN (+24V)', type: 'pos', voltage: 'any', side: 'left', offset: 0.32 },
      { id: 'in2', label: '2 IN (REM)', type: 'sig', voltage: 'sig', side: 'left', offset: 0.72 },
      { id: 'out1', label: '1 OUT (Вент)', type: 'pos', voltage: 'any', side: 'right', offset: 0.32 },
      { id: 'out2', label: '2 OUT (REM)', type: 'sig', voltage: 'sig', side: 'right', offset: 0.72 }
    ]
  },
  {
    type: 'remote-button',
    category: 'switches',
    name: 'Кнопка инвертора',
    shortDesc: 'Выносная кнопка на корпус',
    icon: '🔴',
    headerColor: '#9333ea',
    width: 150,
    height: 80,
    defaultVoltage: 'Сигнал',
    defaultSpec: 'Управление REM',
    pins: [
      { id: 'sig', label: 'REM', type: 'sig', voltage: 'sig', side: 'right', offset: 0.5 }
    ]
  },
  {
    type: 'relay-24v',
    category: 'switches',
    name: 'Термореле / Реле 24V',
    shortDesc: 'Включение кулера по t°',
    icon: '🌡️',
    headerColor: '#0f766e',
    width: 165,
    height: 105,
    defaultVoltage: '24V DC',
    defaultSpec: 'W1209 / KSD9700 45°C',
    pins: [
      { id: 'pwr_pos', label: '+ Пит', type: 'pos', voltage: '12-24', side: 'left', offset: 0.3 },
      { id: 'pwr_neg', label: '- Пит', type: 'neg', voltage: '12-24', side: 'left', offset: 0.7 },
      { id: 'out_pos', label: 'OUT +', type: 'pos', voltage: '12-24', side: 'right', offset: 0.5 }
    ]
  },
  {
    type: 'relay-24v-dry',
    category: 'switches',
    name: 'Реле 24V (Сухой контакт)',
    shortDesc: 'Автореле 4-pin (85/86, 30/87)',
    icon: '🧲',
    headerColor: '#0f766e',
    width: 190,
    height: 115,
    defaultVoltage: '24V DC',
    defaultSpec: '4-pin (Изолир. контакт)',
    pins: [
      { id: 'coil_pos', label: '85 (+ Катушка)', type: 'pos', voltage: 24, side: 'left', offset: 0.32 },
      { id: 'coil_neg', label: '86 (- Катушка)', type: 'neg', voltage: 24, side: 'left', offset: 0.72 },
      { id: 'com', label: '30 (Конт. 1)', type: 'sig', voltage: 'sig', side: 'right', offset: 0.32 },
      { id: 'no', label: '87 (Конт. 2)', type: 'sig', voltage: 'sig', side: 'right', offset: 0.72 }
    ]
  },

  // ================= МОНИТОРИНГ =================
  {
    type: 'shunt-coulomb',
    category: 'metering',
    name: 'Кулонометр + Шунт',
    shortDesc: 'Замер тока, % АКБ и Ватт',
    icon: '📊',
    headerColor: '#16a34a',
    width: 185,
    height: 115,
    defaultVoltage: '8-80V DC',
    defaultSpec: 'TK15 / TF03 Шунт 100A',
    pins: [
      { id: 'b_minus', label: 'B- (от BMS)', type: 'neg', voltage: 24, side: 'left', offset: 0.35 },
      { id: 'sense_pos', label: 'B+ (Пит)', type: 'pos', voltage: 24, side: 'left', offset: 0.75 },
      { id: 'p_minus', label: 'P- (Нагрузка)', type: 'neg', voltage: 24, side: 'right', offset: 0.5 }
    ]
  },
  {
    type: 'voltmeter-dc',
    category: 'metering',
    name: 'Вольтметр DC',
    shortDesc: 'Мини-индикатор напряжения',
    icon: '📟',
    headerColor: '#0284c7',
    width: 145,
    height: 85,
    defaultVoltage: '5-30V DC',
    defaultSpec: 'LED Экран',
    pins: [
      { id: 'pos', label: '+ Замер', type: 'pos', voltage: 'any', side: 'left', offset: 0.32 },
      { id: 'neg', label: '- Общий', type: 'neg', voltage: 'any', side: 'left', offset: 0.72 }
    ]
  },
  {
    type: 'inverter-display',
    category: 'metering',
    name: 'Выносной экран инвертора',
    shortDesc: 'Удлинённый дисплей на корпус',
    icon: '🖥️',
    headerColor: '#7c3aed',
    width: 195,
    height: 90,
    defaultVoltage: 'Сигнал (4-6 жил)',
    defaultSpec: 'LCD Панель (экран. кабель)',
    pins: [
      { id: 'lcd_in', label: 'К инвертору (LCD)', type: 'sig', voltage: 'sig', side: 'left', offset: 0.5 }
    ]
  },

  // ================= ШИНЫ И КЛЕММЫ =================
  {
    type: 'busbar-pos',
    category: 'busbars',
    name: 'Шина ПЛЮС (+)',
    shortDesc: 'Распределительная шина M6',
    icon: '🟥',
    headerColor: '#dc2626',
    width: 145,
    height: 140,
    defaultVoltage: 'Шина +',
    defaultSpec: 'Медная шина 150A',
    pins: [
      { id: 'in', label: 'IN +', type: 'pos', voltage: 'any', side: 'left', offset: 0.5 },
      { id: 'out1', label: 'OUT 1', type: 'pos', voltage: 'any', side: 'right', offset: 0.2 },
      { id: 'out2', label: 'OUT 2', type: 'pos', voltage: 'any', side: 'right', offset: 0.5 },
      { id: 'out3', label: 'OUT 3', type: 'pos', voltage: 'any', side: 'right', offset: 0.8 }
    ]
  },
  {
    type: 'busbar-neg',
    category: 'busbars',
    name: 'Шина МИНУС (-)',
    shortDesc: 'Распределительная шина M6',
    icon: '⬛',
    headerColor: '#334155',
    width: 145,
    height: 140,
    defaultVoltage: 'Шина -',
    defaultSpec: 'Медная шина 150A',
    pins: [
      { id: 'in', label: 'IN -', type: 'neg', voltage: 'any', side: 'left', offset: 0.5 },
      { id: 'out1', label: 'OUT 1', type: 'neg', voltage: 'any', side: 'right', offset: 0.2 },
      { id: 'out2', label: 'OUT 2', type: 'neg', voltage: 'any', side: 'right', offset: 0.5 },
      { id: 'out3', label: 'OUT 3', type: 'neg', voltage: 'any', side: 'right', offset: 0.8 }
    ]
  },
  {
    type: 'terminal-block',
    category: 'busbars',
    name: 'Клеммник (WAGO / Винт)',
    shortDesc: 'Разветвитель 1 → 3',
    icon: '🔗',
    headerColor: '#64748b',
    width: 135,
    height: 110,
    defaultVoltage: 'до 250V',
    defaultSpec: 'Клемма 32A',
    pins: [
      { id: 'in', label: 'IN', type: 'any', voltage: 'any', side: 'left', offset: 0.5 },
      { id: 'out1', label: '1', type: 'any', voltage: 'any', side: 'right', offset: 0.22 },
      { id: 'out2', label: '2', type: 'any', voltage: 'any', side: 'right', offset: 0.5 },
      { id: 'out3', label: '3', type: 'any', voltage: 'any', side: 'right', offset: 0.78 }
    ]
  }
];

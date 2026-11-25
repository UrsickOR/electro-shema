// Готовые шаблоны электрических схем

function getPresetData(presetId) {
  if (presetId === 'ivert-220-v1') {
    return {
      "version": 1,
      "components": [
        { "id": "r_bat", "type": "battery-24v", "name": "АКБ 24V (8S LiFePO4)", "voltage": "25.6V DC", "spec": "8S 100Ah", "x": 60, "y": 180, "rotation": 0 },
        { "id": "r_bms", "type": "bms-symmetrical", "name": "BMS (Симметричная)", "voltage": "24V DC", "spec": "8S 100A (Общий порт P-)", "x": 290, "y": 270, "rotation": 0 },
        { "id": "r_btn", "type": "toggle-switch", "name": "кнопка 2 пин ивертор", "voltage": "24V DC", "spec": "2 контакта (Вкл/Выкл)", "x": 460, "y": 180, "rotation": 0 },
        { "id": "r_relay", "type": "relay-24v-dry", "name": "Реле 24V (Автореле)", "voltage": "24V DC", "spec": "85/86 катушка, 30/87 на REM", "x": 680, "y": 420, "rotation": 0 },
        { "id": "r_inv", "type": "inverter-24-220", "name": "Инвертор 24V → 220V", "voltage": "24V → 220V AC", "spec": "1500W (Подкл. напрямую)", "x": 1100, "y": 20, "rotation": 0 },
        { "id": "r_sock", "type": "socket-220v", "name": "Розетка 220V Евро", "voltage": "220V AC", "spec": "16A Schuko", "x": 1500, "y": -80, "rotation": 0 },
        { "id": "r_fan1", "type": "cooling-fan", "name": "Вентилятор 1 (24V)", "voltage": "24V DC", "spec": "80x80mm 24V 0.2A", "x": 1010, "y": 250, "rotation": 0 },
        { "id": "r_fan2", "type": "cooling-fan", "name": "Вентилятор 2 (24V)", "voltage": "24V DC", "spec": "80x80mm 24V 0.2A", "x": 1010, "y": 370, "rotation": 0 },
        { "id": "comp_1795643785818_943", "type": "inverter-display", "name": "Выносной экран инвертора", "voltage": "Сигнал (4-6 жил)", "spec": "LCD Панель (экран. кабель)", "x": 1240, "y": 220, "rotation": 0 },
        { "id": "comp_1795643857941_298", "type": "socket-220v", "name": "Розетка 220V (Евро)", "voltage": "220V AC", "spec": "16A Schuko IP44", "x": 1500, "y": 80, "rotation": 0 },
        { "id": "comp_1795643985290_198", "type": "charge-port-xt60", "name": "Порт зарядки XT60", "voltage": "29.2V DC", "spec": "XT60 Панельный (до 30A)", "x": 60, "y": 40, "rotation": 0 },
        { "id": "comp_1795644017679_688", "type": "usb-qc-pd", "name": "Модуль USB PD + QC3.0", "voltage": "12-24V DC (вход)", "spec": "PD 65W + QC 18W", "x": 1020, "y": -140, "rotation": 0 },
        { "id": "comp_1795644072304_579", "type": "rocker-switch", "name": "Кнопка с подсветкой", "voltage": "12-24V DC", "spec": "20A с LED подсветкой", "x": 380, "y": -60, "rotation": 0 },
        { "id": "comp_1795644183417_75", "type": "power-resistor-rx24", "name": "Силовой резистор (RX24)", "voltage": "до 100V", "spec": "20 Ом 25W (Алюминиевый)", "x": 580, "y": -80, "rotation": 0 },
        { "id": "comp_1795644230258_489", "type": "car-socket-12v", "name": "Прикуриватель 12V", "voltage": "12V DC", "spec": "15A (180W max)", "x": 1080, "y": -300, "rotation": 0 },
        { "id": "comp_1795644248641_378", "type": "dcdc-24-12", "name": "Понижайка DC-DC 24→12В", "voltage": "24V → 12V DC", "spec": "20A (240W)", "x": 840, "y": -300, "rotation": 0 }
      ],
      "wires": [
        { "id": "rw4", "fromComp": "r_bat", "fromPin": "neg", "toComp": "r_bms", "toPin": "b_minus", "color": "#1e293b", "gauge": "16 мм² (6 AWG)" },
        { "id": "rw8", "fromComp": "r_btn", "fromPin": "out", "toComp": "r_fan1", "toPin": "pos", "color": "#ef4444", "gauge": "0.75 мм² (18 AWG)" },
        { "id": "rw9", "fromComp": "r_btn", "fromPin": "out", "toComp": "r_fan2", "toPin": "pos", "color": "#ef4444", "gauge": "0.75 мм² (18 AWG)" },
        { "id": "rw10", "fromComp": "r_btn", "fromPin": "out", "toComp": "r_relay", "toPin": "coil_pos", "color": "#ef4444", "gauge": "0.5 мм² (сигнал)" },
        { "id": "rw14", "fromComp": "r_relay", "fromPin": "no", "toComp": "r_inv", "toPin": "rem_sw", "color": "#a855f7", "gauge": "0.5 мм² (сигнал)" },
        { "id": "rw15", "fromComp": "r_inv", "fromPin": "ac_l", "toComp": "r_sock", "toPin": "l", "color": "#b45309", "gauge": "2.5 мм² (14 AWG)" },
        { "id": "rw16", "fromComp": "r_inv", "fromPin": "ac_n", "toComp": "r_sock", "toPin": "n", "color": "#3b82f6", "gauge": "2.5 мм² (14 AWG)" },
        { "id": "rw17", "fromComp": "r_inv", "fromPin": "ac_pe", "toComp": "r_sock", "toPin": "pe", "color": "#22c55e", "gauge": "2.5 мм² (14 AWG)" },
        { "id": "w_1795643709939_128", "fromComp": "r_bat", "fromPin": "pos", "toComp": "r_btn", "toPin": "in", "color": "#ef4444", "gauge": "2.5 мм² (14 AWG)" },
        { "id": "w_1795643716332_369", "fromComp": "r_bms", "fromPin": "p_minus", "toComp": "r_relay", "toPin": "coil_neg", "color": "#334155", "gauge": "2.5 мм² (14 AWG)" },
        { "id": "w_1795643723835_988", "fromComp": "r_bms", "fromPin": "p_minus", "toComp": "r_inv", "toPin": "dc_neg", "color": "#334155", "gauge": "16 мм² (6 AWG)" },
        { "id": "w_1795643743130_17", "fromComp": "r_fan1", "fromPin": "neg", "toComp": "r_bms", "toPin": "p_minus", "color": "#334155", "gauge": "2.5 мм² (14 AWG)" },
        { "id": "w_1795643749079_718", "fromComp": "r_fan2", "fromPin": "neg", "toComp": "r_bms", "toPin": "p_minus", "color": "#334155", "gauge": "2.5 мм² (14 AWG)" },
        { "id": "w_1795643796185_110", "fromComp": "r_inv", "fromPin": "lcd_bus", "toComp": "comp_1795643785818_943", "toPin": "lcd_in", "color": "#f59e0b", "gauge": "0.5 мм² (сигнал)" },
        { "id": "w_1795643864042_459", "fromComp": "r_inv", "fromPin": "ac_l", "toComp": "comp_1795643857941_298", "toPin": "l", "color": "#b45309", "gauge": "2.5 мм² (14 AWG)" },
        { "id": "w_1795643869760_827", "fromComp": "r_inv", "fromPin": "ac_n", "toComp": "comp_1795643857941_298", "toPin": "n", "color": "#3b82f6", "gauge": "2.5 мм² (14 AWG)" },
        { "id": "w_1795643887002_505", "fromComp": "r_inv", "fromPin": "ac_pe", "toComp": "comp_1795643857941_298", "toPin": "pe", "color": "#22c55e", "gauge": "2.5 мм² (14 AWG)" },
        { "id": "w_1795643992872_622", "fromComp": "comp_1795643985290_198", "fromPin": "pos", "toComp": "r_bat", "toPin": "pos", "color": "#ef4444", "gauge": "2.5 мм² (14 AWG)" },
        { "id": "w_1795644006474_745", "fromComp": "comp_1795643985290_198", "fromPin": "neg", "toComp": "r_bms", "toPin": "p_minus", "color": "#334155", "gauge": "2.5 мм² (14 AWG)" },
        { "id": "w_1795644094244_306", "fromComp": "r_bat", "fromPin": "pos", "toComp": "comp_1795644072304_579", "toPin": "in", "color": "#ef4444", "gauge": "2.5 мм² (14 AWG)" },
        { "id": "w_1795644191654_629", "fromComp": "comp_1795644072304_579", "fromPin": "out", "toComp": "comp_1795644183417_75", "toPin": "in", "color": "#ef4444", "gauge": "2.5 мм² (14 AWG)" },
        { "id": "w_1795644205003_139", "fromComp": "comp_1795644017679_688", "fromPin": "in_pos", "toComp": "comp_1795644183417_75", "toPin": "out", "color": "#ef4444", "gauge": "2.5 мм² (14 AWG)" },
        { "id": "w_1795644217702_106", "fromComp": "r_bms", "fromPin": "p_minus", "toComp": "comp_1795644017679_688", "toPin": "in_neg", "color": "#334155", "gauge": "2.5 мм² (14 AWG)" },
        { "id": "w_1795644260426_775", "fromComp": "comp_1795644017679_688", "fromPin": "in_neg", "toComp": "comp_1795644248641_378", "toPin": "in_neg", "color": "#334155", "gauge": "2.5 мм² (14 AWG)" },
        { "id": "w_1795644280788_213", "fromComp": "comp_1795644248641_378", "fromPin": "in_pos", "toComp": "comp_1795644183417_75", "toPin": "out", "color": "#ef4444", "gauge": "2.5 мм² (14 AWG)" },
        { "id": "w_1795644285490_796", "fromComp": "comp_1795644248641_378", "fromPin": "out_pos", "toComp": "comp_1795644230258_489", "toPin": "pos", "color": "#ef4444", "gauge": "2.5 мм² (14 AWG)" },
        { "id": "w_1795644291414_63", "fromComp": "comp_1795644248641_378", "fromPin": "out_neg", "toComp": "comp_1795644230258_489", "toPin": "neg", "color": "#334155", "gauge": "2.5 мм² (14 AWG)" },
        { "id": "w_1795644381028_935", "fromComp": "r_bat", "fromPin": "pos", "toComp": "r_inv", "toPin": "dc_pos", "color": "#ef4444", "gauge": "16 мм² (6 AWG)" }
      ],
      "notes": [
        { "id": "note_1795644717363", "x": 560, "y": -140, "text": "спросить, нужен ли резистор на usb" },
        { "id": "note_1795644753260", "x": 840, "y": -360, "text": "Спросить нужна ли понижайка на прикуриватель" },
        { "id": "note_1795644787042", "x": 660, "y": 560, "text": "спросить про реле с рам разъемом" }
      ]
    };
  }

  if (presetId === 'power-station-24v') {
    return {
      components: [
        {
          id: 'c_bat',
          type: 'battery-24v',
          name: 'АКБ 24V (8S LiFePO4)',
          voltage: '25.6V DC',
          spec: '8S 100Ah (2560 Wh)',
          x: 60, y: 120, rotation: 0
        },
        {
          id: 'c_charge',
          type: 'charge-port-xt60',
          name: 'Порт зарядки XT60',
          voltage: '29.2V DC',
          spec: 'Вход от ЗУ (до 20A)',
          x: 60, y: 340, rotation: 0
        },
        {
          id: 'c_bms',
          type: 'bms-board',
          name: 'Плата BMS 8S 100A',
          voltage: '24V DC',
          spec: 'Защита и балансировка',
          x: 280, y: 280, rotation: 0
        },
        {
          id: 'c_fuse',
          type: 'fuse-anl',
          name: 'Предохранитель ANL',
          voltage: 'до 58V DC',
          spec: '80A (Защита от КЗ)',
          x: 300, y: 100, rotation: 0
        },
        {
          id: 'c_mainsw',
          type: 'main-switch-dc',
          name: 'Главный рубильник',
          voltage: 'до 48V DC',
          spec: 'Автомат 100A DC',
          x: 500, y: 100, rotation: 0
        },
        {
          id: 'c_shunt',
          type: 'shunt-coulomb',
          name: 'Кулонометр + Шунт',
          voltage: '8-80V DC',
          spec: 'TK15 / TF03 100A',
          x: 500, y: 280, rotation: 0
        },
        {
          id: 'c_bus_pos',
          type: 'busbar-pos',
          name: 'Шина ПЛЮС (+24V)',
          voltage: '24V DC',
          spec: 'Медная шина M6 150A',
          x: 740, y: 100, rotation: 0
        },
        {
          id: 'c_bus_neg',
          type: 'busbar-neg',
          name: 'Шина МИНУС (-24V)',
          voltage: '24V DC',
          spec: 'Медная шина M6 150A',
          x: 740, y: 290, rotation: 0
        },
        {
          id: 'c_rem',
          type: 'remote-button',
          name: 'Кнопка Инвертора',
          voltage: 'Сигнал',
          spec: 'Выносная на корпус',
          x: 740, y: 10, rotation: 0
        },
        {
          id: 'c_inv',
          type: 'inverter-24-220',
          name: 'Инвертор 24V → 220V',
          voltage: '24V → 220V AC',
          spec: '1500W Чистый синус',
          x: 980, y: 50, rotation: 0
        },
        {
          id: 'c_ac_brk',
          type: 'breaker-ac-220',
          name: 'Автомат 220V (2P)',
          voltage: '220V AC',
          spec: 'C10 (10A)',
          x: 1250, y: 50, rotation: 0
        },
        {
          id: 'c_sock220',
          type: 'socket-220v',
          name: 'Розетка 220V Евро',
          voltage: '220V AC',
          spec: '16A с заземлением',
          x: 1470, y: 50, rotation: 0
        },
        {
          id: 'c_sw_usb',
          type: 'rocker-switch',
          name: 'Кнопка USB',
          voltage: '24V DC',
          spec: 'KCD4 с подсветкой',
          x: 980, y: 240, rotation: 0
        },
        {
          id: 'c_usb',
          type: 'usb-qc-pd',
          name: 'USB-C PD + QC3.0',
          voltage: '12-24V DC',
          spec: 'Быстрая зарядка 65W',
          x: 1230, y: 240, rotation: 0
        },
        {
          id: 'c_sw_12v',
          type: 'rocker-switch',
          name: 'Кнопка 12V',
          voltage: '24V DC',
          spec: 'KCD4 с подсветкой',
          x: 980, y: 390, rotation: 0
        },
        {
          id: 'c_dcdc',
          type: 'dcdc-24-12',
          name: 'DC-DC 24V → 12V',
          voltage: '24V → 12V',
          spec: 'Понижайка 20A (240W)',
          x: 1200, y: 390, rotation: 0
        },
        {
          id: 'c_car12',
          type: 'car-socket-12v',
          name: 'Прикуриватель 12V',
          voltage: '12V DC',
          spec: 'Гнездо 15A',
          x: 1460, y: 390, rotation: 0
        }
      ],
      wires: [
        // Главный плюс: АКБ -> Предохранитель -> Рубильник -> Шина +
        { id: 'w1', fromComp: 'c_bat', fromPin: 'pos', toComp: 'c_fuse', toPin: 'in', color: '#ef4444', gauge: '16 мм² (6 AWG)' },
        { id: 'w2', fromComp: 'c_fuse', fromPin: 'out', toComp: 'c_mainsw', toPin: 'in', color: '#ef4444', gauge: '16 мм² (6 AWG)' },
        { id: 'w3', fromComp: 'c_mainsw', fromPin: 'out', toComp: 'c_bus_pos', toPin: 'in', color: '#ef4444', gauge: '16 мм² (6 AWG)' },
        // Главный минус: АКБ -> BMS B- -> BMS P- -> Шунт -> Шина -
        { id: 'w4', fromComp: 'c_bat', fromPin: 'neg', toComp: 'c_bms', toPin: 'b_minus', color: '#1e293b', gauge: '16 мм² (6 AWG)' },
        { id: 'w5', fromComp: 'c_bms', fromPin: 'p_minus', toComp: 'c_shunt', toPin: 'b_minus', color: '#1e293b', gauge: '16 мм² (6 AWG)' },
        { id: 'w6', fromComp: 'c_shunt', fromPin: 'p_minus', toComp: 'c_bus_neg', toPin: 'in', color: '#1e293b', gauge: '16 мм² (6 AWG)' },
        // Питание кулонометра
        { id: 'w7', fromComp: 'c_fuse', fromPin: 'out', toComp: 'c_shunt', toPin: 'sense_pos', color: '#f59e0b', gauge: '0.5 мм² (сигнал)' },
        // Зарядный порт
        { id: 'w8', fromComp: 'c_charge', fromPin: 'pos', toComp: 'c_fuse', toPin: 'in', color: '#ef4444', gauge: '4 мм² (12 AWG)' },
        { id: 'w9', fromComp: 'c_charge', fromPin: 'neg', toComp: 'c_bms', toPin: 'c_minus', color: '#1e293b', gauge: '4 мм² (12 AWG)' },
        // Инвертор 24->220В
        { id: 'w10', fromComp: 'c_bus_pos', fromPin: 'out1', toComp: 'c_inv', toPin: 'dc_pos', color: '#ef4444', gauge: '16 мм² (6 AWG)' },
        { id: 'w11', fromComp: 'c_bus_neg', fromPin: 'out1', toComp: 'c_inv', toPin: 'dc_neg', color: '#1e293b', gauge: '16 мм² (6 AWG)' },
        { id: 'w12', fromComp: 'c_rem', fromPin: 'sig', toComp: 'c_inv', toPin: 'rem_sw', color: '#a855f7', gauge: '0.5 мм² (сигнал)' },
        // Выход 220В на розетку через автомат
        { id: 'w13', fromComp: 'c_inv', fromPin: 'ac_l', toComp: 'c_ac_brk', toPin: 'in_l', color: '#b45309', gauge: '2.5 мм² (14 AWG)' },
        { id: 'w14', fromComp: 'c_inv', fromPin: 'ac_n', toComp: 'c_ac_brk', toPin: 'in_n', color: '#3b82f6', gauge: '2.5 мм² (14 AWG)' },
        { id: 'w15', fromComp: 'c_ac_brk', fromPin: 'out_l', toComp: 'c_sock220', toPin: 'l', color: '#b45309', gauge: '2.5 мм² (14 AWG)' },
        { id: 'w16', fromComp: 'c_ac_brk', fromPin: 'out_n', toComp: 'c_sock220', toPin: 'n', color: '#3b82f6', gauge: '2.5 мм² (14 AWG)' },
        { id: 'w17', fromComp: 'c_inv', fromPin: 'ac_pe', toComp: 'c_sock220', toPin: 'pe', color: '#22c55e', gauge: '2.5 мм² (14 AWG)' },
        // Контур USB через кнопку
        { id: 'w18', fromComp: 'c_bus_pos', fromPin: 'out2', toComp: 'c_sw_usb', toPin: 'in', color: '#ef4444', gauge: '2.5 мм² (14 AWG)' },
        { id: 'w19', fromComp: 'c_bus_neg', fromPin: 'out2', toComp: 'c_sw_usb', toPin: 'gnd', color: '#1e293b', gauge: '0.5 мм² (сигнал)' },
        { id: 'w20', fromComp: 'c_sw_usb', fromPin: 'out', toComp: 'c_usb', toPin: 'in_pos', color: '#ef4444', gauge: '2.5 мм² (14 AWG)' },
        { id: 'w21', fromComp: 'c_bus_neg', fromPin: 'out2', toComp: 'c_usb', toPin: 'in_neg', color: '#1e293b', gauge: '2.5 мм² (14 AWG)' },
        // Контур 12В через кнопку и понижайку DC-DC
        { id: 'w22', fromComp: 'c_bus_pos', fromPin: 'out3', toComp: 'c_sw_12v', toPin: 'in', color: '#ef4444', gauge: '4 мм² (12 AWG)' },
        { id: 'w23', fromComp: 'c_bus_neg', fromPin: 'out3', toComp: 'c_sw_12v', toPin: 'gnd', color: '#1e293b', gauge: '0.5 мм² (сигнал)' },
        { id: 'w24', fromComp: 'c_sw_12v', fromPin: 'out', toComp: 'c_dcdc', toPin: 'in_pos', color: '#ef4444', gauge: '4 мм² (12 AWG)' },
        { id: 'w25', fromComp: 'c_bus_neg', fromPin: 'out3', toComp: 'c_dcdc', toPin: 'in_neg', color: '#1e293b', gauge: '4 мм² (12 AWG)' },
        { id: 'w26', fromComp: 'c_dcdc', fromPin: 'out_pos', toComp: 'c_car12', toPin: 'pos', color: '#f59e0b', gauge: '2.5 мм² (14 AWG)' },
        { id: 'w27', fromComp: 'c_dcdc', fromPin: 'out_neg', toComp: 'c_car12', toPin: 'neg', color: '#1e293b', gauge: '2.5 мм² (14 AWG)' }
      ],
      notes: [
        { id: 'n1', x: 60, y: 20, text: '🔋 СБОРКА ЭЛЕКТРОСТАНЦИИ 24В → 220В + USB + 12В (Готовый шаблон)' },
        { id: 'n2', x: 280, y: 420, text: '💡 Совет: Предохранитель ANL 80A ставьте вплотную к плюсу АКБ!' },
        { id: 'n3', x: 1200, y: 525, text: '💡 Для мощных USB проверьте, держит ли плата вход 29.2В при заряде!' }
      ]
    };
  }

  if (presetId === 'relay-2pin-inv-fans') {
    return {
      components: [
        {
          id: 'r_bat',
          type: 'battery-24v',
          name: 'АКБ 24V (8S LiFePO4)',
          voltage: '25.6V DC',
          spec: '8S 100Ah',
          x: 60, y: 180, rotation: 0
        },
        {
          id: 'r_fuse',
          type: 'fuse-anl',
          name: 'Предохранитель ANL',
          voltage: 'до 58V DC',
          spec: '80A',
          x: 290, y: 100, rotation: 0
        },
        {
          id: 'r_bms',
          type: 'bms-symmetrical',
          name: 'BMS (Симметричная)',
          voltage: '24V DC',
          spec: '8S 100A (Общий порт P-)',
          x: 290, y: 270, rotation: 0
        },
        {
          id: 'r_bus_pos',
          type: 'busbar-pos',
          name: 'Шина ПЛЮС (+24V)',
          voltage: '24V DC',
          spec: 'Медная шина M6',
          x: 510, y: 70, rotation: 0
        },
        {
          id: 'r_bus_neg',
          type: 'busbar-neg',
          name: 'Шина МИНУС (-24V)',
          voltage: '24V DC',
          spec: 'Медная шина M6',
          x: 510, y: 260, rotation: 0
        },
        {
          id: 'r_btn',
          type: 'toggle-switch',
          name: 'Обычная кнопка (2-pin)',
          voltage: '24V DC',
          spec: '2 контакта (Вкл/Выкл)',
          x: 720, y: 180, rotation: 0
        },
        {
          id: 'r_relay',
          type: 'relay-24v-dry',
          name: 'Реле 24V (Автореле)',
          voltage: '24V DC',
          spec: '85/86 катушка, 30/87 на REM',
          x: 710, y: 310, rotation: 0
        },
        {
          id: 'r_inv',
          type: 'inverter-24-220',
          name: 'Инвертор 24V → 220V',
          voltage: '24V → 220V AC',
          spec: '1500W (Подкл. напрямую)',
          x: 990, y: 40, rotation: 0
        },
        {
          id: 'r_sock',
          type: 'socket-220v',
          name: 'Розетка 220V Евро',
          voltage: '220V AC',
          spec: '16A Schuko',
          x: 1270, y: 55, rotation: 0
        },
        {
          id: 'r_fan1',
          type: 'cooling-fan',
          name: 'Вентилятор 1 (24V)',
          voltage: '24V DC',
          spec: '80x80mm 24V 0.2A',
          x: 1010, y: 250, rotation: 0
        },
        {
          id: 'r_fan2',
          type: 'cooling-fan',
          name: 'Вентилятор 2 (24V)',
          voltage: '24V DC',
          spec: '80x80mm 24V 0.2A',
          x: 1010, y: 370, rotation: 0
        }
      ],
      wires: [
        // Главный плюс к инвертору без рубильника
        { id: 'rw1', fromComp: 'r_bat', fromPin: 'pos', toComp: 'r_fuse', toPin: 'in', color: '#ef4444', gauge: '16 мм² (6 AWG)' },
        { id: 'rw2', fromComp: 'r_fuse', fromPin: 'out', toComp: 'r_bus_pos', toPin: 'in', color: '#ef4444', gauge: '16 мм² (6 AWG)' },
        { id: 'rw3', fromComp: 'r_bus_pos', fromPin: 'out1', toComp: 'r_inv', toPin: 'dc_pos', color: '#ef4444', gauge: '16 мм² (6 AWG)' },
        // Главный минус через симметричную BMS
        { id: 'rw4', fromComp: 'r_bat', fromPin: 'neg', toComp: 'r_bms', toPin: 'b_minus', color: '#1e293b', gauge: '16 мм² (6 AWG)' },
        { id: 'rw5', fromComp: 'r_bms', fromPin: 'p_minus', toComp: 'r_bus_neg', toPin: 'in', color: '#1e293b', gauge: '16 мм² (6 AWG)' },
        { id: 'rw6', fromComp: 'r_bus_neg', fromPin: 'out1', toComp: 'r_inv', toPin: 'dc_neg', color: '#1e293b', gauge: '16 мм² (6 AWG)' },
        // Обычная 2-пиновая кнопка: подает +24V на кулеры И на катушку реле (85)
        { id: 'rw7', fromComp: 'r_bus_pos', fromPin: 'out2', toComp: 'r_btn', toPin: 'in', color: '#ef4444', gauge: '0.75 мм² (18 AWG)' },
        { id: 'rw8', fromComp: 'r_btn', fromPin: 'out', toComp: 'r_fan1', toPin: 'pos', color: '#ef4444', gauge: '0.75 мм² (18 AWG)' },
        { id: 'rw9', fromComp: 'r_btn', fromPin: 'out', toComp: 'r_fan2', toPin: 'pos', color: '#ef4444', gauge: '0.75 мм² (18 AWG)' },
        { id: 'rw10', fromComp: 'r_btn', fromPin: 'out', toComp: 'r_relay', toPin: 'coil_pos', color: '#ef4444', gauge: '0.5 мм² (сигнал)' },
        // Минус на кулеры и катушку реле (86)
        { id: 'rw11', fromComp: 'r_bus_neg', fromPin: 'out2', toComp: 'r_fan1', toPin: 'neg', color: '#1e293b', gauge: '0.75 мм² (18 AWG)' },
        { id: 'rw12', fromComp: 'r_bus_neg', fromPin: 'out2', toComp: 'r_fan2', toPin: 'neg', color: '#1e293b', gauge: '0.75 мм² (18 AWG)' },
        { id: 'rw13', fromComp: 'r_bus_neg', fromPin: 'out3', toComp: 'r_relay', toPin: 'coil_neg', color: '#1e293b', gauge: '0.5 мм² (сигнал)' },
        // Изолированный сухой контакт реле (87) -> REM инвертора
        { id: 'rw14', fromComp: 'r_relay', fromPin: 'no', toComp: 'r_inv', toPin: 'rem_sw', color: '#a855f7', gauge: '0.5 мм² (сигнал)' },
        // Выход 220V
        { id: 'rw15', fromComp: 'r_inv', fromPin: 'ac_l', toComp: 'r_sock', toPin: 'l', color: '#b45309', gauge: '2.5 мм² (14 AWG)' },
        { id: 'rw16', fromComp: 'r_inv', fromPin: 'ac_n', toComp: 'r_sock', toPin: 'n', color: '#3b82f6', gauge: '2.5 мм² (14 AWG)' },
        { id: 'rw17', fromComp: 'r_inv', fromPin: 'ac_pe', toComp: 'r_sock', toPin: 'pe', color: '#22c55e', gauge: '2.5 мм² (14 AWG)' }
      ],
      notes: [
        { id: 'rn1', x: 60, y: 15, text: '🧲 ОБЫЧНАЯ 2-ПИНОВАЯ КНОПКА + РЕЛЕ 24V (СУХОЙ КОНТАКТ)\nКнопка включает вентиляторы 24V и катушку реле (85-86), а контакты реле (30-87) безопасно замыкают REM инвертора!' }
      ]
    };
  }

  if (presetId === 'one-button-inv-fans') {
    return {
      components: [
        {
          id: 'ob_bat',
          type: 'battery-24v',
          name: 'АКБ 24V (8S LiFePO4)',
          voltage: '25.6V DC',
          spec: '8S 100Ah',
          x: 60, y: 180, rotation: 0
        },
        {
          id: 'ob_fuse',
          type: 'fuse-anl',
          name: 'Предохранитель ANL',
          voltage: 'до 58V DC',
          spec: '80A',
          x: 290, y: 100, rotation: 0
        },
        {
          id: 'ob_bms',
          type: 'bms-symmetrical',
          name: 'BMS (Симметричная)',
          voltage: '24V DC',
          spec: '8S 100A (Общий порт P-)',
          x: 290, y: 270, rotation: 0
        },
        {
          id: 'ob_bus_pos',
          type: 'busbar-pos',
          name: 'Шина ПЛЮС (+24V)',
          voltage: '24V DC',
          spec: 'Медная шина M6',
          x: 520, y: 80, rotation: 0
        },
        {
          id: 'ob_bus_neg',
          type: 'busbar-neg',
          name: 'Шина МИНУС (-24V)',
          voltage: '24V DC',
          spec: 'Медная шина M6',
          x: 520, y: 260, rotation: 0
        },
        {
          id: 'ob_btn',
          type: 'dpst-switch',
          name: 'Одна кнопка (2 контура)',
          voltage: '24V DC / REM',
          spec: 'Двойная DPST (4 контакта)',
          x: 730, y: 240, rotation: 0
        },
        {
          id: 'ob_inv',
          type: 'inverter-24-220',
          name: 'Инвертор 24V → 220V',
          voltage: '24V → 220V AC',
          spec: '1500W (Подкл. напрямую)',
          x: 970, y: 50, rotation: 0
        },
        {
          id: 'ob_sock',
          type: 'socket-220v',
          name: 'Розетка 220V Евро',
          voltage: '220V AC',
          spec: '16A Schuko',
          x: 1250, y: 65, rotation: 0
        },
        {
          id: 'ob_fan1',
          type: 'cooling-fan',
          name: 'Вентилятор 1 (24V)',
          voltage: '24V DC',
          spec: '80x80mm 24V 0.2A',
          x: 1000, y: 250, rotation: 0
        },
        {
          id: 'ob_fan2',
          type: 'cooling-fan',
          name: 'Вентилятор 2 (24V)',
          voltage: '24V DC',
          spec: '80x80mm 24V 0.2A',
          x: 1000, y: 370, rotation: 0
        }
      ],
      wires: [
        // Главный плюс к инвертору без рубильника (через предохранитель и шину)
        { id: 'ow1', fromComp: 'ob_bat', fromPin: 'pos', toComp: 'ob_fuse', toPin: 'in', color: '#ef4444', gauge: '16 мм² (6 AWG)' },
        { id: 'ow2', fromComp: 'ob_fuse', fromPin: 'out', toComp: 'ob_bus_pos', toPin: 'in', color: '#ef4444', gauge: '16 мм² (6 AWG)' },
        { id: 'ow3', fromComp: 'ob_bus_pos', fromPin: 'out1', toComp: 'ob_inv', toPin: 'dc_pos', color: '#ef4444', gauge: '16 мм² (6 AWG)' },
        // Главный минус через симметричную BMS и шину
        { id: 'ow4', fromComp: 'ob_bat', fromPin: 'neg', toComp: 'ob_bms', toPin: 'b_minus', color: '#1e293b', gauge: '16 мм² (6 AWG)' },
        { id: 'ow5', fromComp: 'ob_bms', fromPin: 'p_minus', toComp: 'ob_bus_neg', toPin: 'in', color: '#1e293b', gauge: '16 мм² (6 AWG)' },
        { id: 'ow6', fromComp: 'ob_bus_neg', fromPin: 'out1', toComp: 'ob_inv', toPin: 'dc_neg', color: '#1e293b', gauge: '16 мм² (6 AWG)' },
        // Контур 1 кнопки: +24V от шины -> на оба вентилятора (питание от АКБ!)
        { id: 'ow7', fromComp: 'ob_bus_pos', fromPin: 'out2', toComp: 'ob_btn', toPin: 'in1', color: '#ef4444', gauge: '0.75 мм² (18 AWG)' },
        { id: 'ow8', fromComp: 'ob_btn', fromPin: 'out1', toComp: 'ob_fan1', toPin: 'pos', color: '#ef4444', gauge: '0.75 мм² (18 AWG)' },
        { id: 'ow9', fromComp: 'ob_btn', fromPin: 'out1', toComp: 'ob_fan2', toPin: 'pos', color: '#ef4444', gauge: '0.75 мм² (18 AWG)' },
        // Минус на вентиляторы
        { id: 'ow10', fromComp: 'ob_bus_neg', fromPin: 'out2', toComp: 'ob_fan1', toPin: 'neg', color: '#1e293b', gauge: '0.75 мм² (18 AWG)' },
        { id: 'ow11', fromComp: 'ob_bus_neg', fromPin: 'out2', toComp: 'ob_fan2', toPin: 'neg', color: '#1e293b', gauge: '0.75 мм² (18 AWG)' },
        // Контур 2 кнопки: изолированный сигнал REM на запуск инвертора
        { id: 'ow12', fromComp: 'ob_btn', fromPin: 'out2', toComp: 'ob_inv', toPin: 'rem_sw', color: '#a855f7', gauge: '0.5 мм² (сигнал)' },
        // Выход 220V
        { id: 'ow13', fromComp: 'ob_inv', fromPin: 'ac_l', toComp: 'ob_sock', toPin: 'l', color: '#b45309', gauge: '2.5 мм² (14 AWG)' },
        { id: 'ow14', fromComp: 'ob_inv', fromPin: 'ac_n', toComp: 'ob_sock', toPin: 'n', color: '#3b82f6', gauge: '2.5 мм² (14 AWG)' },
        { id: 'ow15', fromComp: 'ob_inv', fromPin: 'ac_pe', toComp: 'ob_sock', toPin: 'pe', color: '#22c55e', gauge: '2.5 мм² (14 AWG)' }
      ],
      notes: [
        { id: 'on1', x: 60, y: 15, text: '🔘 БЕЗ РУБИЛЬНИКА: ОДНА КНОПКА ВКЛЮЧАЕТ ИНВЕРТОР И ВЕНТИЛЯТОРЫ\nИспользуй двойную кнопку (DPST, 2 независимые группы контактов):' },
        { id: 'on2', x: 520, y: 410, text: '💡 Почему так: 1-й контур кнопки подаёт +24V с АКБ на кулеры,\nа 2-й контур изолированно замыкает кнопку (REM) инвертора!' }
      ]
    };
  }

  if (presetId === 'precharge-softstart') {
    return {
      components: [
        {
          id: 'p_bat',
          type: 'battery-24v',
          name: 'АКБ 24V (8S LiFePO4)',
          voltage: '25.6V DC',
          spec: '8S 100Ah',
          x: 60, y: 200, rotation: 0
        },
        {
          id: 'p_bms',
          type: 'bms-symmetrical',
          name: 'BMS (Симметричная)',
          voltage: '24V DC',
          spec: '8S 100A (Общий порт P-)',
          x: 320, y: 290, rotation: 0
        },
        {
          id: 'p_fuse',
          type: 'fuse-anl',
          name: 'Предохранитель ANL',
          voltage: 'до 58V DC',
          spec: '80A',
          x: 320, y: 140, rotation: 0
        },
        {
          id: 'p_mainsw',
          type: 'main-switch-dc',
          name: 'Главный рубильник',
          voltage: 'до 48V DC',
          spec: '100A (Основная цепь)',
          x: 560, y: 140, rotation: 0
        },
        {
          id: 'p_btn',
          type: 'toggle-switch',
          name: 'Кнопка предзаряда',
          voltage: '24V DC',
          spec: 'Маленькая (2-5A, без фикс.)',
          x: 490, y: 20, rotation: 0
        },
        {
          id: 'p_res',
          type: 'power-resistor-rx24',
          name: 'Силовой резистор (RX24)',
          voltage: 'до 100V',
          spec: '20 Ом 25W (Ток ~1.2A)',
          x: 700, y: 20, rotation: 0
        },
        {
          id: 'p_inv',
          type: 'inverter-24-220',
          name: 'Инвертор 24V → 220V',
          voltage: '24V → 220V AC',
          spec: '1500W Чистый синус',
          x: 940, y: 140, rotation: 0
        },
        {
          id: 'p_sock',
          type: 'socket-220v',
          name: 'Розетка 220V Евро',
          voltage: '220V AC',
          spec: '16A Schuko',
          x: 1220, y: 155, rotation: 0
        }
      ],
      wires: [
        // Основная толстая плюсовая линия
        { id: 'pw1', fromComp: 'p_bat', fromPin: 'pos', toComp: 'p_fuse', toPin: 'in', color: '#ef4444', gauge: '16 мм² (6 AWG)' },
        { id: 'pw2', fromComp: 'p_fuse', fromPin: 'out', toComp: 'p_mainsw', toPin: 'in', color: '#ef4444', gauge: '16 мм² (6 AWG)' },
        { id: 'pw3', fromComp: 'p_mainsw', fromPin: 'out', toComp: 'p_inv', toPin: 'dc_pos', color: '#ef4444', gauge: '16 мм² (6 AWG)' },
        // Обходная тонкая цепь предзаряда (Кнопка + Силовой резистор)
        { id: 'pw4', fromComp: 'p_fuse', fromPin: 'out', toComp: 'p_btn', toPin: 'in', color: '#f59e0b', gauge: '0.75 мм² (18 AWG)' },
        { id: 'pw5', fromComp: 'p_btn', fromPin: 'out', toComp: 'p_res', toPin: 'in', color: '#f59e0b', gauge: '0.75 мм² (18 AWG)' },
        { id: 'pw6', fromComp: 'p_res', fromPin: 'out', toComp: 'p_inv', toPin: 'dc_pos', color: '#f59e0b', gauge: '0.75 мм² (18 AWG)' },
        // Минус через симметричную BMS
        { id: 'pw7', fromComp: 'p_bat', fromPin: 'neg', toComp: 'p_bms', toPin: 'b_minus', color: '#1e293b', gauge: '16 мм² (6 AWG)' },
        { id: 'pw8', fromComp: 'p_bms', fromPin: 'p_minus', toComp: 'p_inv', toPin: 'dc_neg', color: '#1e293b', gauge: '16 мм² (6 AWG)' },
        // Выход 220V
        { id: 'pw9', fromComp: 'p_inv', fromPin: 'ac_l', toComp: 'p_sock', toPin: 'l', color: '#b45309', gauge: '2.5 мм² (14 AWG)' },
        { id: 'pw10', fromComp: 'p_inv', fromPin: 'ac_n', toComp: 'p_sock', toPin: 'n', color: '#3b82f6', gauge: '2.5 мм² (14 AWG)' },
        { id: 'pw11', fromComp: 'p_inv', fromPin: 'ac_pe', toComp: 'p_sock', toPin: 'pe', color: '#22c55e', gauge: '2.5 мм² (14 AWG)' }
      ],
      notes: [
        { id: 'pn1', x: 60, y: 20, text: '⚡ СХЕМА ПЛАВНОГО ПУСКА ИНВЕРТОРА\nЖёлтая ветка (кнопка + резистор) идёт В ОБХОД главного рубильника!' },
        { id: 'pn2', x: 540, y: 310, text: '📋 Как включать:\n1) Нажми и держи маленькую кнопку 2-3 сек (ток ~1.2A зарядит инвертор).\n2) Отпусти кнопку и включи Главный рубильник — искры не будет!' }
      ]
    };
  }

  if (presetId === 'basic-12v') {
    return {
      components: [
        { id: 'b1', type: 'battery-12v', name: 'АКБ 12V LiFePO4', voltage: '12.8V DC', spec: '12V 50Ah', x: 100, y: 180, rotation: 0 },
        { id: 'b2', type: 'fuse-anl', name: 'Предохранитель 30A', voltage: '12V DC', spec: '30A', x: 340, y: 160, rotation: 0 },
        { id: 'b3', type: 'rocker-switch', name: 'Главная кнопка', voltage: '12V DC', spec: '20A LED', x: 580, y: 160, rotation: 0 },
        { id: 'b4', type: 'usb-qc-pd', name: 'USB Зарядка', voltage: '12V DC', spec: 'PD + QC3.0', x: 840, y: 100, rotation: 0 },
        { id: 'b5', type: 'car-socket-12v', name: 'Прикуриватель 12V', voltage: '12V DC', spec: '15A', x: 840, y: 260, rotation: 0 }
      ],
      wires: [
        { id: 'bw1', fromComp: 'b1', fromPin: 'pos', toComp: 'b2', toPin: 'in', color: '#ef4444', gauge: '4 мм² (12 AWG)' },
        { id: 'bw2', fromComp: 'b2', fromPin: 'out', toComp: 'b3', toPin: 'in', color: '#ef4444', gauge: '4 мм² (12 AWG)' },
        { id: 'bw3', fromComp: 'b1', fromPin: 'neg', toComp: 'b3', toPin: 'gnd', color: '#1e293b', gauge: '0.5 мм² (сигнал)' },
        { id: 'bw4', fromComp: 'b3', fromPin: 'out', toComp: 'b4', toPin: 'in_pos', color: '#ef4444', gauge: '2.5 мм² (14 AWG)' },
        { id: 'bw5', fromComp: 'b1', fromPin: 'neg', toComp: 'b4', toPin: 'in_neg', color: '#1e293b', gauge: '2.5 мм² (14 AWG)' },
        { id: 'bw6', fromComp: 'b3', fromPin: 'out', toComp: 'b5', toPin: 'pos', color: '#ef4444', gauge: '2.5 мм² (14 AWG)' },
        { id: 'bw7', fromComp: 'b1', fromPin: 'neg', toComp: 'b5', toPin: 'neg', color: '#1e293b', gauge: '2.5 мм² (14 AWG)' }
      ],
      notes: [
        { id: 'bn1', x: 100, y: 60, text: '🚗 Простая сборка 12В: АКБ + Защита + Кнопка + USB и Прикуриватель' }
      ]
    };
  }

  return { components: [], wires: [], notes: [] };
}

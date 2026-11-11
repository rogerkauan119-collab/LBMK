import { db, initDatabase } from './db.ts';

export function seedDatabase() {
  initDatabase();

  const userCount = db.prepare('SELECT COUNT(*) as c FROM users').get() as { c: number };
  if (userCount.c > 0) {
    return;
  }

  // 1. Users (Visitante, Aluno/Servidor e Admin + Ranking)
  const insertUser = db.prepare(`
    INSERT INTO users (name, role, email, password, matricula, course, phone, xp, level, badges_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run(
    'Visitante Demo',
    'VISITANTE',
    'visitante@ifes.edu.br',
    'visitante123',
    '',
    'Comunidade Externa',
    '(27) 99900-0001',
    120,
    1,
    JSON.stringify(['Explorador do Lab'])
  );

  insertUser.run(
    'Lucas Almeida',
    'ALUNO',
    'aluno@ifes.edu.br',
    'aluno123',
    '20252BSI0372',
    'Sistemas de Informação (BSI)',
    '(27) 99812-4455',
    1850,
    7,
    JSON.stringify(['Mestre do Filamento', 'Arquiteto de PCI', ' Guardião do Laser', 'Bug Hunter'])
  );

  insertUser.run(
    'Profa. Rosiane Rocha',
    'ADMIN',
    'admin@ifes.edu.br',
    'admin123',
    'SIAPE-104920',
    'Coordenação LabMaker / Automação',
    '(27) 3348-9200',
    5000,
    15,
    JSON.stringify(['Orientadora Chefe', 'Pioneira Maker', 'Mestre CNC', 'Arquiteta de Inovação'])
  );

  insertUser.run(
    'Gabriel Tozatto',
    'ALUNO',
    'gabriel.tozatto@ifes.edu.br',
    'aluno123',
    '20241ECA0112',
    'Engenharia de Controle e Automação',
    '(27) 99711-2233',
    2420,
    9,
    JSON.stringify(['Mestre CNC', 'Automação Nível 9', 'Soldador Ouro'])
  );

  insertUser.run(
    'Marcos Simão',
    'ALUNO',
    'marcos.simao@ifes.edu.br',
    'aluno123',
    '20241ECA0208',
    'Engenharia de Controle e Automação',
    '(27) 99744-5566',
    2190,
    8,
    JSON.stringify(['Arquiteto de PCI', 'Especialista SMD'])
  );

  insertUser.run(
    'Richard Godinez',
    'ALUNO',
    'richard.godinez@ifes.edu.br',
    'aluno123',
    '20242BSI0098',
    'Sistemas de Informação (BSI)',
    '(27) 99655-8899',
    1640,
    6,
    JSON.stringify(['Prototipador Ágil', 'IoT Builder'])
  );

  insertUser.run(
    'Flávio Garcia',
    'ALUNO',
    'flavio.garcia@ifes.edu.br',
    'aluno123',
    '20251MEC0410',
    'Técnico em Mecatrônica',
    '(27) 99522-3311',
    1490,
    6,
    JSON.stringify(['Corte Preciso', 'CAD Designer'])
  );

  // 2. Machines (Recursos Disponíveis exatamente como na referência)
  const insertMachine = db.prepare(`
    INSERT INTO machines (name, code, category, short_desc, specs, status, image_url, icon_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertMachine.run(
    "FABRICAÇÃO DE PCI'S",
    'CNC-PCB-01',
    'Eletrônica & Prototipagem',
    'Produção, fresagem e montagem de placas de circuito impresso para projetos.',
    'Fresadora Protomat / Isolamento de trilhas 0.2mm / Perfuração automática / Estação SMD e Reflow',
    'DISPONIVEL',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    'cpu'
  );

  insertMachine.run(
    'IMPRESSÃO 3D (FDM)',
    'PRN-FDM-02',
    'Manufatura Aditiva',
    'Impressão tridimensional de protótipos funcionais em diferentes filamentos.',
    'Creality K1 Max & Bambu Lab / Volume 300x300x300mm / PLA, PETG, ABS, TPU / Bico 0.4mm High-Flow',
    'DISPONIVEL',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80',
    'printer'
  );

  insertMachine.run(
    'USINAGEM CNC',
    'CNC-ROUTER-03',
    'Manufatura Subtrativa',
    'Usinagem de precisão combinando fresagem e entalhe técnico em madeira, acrílico e polímeros.',
    'Área útil 600x900mm / Spindle 2.2kW refrigerado a água / Controle GRBL/Mach3 / Precisão 0.05mm',
    'EM_USO',
    'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=900&q=80',
    'cog'
  );

  insertMachine.run(
    'IMPRESSÃO 3D (SLA RESINA)',
    'PRN-SLA-04',
    'Manufatura Aditiva',
    'Impressão em resina UV de altíssima resolução para detalhes submilimétricos e encapsulamentos.',
    'Tela Mono 8K / Camadas de 0.02mm / Wash & Cure dedicado / Resinas Standard, Tough e Flex',
    'DISPONIVEL',
    'https://images.unsplash.com/photo-1631541909061-71e349d1f203?auto=format&fit=crop&w=900&q=80',
    'droplet'
  );

  insertMachine.run(
    'CORTE & GRAVAÇÃO LASER CO2',
    'LASER-CO2-05',
    'Corte a Laser',
    'Corte vetorial preciso e gravação em acrílico, MDF, couro e materiais compostos.',
    'Tubo Laser CO2 100W Ruida / Área 1000x800mm / Software RDWorks V8 / Exaustão e Chiller CW-5000',
    'DISPONIVEL',
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=900&q=80',
    'flame'
  );

  insertMachine.run(
    'BANCADA ARDUINO & IOT',
    'ELB-IOT-06',
    'Eletrônica Embarcada',
    'Estação completa com osciloscópio digital, fonte assimétrica, ESP32, Arduino e sensores.',
    'Osciloscópio 4 canais 100MHz / Fonte Dupla 30V 5A / Ferro de solda Hikari + Ar Quente SMD',
    'MANUTENCAO',
    'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=900&q=80',
    'zap'
  );

  // 3. Tasks (Quadro de Tarefas da referência: 12 concluídas, 05 em curso, 08 a fazer -> incluindo os 3 destaques)
  const insertTask = db.prepare(`
    INSERT INTO tasks (title, project_name, status, assignee, priority)
    VALUES (?, ?, ?, ?, ?)
  `);

  // Destaques principais do mockup da referência:
  insertTask.run('Protótipos impressão 3D', 'Robótica & Cases IFES', 'CONCLUIDA', 'Lucas Almeida', 'ALTA');
  insertTask.run('Placa PCI — robô seguidor', 'Equipe Robótica Serra', 'EM_ANDAMENTO', 'Marcos Simão', 'ALTA');
  insertTask.run('Corte a laser — embalagem', 'Kit Didático Maker', 'A_FAZER', 'Flávio Garcia', 'MEDIA');

  // Outras tarefas para compor o quadro colaborativo realista
  insertTask.run('Calibração de mesa aquecida K1 Max', 'Manutenção Preventiva', 'CONCLUIDA', 'Gabriel Tozatto', 'MEDIA');
  insertTask.run('Suporte articulado para câmera de visão', 'Visão Computacional', 'CONCLUIDA', 'Richard Godinez', 'ALTA');
  insertTask.run('Fresagem de chassi em acrílico 5mm', 'Drone Autônomo IFES', 'CONCLUIDA', 'Flávio Garcia', 'ALTA');
  insertTask.run('Soldagem SMD do módulo LoRaWAN', 'Estação Meteorológica', 'EM_ANDAMENTO', 'Lucas Almeida', 'ALTA');
  insertTask.run('Modelagem CAD de engrenagem planetária', 'Braço Robótico 6-DOF', 'EM_ANDAMENTO', 'Gabriel Tozatto', 'MEDIA');
  insertTask.run('Gravação a laser de troféus Hackathon', 'Evento Semana da Ciência', 'A_FAZER', 'Richard Godinez', 'ALTA');
  insertTask.run('Teste de isolamento em placa ponte H', 'Robô Seguidor de Linha', 'A_FAZER', 'Marcos Simão', 'MEDIA');

  // 4. Projects (Galeria de Projetos)
  const insertProject = db.prepare(`
    INSERT INTO projects (title, category, author, description, status, image_url, approved)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertProject.run(
    'Protótipos de Impressão 3D — Braço Biônico',
    'Impressão 3D',
    'Lucas Almeida & Profa. Rosiane Rocha',
    'Desenvolvimento de prótese mecânica de baixo custo impressa em PETG e TPU flexível com atuadores lineares controlados por sinais mioelétricos.',
    'CONCLUIDO',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    1
  );

  insertProject.run(
    'Placa PCI de Robô Seguidor de Linha PID',
    'Fabricação de PCI',
    'Marcos Simão & Gabriel Tozatto',
    'Placa de circuito impresso dupla face fresada no LabMaker com microcontrolador ESP32-S3, matriz de 8 sensores ópticos QRE1113 e driver TB6612FNG.',
    'EM_ANDAMENTO',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    1
  );

  insertProject.run(
    'Corte a Laser de Embalagem & Case Modular IoT',
    'Corte a Laser',
    'Flávio Garcia & Richard Godinez',
    'Estrutura encaixável finger-joint em MDF 3mm e acrílico cristal para kits de robótica educacional distribuídos em escolas públicas da Serra.',
    'CONCLUIDO',
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80',
    1
  );

  insertProject.run(
    'Estação AgroIoT LoRa para Monitoramento de Solo',
    'IoT & Embarcados',
    'Richard Godinez',
    'Cápsula selada impressa em resina SLA com painel solar integrado e PCB customizada para leitura de umidade e pH a longa distância.',
    'CONCLUIDO',
    'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80',
    1
  );

  insertProject.run(
    'Mini CNC Plotter Didática com Motores de Passo',
    'Usinagem CNC',
    'Gabriel Tozatto',
    'Estrutura construída com peças impressas em 3D e guias lineares retificadas para ensino prático de G-Code aos calouros do campus.',
    'CONCLUIDO',
    'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    1
  );

  // 5. Bookings (Agendamentos e horários bloqueados)
  const insertBooking = db.prepare(`
    INSERT INTO bookings (user_id, user_name, machine_id, machine_name, date, time_slot, purpose, terms_accepted, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertBooking.run(2, 'Lucas Almeida', 2, 'IMPRESSÃO 3D (FDM)', '2026-11-12', '14:00 - 16:00', 'Impressão de suporte planetário em PETG', 1, 'APROVADO');
  insertBooking.run(5, 'Marcos Simão', 1, "FABRICAÇÃO DE PCI'S", '2026-11-12', '09:00 - 11:00', 'Fresagem da placa do robô seguidor v2', 1, 'APROVADO');
  insertBooking.run(7, 'Flávio Garcia', 5, 'CORTE & GRAVAÇÃO LASER CO2', '2026-11-13', '10:00 - 12:00', 'Corte de 15 caixas organizadoras em MDF 3mm', 1, 'PENDENTE');
  insertBooking.run(3, 'ADMIN - Manutenção', 6, 'BANCADA ARDUINO & IOT', '2026-11-13', '14:00 - 18:00', 'Aferição dos osciloscópios e reposição de ponteiras', 1, 'BLOQUEADO');

  // 6. Check-ins iniciais (para alimentar relatórios e histórico)
  const insertCheckin = db.prepare(`
    INSERT INTO checkins (user_type, full_name, matricula, course, email, phone, document_id, organization, reason)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertCheckin.run('ALUNO', 'Lucas Almeida', '20252BSI0372', 'Sistemas de Informação', 'aluno@ifes.edu.br', '(27) 99812-4455', '', 'IFES Serra', 'Impressão 3D de case para TCC e soldagem de sensores');
  insertCheckin.run('ALUNO', 'Marcos Simão', '20241ECA0208', 'Eng. Controle e Automação', 'marcos.simao@ifes.edu.br', '(27) 99744-5566', '', 'IFES Serra', 'Usinagem de placa PCI do robô seguidor');
  insertCheckin.run('VISITANTE', ' Mariana Costa', '', '', 'mariana@incubadora.org.br', '(27) 99123-9876', '123.456.789-00', 'Incubadora Tecnológica Serra', 'Visita técnica para parceria de prototipagem');

  // 7. Inventory & Loans
  const insertInventory = db.prepare(`
    INSERT INTO inventory_items (item_name, category, unit, quantity_total, quantity_available, min_threshold, loanable)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertInventory.run('Kit Arduino Uno R3 + Protoboard 830p', 'Embarcados', 'Kit', 15, 11, 4, 1);
  insertInventory.run('Módulo ESP32 Wi-Fi + Bluetooth Dual Core', 'IoT', 'Unidade', 20, 14, 5, 1);
  insertInventory.run('Paquímetro Digital Inox 150mm Mitutoyo', 'Metrologia', 'Unidade', 8, 6, 2, 1);
  insertInventory.run('Multímetro Digital True RMS Minipa', 'Eletrônica', 'Unidade', 10, 8, 3, 1);
  insertInventory.run('Filamento PLA Branco 1.75mm (Rolo 1kg)', 'Insumo 3D', 'Rolo', 12, 3, 5, 0);
  insertInventory.run('Chapa Fenolite Cobreada Dupla Face 15x20cm', 'Insumo PCI', 'Chapa', 30, 7, 10, 0);
  insertInventory.run('Chapa MDF 3mm Corte a Laser (90x60cm)', 'Insumo Laser', 'Chapa', 25, 4, 8, 0);

  const insertLoan = db.prepare(`
    INSERT INTO loan_requests (user_id, user_name, item_id, item_name, quantity, return_date, purpose, policy_accepted, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertLoan.run(2, 'Lucas Almeida', 2, 'Módulo ESP32 Wi-Fi + Bluetooth Dual Core', 2, '2026-11-18', 'Testes de telemetria MQTT em bancada', 1, 'ATIVO');
  insertLoan.run(4, 'Gabriel Tozatto', 3, 'Paquímetro Digital Inox 150mm Mitutoyo', 1, '2026-11-15', 'Medição de tolerância de rolamentos para CNC', 1, 'ATIVO');

  // 8. Restock Requests
  const insertRestock = db.prepare(`
    INSERT INTO restock_requests (user_id, user_name, material_name, category, quantity_needed, urgency, justification, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertRestock.run(2, 'Lucas Almeida', 'Filamento PETG Preto 1.75mm', 'Impressão 3D', '5 rolos de 1kg', 'ALTA', 'Estoque abaixo do mínimo para os projetos integradores do semestre.', 'ABERTO');
  insertRestock.run(5, 'Marcos Simão', 'Fresas Topo V-Bit 0.1mm 30 graus para PCI', 'Usinagem CNC', '10 unidades', 'MEDIA', 'Desgaste natural das ponteiras nas últimas 12 placas confeccionadas.', 'EM_COTACAO');

  // 9. Suggestions
  const insertSuggestion = db.prepare(`
    INSERT INTO suggestions (user_id, user_name, title, category, description, status, admin_reply)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertSuggestion.run(
    2,
    'Lucas Almeida',
    'Criar estufa desumidificadora para filamentos TPU e Nylon',
    'Infraestrutura',
    'Como a umidade na Serra é alta, uma drybox aquecida evitaria bolhas nas impressões técnicas.',
    'APROVADA',
    'Excelente ideia! Já adquirimos os sensores DHT22 e resistências para montarmos a estufa no próprio Lab.'
  );
  insertSuggestion.run(
    6,
    'Richard Godinez',
    'Oficina rápida de KiCad 8 às sextas-feiras',
    'Treinamento',
    'Muitos calouros querem usar a fresadora de PCI mas ainda têm dúvidas para exportar arquivos Gerber.',
    'IMPLEMENTADA',
    'Oficina incluída no calendário oficial do mês!'
  );

  // 10. Quests (MakerLab Quest 8-bits)
  const insertQuest = db.prepare(`
    INSERT INTO quests (title, description, xp_reward, badge_icon, difficulty, category, completed_by_json)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertQuest.run(
    'PRIMEIRA CAMADA PERFEITA',
    'Conclua o tutorial de nivelamento e realize sua primeira impressão 3D FDM sem warping no laboratório.',
    250,
    'printer',
    'INICIANTE',
    'Impressão 3D',
    JSON.stringify(['aluno@ifes.edu.br', 'gabriel.tozatto@ifes.edu.br'])
  );
  insertQuest.run(
    'MESTRE DO GERBER & TRILHAS',
    'Projete uma PCI no KiCad, gere os arquivos Gerber e execute a fresagem completa na CNC de bancada.',
    450,
    'cpu',
    'MAKER',
    'Eletrônica & PCI',
    JSON.stringify(['marcos.simao@ifes.edu.br', 'aluno@ifes.edu.br'])
  );
  insertQuest.run(
    'DOMADOR DE FEIXE LASER',
    'Configure potências de corte e gravação no RDWorks e produza um gabinete encaixável em MDF ou acrílico.',
    350,
    'flame',
    'MAKER',
    'Corte a Laser',
    JSON.stringify(['flavio.garcia@ifes.edu.br'])
  );
  insertQuest.run(
    'GUARDIÃO COLABORATIVO',
    'Auxilie 3 colegas na organização da bancada, registre check-in e conclua 2 tarefas no quadro do laboratório.',
    300,
    'shield',
    'INICIANTE',
    'Comunidade',
    JSON.stringify(['aluno@ifes.edu.br'])
  );
  insertQuest.run(
    'BOSS FINAL: PROJETO INTEGRADOR',
    'Combine impressão 3D + placa PCI própria + corte a laser em um único protótipo funcional documentado.',
    800,
    'trophy',
    'MESTRE',
    'Full Maker',
    JSON.stringify(['gabriel.tozatto@ifes.edu.br'])
  );

  // 11. Tutorials
  const insertTutorial = db.prepare(`
    INSERT INTO tutorials (title, category, duration, level, summary, steps_json)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertTutorial.run(
    'Do STL à Peça: Fatiamento Seguro no OrcaSlicer / Cura',
    'Impressão 3D',
    '25 min',
    'Iniciante',
    'Aprenda a configurar altura de camada, preenchimento gyroid, suportes em árvore e temperaturas para PLA e PETG nas impressoras do LabMaker.',
    JSON.stringify([
      'Importe o arquivo .STL e oriente a face plana sobre a mesa.',
      'Selecione o perfil oficial "IFES LabMaker K1 Max - 0.20mm Standard".',
      'Verifique no preview se há overhangs sem suporte acima de 55°.',
      'Exporte o G-Code e acompanhe os primeiros 3 minutos da 1ª camada.'
    ])
  );

  insertTutorial.run(
    'Exportando Gerber no KiCad para Fresagem de PCI',
    'Fabricação de PCI',
    '40 min',
    'Intermediário',
    'Regras de Design (DRC) com trilhas mínimas de 0.4mm, espaçamento de isolamento e geração de furação Excellon.',
    JSON.stringify([
      'Configure Design Rules: largura mínima de trilha 0.4mm e clearance 0.35mm.',
      'Adicione plano de terra (GND) em ambas as faces para reduzir tempo de fresagem.',
      'Exporte F.Cu, B.Cu, Edge.Cuts e arquivo de furos (.drl).',
      'Fixe a placa de fenolite com fita dupla-face de alta aderência e zere o eixo Z com probe.'
    ])
  );

  insertTutorial.run(
    'Preparação de Vetores DXF/SVG para Corte a Laser',
    'Corte a Laser',
    '20 min',
    'Iniciante',
    'Como separar camadas por cores (corte vs gravação raster), compensar o kerf de 0.15mm e operar o exaustor e chiller.',
    JSON.stringify([
      'Converta todos os textos em curvas no Inkscape ou AutoCAD.',
      'Use cor VERMELHA (#FF0000) para corte passante e PRETA (#000000) para gravação.',
      'Ligue obrigatoriamente o Chiller CW-5000 e a exaustão antes de disparar o laser.',
      'Ajuste a distância focal com o gabarito de acrílico de 6mm.'
    ])
  );

  // 12. Notifications & Activity Logs
  const insertNotification = db.prepare(`
    INSERT INTO notifications (user_role, title, message, type, read)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertNotification.run('ALUNO', 'Lembrete de Devolução de Empréstimo', 'Seu empréstimo de "2x Módulo ESP32 Wi-Fi" vence em 18/11/2026. Renove ou devolva na bancada.', 'DEVOLUCAO', 0);
  insertNotification.run('ALUNO', 'Horário Aprovado na Impressora 3D!', 'Seu agendamento para 12/11 das 14:00 às 16:00 na IMPRESSÃO 3D (FDM) foi confirmado.', 'AGENDAMENTO', 0);
  insertNotification.run('ALUNO', '+250 XP Desbloqueados!', 'Você concluiu a missão "Primeira Camada Perfeita" no MakerLab Quest!', 'XP', 1);

  const insertLog = db.prepare(`
    INSERT INTO activity_logs (user_name, action, detail, category)
    VALUES (?, ?, ?, ?)
  `);

  insertLog.run('Lucas Almeida', 'CHECK-IN REALIZADO', 'Acesso registrado para Impressão 3D de case TCC', 'CHECKIN');
  insertLog.run('Marcos Simão', 'TAREFA ATUALIZADA', 'Moveu "Placa PCI — robô seguidor" para EM ANDAMENTO', 'TAREFA');
  insertLog.run('Lucas Almeida', 'AGENDAMENTO APROVADO', 'Impressora 3D (FDM) reservada para 12/11 às 14h', 'AGENDA');
  insertLog.run('Gabriel Tozatto', 'MISSÃO CONCLUÍDA', 'Desbloqueou +800 XP na missão "Boss Final: Projeto Integrador"', 'QUEST');
  insertLog.run('Flávio Garcia', 'EMPRÉSTIMO REGISTRADO', 'Retirou gabarito e insumos para corte a laser de embalagens', 'EMPRESTIMO');

  // 13. Site Content (Editável pelo Admin: Sobre, Serviços, Equipe, FAQ, Contato)
  const insertContent = db.prepare(`
    INSERT INTO site_content (key, value_json)
    VALUES (?, ?)
  `);

  insertContent.run(
    'about',
    JSON.stringify({
      badge: 'LABORATÓRIO DE INOVAÇÃO & PROTOTIPAGEM',
      title: 'LABMAKER · IFES CAMPUS SERRA',
      subtitle: 'Transforme ideias em protótipos reais. Um espaço aberto ao ensino, pesquisa, extensão e inovação tecnológica com manufatura digital, eletrônica e cultura maker.',
      hours: 'Segunda a Sexta · 08h00 às 21h00',
      locationRoom: 'Bloco C · Sala 104 (Térreo) — IFES Campus Serra',
      email: 'labmaker.serra@ifes.edu.br',
      phone: '(27) 3348-9200 · Ramal 9245',
      address: 'Rodovia ES-010, Km 6,5 — Manguinhos, Serra - ES, CEP 29173-087'
    })
  );

  insertContent.run(
    'services',
    JSON.stringify([
      {
        id: 'srv-3d',
        title: 'PROTOTIPAGEM 3D',
        description: 'Suporte em modelagem CAD e impressão tridimensional técnica em FDM e Resina SLA.',
        icon: 'cube'
      },
      {
        id: 'srv-pci',
        title: 'CONFECÇÃO DE PCI',
        description: 'Fresagem e usinagem automatizada de circuitos impressos eletrônicos.',
        icon: 'bolt'
      },
      {
        id: 'srv-laser',
        title: 'CORTE & GRAVAÇÃO LASER',
        description: 'Corte vetorial preciso em acrílico, MDF e materiais compostos.',
        icon: 'flame'
      }
    ])
  );

  insertContent.run(
    'team',
    JSON.stringify([
      {
        id: 'team-1',
        name: 'ROSIANE ROCHA',
        role: 'Professora Orientadora da Equipe',
        badge: 'ORIENTADORA',
        isLead: true,
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80'
      },
      {
        id: 'team-2',
        name: 'GABRIEL TOZATTO',
        role: 'Pesquisador em Automação & Sistemas',
        badge: '',
        isLead: false,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80'
      },
      {
        id: 'team-3',
        name: 'MARCOS SIMÃO',
        role: 'Especialista em Eletrônica & Prototipagem',
        badge: '',
        isLead: false,
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80'
      },
      {
        id: 'team-4',
        name: 'RICHARD GODINEZ',
        role: 'Desenvolvedor & Pesquisador Maker',
        badge: '',
        isLead: false,
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=700&q=80'
      },
      {
        id: 'team-5',
        name: 'FLÁVIO GARCIA',
        role: 'Membro / Pesquisador de Projetos Tecnológicos',
        badge: '',
        isLead: false,
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80'
      }
    ])
  );

  insertContent.run(
    'faq',
    JSON.stringify([
      {
        q: 'Quem pode utilizar o LabMaker do IFES Campus Serra?',
        a: 'Todos os estudantes e servidores do IFES Campus Serra podem agendar bancadas e máquinas para projetos de ensino, pesquisa e extensão. A comunidade externa e empresas parceiras também podem agendar visitas técnicas e projetos cooperados.'
      },
      {
        q: 'Preciso pagar pelos filamentos ou chapas utilizados?',
        a: 'Para projetos institucionais cadastrados no campus e atividades de aula, o laboratório disponibiliza cota de insumos básicos (PLA, fenolite e MDF). Para demandas extensas ou específicas, o aluno pode trazer seu próprio insumo homologado.'
      },
      {
        q: 'Como faço para usar a Impressora 3D ou a Cortadora a Laser pela primeira vez?',
        a: 'Basta realizar o Check-in/Login na plataforma, assistir ao tutorial de segurança correspondente (ou concluir a missão iniciante no MakerLab Quest) e reservar seu horário aceitando os Termos de Responsabilidade.'
      },
      {
        q: 'Como funciona o empréstimo de kits Arduino, ESP32 e ferramentas?',
        a: 'Na Área do Aluno, acesse a aba "Empréstimos", escolha o recurso disponível em estoque, selecione a data de devolução e confirme o aceite da Política de Empréstimos.'
      }
    ])
  );
}

// Se chamado diretamente via npm run seed
if (process.argv[1] && process.argv[1].includes('seed')) {
  seedDatabase();
  console.log('Banco SQLite do LabMaker populado com sucesso!');
}

(()=>{
const E=s=>String(s).replace(/\s+/g,' ').trim();
const seed=(title,ref,version,level,duration,ksbText,groups)=>{const parse=(txt,type)=>txt.split('\n').filter(Boolean).map(x=>{const i=x.indexOf('|');return{reference:x.slice(0,i),ksb_type:type,description:E(x.slice(i+1)),id:crypto.randomUUID()}});const ksbs=[...parse(ksbText.K,'K'),...parse(ksbText.S,'S'),...parse(ksbText.B,'B')];const id=r=>ksbs.find(k=>k.reference===r)?.id;const sections=['Trade Skills','Supporting','Main','Knowledge','Behaviours'].map((name,i)=>({id:crypto.randomUUID(),type:['trade','supporting','main','knowledge','behaviours'][i],title:name,description:'',units:[]}));const sec=t=>sections.find(s=>s.type===t);const add=(t,name,refs,activityType)=>{const u={id:crypto.randomUUID(),title:name,description:'',category:t,ksb_ids:refs.map(id).filter(Boolean),activities:[{id:crypto.randomUUID(),title:name+' evidence',type:activityType||'practical',photo_instruction:'',written_prompt:'Demonstrate and explain how this criterion is met.',reflection_prompt:'Reflect on the work completed where appropriate.',ksb_ids:refs.map(id).filter(Boolean),photo_required:activityType==='practical',written_required:activityType!=='witness',reflection_required:activityType==='witness'||activityType==='reflection'}]};sec(t).units.push(u)};groups.forEach(g=>add(g[0],g[1],g[2],g[3]));return{id:crypto.randomUUID(),type:'KSB',title,ref,version,level,duration,website:'',duties:[],ksbs,sections,status:'completed',masterCourse:true,ksbCount:ksbs.length,unitCount:sections.reduce((n,s)=>n+s.units.length,0),activityCount:sections.reduce((n,s)=>n+s.units.reduce((m,u)=>m+u.activities.length,0),0)};};
const brick=seed('Bricklayer','ST0095','1.2','2','24 months',{K:`K1|Awareness of health and safety regulations, standards, and guidance and impact on role. Control of Substances Hazardous to Health (CoSHH). Fire safety. Health and Safety at Work Act. Asbestos awareness. Manual handling. signage, fire extinguishers. Safety signage. Situational awareness. Slips, trips, and falls. Working in confined spaces. Working at height. Electrical safety respiratory protective equipment (RPE), dust suppression.
K2|Safety control equipment and how to use personal protective equipment (PPE).
K3|Safe systems of work: Site inductions, toolbox talks, risk assessments, method statements and hazard identification in the work area.
K4|Impact of the sector on the environment: Efficient use of resources. Recycling, reuse, surface water contamination and safe disposal of waste.
K5|The importance and considerations of the environment and sustainability: Thermal qualities, airtightness and ventilation in buildings.
K6|Principles of building: Foundations, roofs, walls, cavity step trays, floors, utilities and services, insulation, fire, moisture and air protection, damp proof courses, the use of brick ties and quality of materials.
K7|Standards and regulations associated with bricklaying activities: British standards, building regulations and warranty provider standards.
K8|Materials and their characteristics: Bricks and blocks, efflorescence, mortar, damp proof courses (DPC), wall ties, plasticisers, concrete and steel lintels, Rolled Steel Joist (RSJ), fire stopping, insulation, cement and building sand.
K9|Modern methods of construction: Rapid build technology, precast components, corner profiles, alternative frame and cladding systems, masonry support systems.
K10|Methods of interpreting and extracting relevant information from drawings and specifications.
K11|Basic principles of digital design and modelling systems.
K12|Simple resource estimation techniques: Quantity of bricks and blocks, amount of mortar, quantity of wall ties, DPCs, cavity trays and lintels.
K13|Hand tool use, maintenance and storage: Levels, measures, hammers, bolsters, brick hammers, trowels, brick jointer, line blocks and pins, scutch, chariot and brick clamps.
K14|Power tool use and limitations: Disc cutters, mixers and drills.
K15|Bond types: English bond, flemish bond, garden wall bonds and broken bond.
K16|Brick solid wall setting out, construction and capping methods.
K17|Joint finishes: Half round, flush, weather struck and recessed.
K18|Principles of basic decorative walling and piers: projecting and contrasting brick, isolated and attached pier, banding.
K19|Principles of the use of expansion joints.
K20|Mixing Mortar: Ratios, silos, pre-mixed, gauging, hand mixing and mechanical mixing.
K21|Cavity wall setting out techniques: Bricks and blocks, openings and levels, use of profiles, gauge rods and squares.
K22|Cavity wall construction using stretcher bond brick and block walling, forming openings, closing cavities. selection and placement of wall ties, insulation, damp proof courses (DPCs), cavity trays, weep holes, lintels and fire stopping.
K23|Brick on edge and soldier courses: setting out and construction techniques.
K24|Defects and repair: Construction defects and repair methods.
K25|Methods of protecting materials and work: Frost, water and construction damage.
K26|Verbal communication techniques and construction terminology.
K27|Principles of good team working.
K28|Inclusion, equity and diversity in the workplace.
K29|Methods of cutting bricks and blocks using hand tools.
K30|Brick walls with raking cut: Setting out and construction techniques.
K31|Well-being: Mental and physical health considerations in self and others and how to access support.`,S:`S1|Comply with health and safety regulations, standards, and guidance.
S2|Identify and use personal protective equipment (PPE).
S3|Comply with environmental and sustainability regulations, standards, and guidance. Segregate resources for reuse, recycling and disposal.
S4|Comply with industry regulations, standards, and guidance.
S5|Read and interpret information from drawings and specifications.
S6|Estimate and select required resources: For example, the quantity of bricks and blocks, mortar, wall ties and insulation.
S7|Prepare and maintain a safe working area.
S8|Select and use hand tools.
S9|Maintain and store hand tools.
S10|Set out brick and block cavity wall to given tolerances, including an opening.
S11|Construct a stretcher bond brick and block cavity wall with return and opening to given tolerances, including installing a lintel with soldiers, brick and edge sill, closure around opening, insulation, fire stopping, cavity tray, damp proof course (DPC) and weep holes.
S12|Apply joint finishes: For example, half round, flush, weather struck and recessed.
S13|Set out and construct a simple brick solid wall with capping.
S14|Gauge and hand mix mortar to ratio.
S15|Measure and cut bricks and blocks using hand tools, to given tolerances.
S16|Carry out a simple repair: For example, replacing damaged bricks.
S17|Protect materials and finished work.
S18|Verbally communicate with others, applying construction terminology.
S19|Follow equity, diversity and inclusion guidance.
S20|Applies team working principles to their own and the wider build team.
S21|Identifies well-being support available to self and others.
S22|Construct a brick wall with raking cut. For example, gable end wall or garden wall with raking cut.`,B:`B1|Put health, safety and wellbeing first.
B2|Consider the environment when using resources and carrying out processes.
B3|Take ownership of given work.
B4|Contribute to an inclusive and diverse culture.
B5|Seek learning and development opportunities.
B6|Team-focus to meet team goals including, considering the wider build team.`},[
['trade','Health & Safety',['S1','K1','K3']],['trade','Safety Control Equipment',['S2','K2']],['trade','Environment & Sustainability',['S3','K4','K5']],['trade','Industry Regulations',['S4','K7']],['trade','Safe Working Area',['S7','K1','K3']],['trade','Communication',['S18','K26']],['trade','Inclusion',['S19','K28']],['trade','Team Working',['S20','K27']],['trade','Wellbeing',['S21','K31']],
['supporting','Drawings & Specifications',['S5','K10']],['supporting','Resource Estimation',['S6','K12']],['supporting','Hand Tools',['S8','K13']],['supporting','Hand Tool Maintenance & Storage',['S9','K13']],['supporting','Joint Finishes',['S12','K17']],['supporting','Mortar Mixing',['S14','K20']],['supporting','Cutting Bricks & Blocks',['S15','K29']],['supporting','Protecting Work',['S17','K25']],
['main','Cavity Wall Setting Out',['S10','K21']],['main','Cavity Wall Construction',['S11','K22','K23','K8','K19']],['main','Solid Walling',['S13','K15','K16','K18','K19']],['main','Brickwork Repairs',['S16','K24']],['main','Raking Cut Wall',['S22','K30']],
['knowledge','Principles of Building',['K6'],'knowledge'],['knowledge','Modern Methods of Construction',['K9'],'knowledge'],['knowledge','Power Tools',['K14'],'knowledge'],
['behaviours','Witness Testimony & Reflection',['B1','B2','B3','B4','B5','B6'],'witness']
]);
const commonSiteK={K:`K1|Awareness of health and safety regulations, standards, and guidance and impact on role. Control of Substances Hazardous to Health (CoSHH). Fire safety. Health and Safety at Work Act. Asbestos awareness. Manual handling. signage, fire extinguishers. Safety signage. Situational awareness. Slips, trips, and falls. Working in confined spaces. Working at height. Provision and use of work equipment regulations (PUWER) and Electrical safety.
K2|Safety control equipment and how to use personal protective equipment (PPE) respiratory protective equipment (RPE) and local exhaust ventilation (LEV).
K3|Safe systems of work: Site inductions, tool box talks, risk assessments, method statements and hazard identification in the work area.
K4|Impact of the sector on the environment: Efficient use of resources. Recycling, reuse, safe disposal of waste and sustainable forestry.
K5|Principles of building and modern methods of construction: Foundations, roofs, walls, damp proof courses, floors, timber frame, structurally insulated panels (SIPS) utilities and services, internal plaster finishes, insulation, fire protection, moisture and air protection and quality of materials.
K6|Basic principles of digital design and modelling systems.
K7|Standards and regulations associated with carpentry activities: British standards, building regulations and warranty provider standards.
K8|Methods of interpreting and extracting relevant information from drawings and specifications.
K9|Materials and their characteristics of home grown and imported timber and timber-based products. Natural timber products: Hardwood and softwood. Manufactured timber products: Board, laminated timber and carcassing.
K10|Timber decay and repair methods: Timber moisture content parameters for a range of timber and timber-based materials, wet rot and dry rot, and insect attack.
K11|Carpentry and joinery products and purpose: Mastics, preservatives, wood fillers, plastics and ironmongery.
K12|Basic material estimation techniques, calculating lengths of timber, fixing requirements and a cutting list production methods.
K13|Verbal communication techniques and construction terminology.
K14|Hand tool use and storage methods and techniques: Chisels, planes, hand saws, hammers, squares, tri-square, bevels, marking and mortise gauges, spirit levels.
K15|Hand tool maintenance and sharpening techniques.
K16|Jig production techniques.
K17|Power tools use and storage methods and techniques: Portable circular saws, drills, saws, planers, routers, sanders, multi-functional tools and nail guns.
K18|Principles of good team working.
K19|Inclusion, equity and diversity in the workplace.
K20|Well-being: Mental and physical health considerations in self and others and how to access support.
K21|Site carpentry techniques: Measuring, marking out, fitting, cutting (straight and angled) and mitring.
K22|Site carpentry: Structural fixtures and timber sizing in site carpentry, how to use sizing tables.
K23|Site Carpenter: Timber sizing tables purpose and use.
K24|Site carpentry: Timber splicing and scribing techniques.
K25|Site carpentry: Straight roof installation techniques: Basic rafter trussed (prefabricated) and traditional cut roof (built on site).
K26|Site carpentry: Flat roofs: Warm and cold flat roofs including firings and coverings.
K27|Site carpentry: First fixing installation techniques: Structural carcassing (load bearing studwork), floor joists and coverings, straight flights of stairs, metal and timber stud partitions.
K28|Site carpentry: Second fix installation techniques: Service encasement, cladding, wall and floor units and fitments, window boards, handrails and spindles to straight flights of stairs, doors and mouldings (architrave and skirting board).
K29|Site carpenter: Types, use, calibration and storage of laser levels.
K30|Architectural joiner: Requirements of fire door assemblies.
K31|Architectural joiner: Safe use of fixed machinery, inspection, preparation and operation techniques: Crosscut saw, band saw, planer and thicknesser and mortiser.
K32|Architectural joiner: Setting out and marking out techniques for joinery product manufacture and potential effects of marking out errors.
K33|Architectural joiner: Timber joints, types and production techniques: Dovetails, mortise and tenon, bridals and halvings.
K34|Architectural joiner: Manufacture and assembly techniques for standard right angled timber windows.
K35|Architectural joiner: Connection methods in joinery: Dowels, biscuit, staples and adhesives.
K36|Architectural joiner: Manufacture and assembly techniques for timber first fix products: 1. straight staircases 2. door frames and linings.
K37|Architectural joiner: Manufacture and assembly techniques for second fix timber products: 1. timber wall and floor units 2. timber doors 3. timber mouldings.
K38|Architectural joiner: Finishing techniques for manufactured timber products: Sanding, painting, waxing, polishing, oiling and applying preservative.
K39|Architectural joiner: Ironmongery installation techniques.
K40|Employment types (self employed and employed), small business start up principles and tax.`,S:`S1|Comply with health and safety regulations, standards, and guidance.
S2|Identify and use safety control equipment, for example, RPE, dust suppression, PPE and LEV.
S3|Comply with environmental and sustainability regulations, standards, and guidance. Segregate resources for reuse, recycling and disposal.
S4|Comply with industry regulations, standards, and guidance.
S5|Prepare and maintain a safe working area.
S6|Interpret and use information from drawings and specifications.
S7|Estimate required materials and produce a cutting list.
S8|Verbally communicate with others, applying construction terminology.
S9|Select, use and store hand tools.
S10|Select, use and store power tools.
S11|Maintain and sharpen hand tools.
S12|Produce jigs.
S13|Identifies well-being support available to self and others.
S14|Site carpenter: Apply first fix techniques and practices for: 1. structural carcassing (load bearing studwork), 2. straight timber or metal partition walls, 3. floor joists 4. floor joist coverings and 5. straight flights of stairs.
S15|Site carpenter: Install structural fixings.
S16|Site carpenter: Size timber from sizing tables.
S17|Site carpenter: Apply site second fix techniques and practices for: 1. service encasement, 2. cladding 3. wall and floor units and fitments, 4. handrails and spindles to straight flights of stairs, 5. internal and external doors, 6. skirting boards and architrave, 7. window boards.
S18|Site carpenter: Apply site carpenter techniques and practices to construction of rafter roofs, including trussed (prefabricated) and traditional (built on site) including the construction of verge, eaves and fitting loft access.
S19|Site carpenter: Use and store laser levels for example cross line laser.
S20|Site carpenter: Form connections, for example, using joints, nails, screws, bolts and adhesive.
S21|Site carpenter: Apply measuring, marking out, cutting (square and angled), mitring, hinging and recessing techniques.
S22|Site carpenter: Carrying out splicing and scribing techniques.
S23|Architectural joiner: Produce setting out details, including setting rods, and mark out for timber products.
S24|Architectural joiner: Produce basic woodworking joints including dovetail, bridal, mortise and tenon and halving.
S25|Architectural joiner: Form connections using dowels, biscuit, staples and adhesives.
S26|Architectural joiner: Apply techniques and practices to the manufacture and assembly of a timber window with casement including glazing rebates and associated ironmongery.
S27|Architectural joiner: Apply manufacture and assembly techniques for first fix products: 1. straight staircases, 2. door frames and linings.
S28|Architectural joiner: Apply manufacture and assembly techniques for second fix products: 1. timber doors, 2. wall and floor units, 3. timber mouldings, 4. staircase spindles and balustrades.
S29|Architectural joiner: Fit ironmongery including door locks, door handles, door hinges, latches and draw runners.
S30|Architectural joiner: Inspect, prepare and operate fixed machinery.`,B:`B1|Put health, safety and wellbeing first.
B2|Consider the environment when using resources and carrying out processes.
B3|Take ownership of given work.
B4|Contribute to an inclusive and diverse culture.
B5|Seek learning and development opportunities.
B6|Team-focus to meet team goals including, considering the wider build team.`};
const siteGroups=[['trade','Health & Safety',['S1','K1','K3']],['trade','Safety Control Equipment',['S2','K2']],['trade','Environment & Sustainability',['S3','K4']],['trade','Industry Regulations',['S4','K7']],['trade','Safe Working Area',['S5','K1','K3']],['trade','Communication',['S8','K13']],['trade','Wellbeing',['S13','K20']],['supporting','Drawings & Specifications',['S6','K8']],['supporting','Resource Estimation & Cutting Lists',['S7','K12']],['supporting','Hand Tools',['S9','K14']],['supporting','Power Tools',['S10','K17']],['supporting','Hand Tool Maintenance',['S11','K15']],['supporting','Jigs',['S12','K16']],['supporting','Structural Fixings',['S15','K22']],['supporting','Timber Sizing',['S16','K23']],['supporting','Laser Levels',['S19','K29']],['supporting','Connections',['S20','K35']],['supporting','Measuring & Marking',['S21','K21']],['supporting','Splicing & Scribing',['S22','K24']],['main','First Fix Carpentry',['S14','K27']],['main','Second Fix Carpentry',['S17','K28','K11','K30']],['main','Roof Carpentry',['S18','K25']],['knowledge','Principles of Building & Modern Methods',['K5'],'knowledge'],['knowledge','Digital Design & Modelling',['K6'],'knowledge'],['knowledge','Timber & Timber Products',['K9'],'knowledge'],['knowledge','Timber Decay & Repair',['K10'],'knowledge'],['knowledge','Flat Roofs',['K26'],'knowledge'],['knowledge','Employment & Business',['K40'],'knowledge'],['behaviours','Witness Testimony & Reflection',['B1','B2','B3','B4','B5','B6'],'witness']];
const site=seed('Site Carpentry','ST', 'Current','2','Apprenticeship',commonSiteK,siteGroups);
const joinGroups=[['trade','Health & Safety',['S1','K1','K3']],['trade','Safety Control Equipment',['S2','K2']],['trade','Environment & Sustainability',['S3','K4']],['trade','Industry Regulations',['S4','K7']],['trade','Safe Working Area',['S5','K1','K3']],['trade','Communication',['S8','K13']],['trade','Wellbeing',['S13','K20']],['supporting','Drawings & Specifications',['S6','K8']],['supporting','Resource Estimation & Cutting Lists',['S7','K12']],['supporting','Hand Tools',['S9','K14']],['supporting','Power Tools',['S10','K17']],['supporting','Hand Tool Maintenance',['S11','K15']],['supporting','Jigs',['S12','K16']],['supporting','Joinery Setting Out',['S23','K32']],['supporting','Woodworking Joints',['S24','K33']],['supporting','Joinery Connections',['S25','K35']],['supporting','Ironmongery',['S29','K39']],['main','Timber Window Manufacture',['S26','K34']],['main','First Fix Joinery',['S27','K36']],['main','Second Fix Joinery',['S28','K37','K30']],['main','Fixed Machinery',['S30','K31']],['knowledge','Principles of Building & Modern Methods',['K5'],'knowledge'],['knowledge','Digital Design & Modelling',['K6'],'knowledge'],['knowledge','Timber & Timber Products',['K9'],'knowledge'],['knowledge','Timber Decay & Repair',['K10'],'knowledge'],['knowledge','Joinery Products & Purpose',['K11'],'knowledge'],['knowledge','Team Working',['K18'],'knowledge'],['knowledge','Inclusion, Equity & Diversity',['K19'],'knowledge'],['knowledge','Finishing Techniques',['K38'],'knowledge'],['knowledge','Employment & Business',['K40'],'knowledge'],['behaviours','Witness Testimony & Reflection',['B1','B2','B3','B4','B5','B6'],'witness']];
const join=seed('Architectural Joinery','ST','Current','2','Apprenticeship',commonSiteK,joinGroups);
const existing=JSON.parse(localStorage.getItem('naxos3_courses')||'[]');const byTitle=new Set(existing.map(x=>x.title));[brick,site,join].forEach(c=>{if(!byTitle.has(c.title))existing.push(c)});localStorage.setItem('naxos3_courses',JSON.stringify(existing));
})();
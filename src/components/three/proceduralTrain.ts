/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

export interface TrainModelParts {
  root: THREE.Group;
  cab: THREE.Group;
  roofGroup: THREE.Group;
  interiorGroup: THREE.Group;
  chassisGroup: THREE.Group;
  bogieFront: THREE.Group;
  bogieRear: THREE.Group;
  frontLights: THREE.Mesh[];
  wheels: THREE.Mesh[];
}

/**
 * Creates a high-fidelity procedural 3D model of an Indian Railways
 * Vande Bharat Express (Train 18) semi-high-speed locomotive / coach.
 * Formed from 8+ distinct articulated procedural parts with physical PBR materials.
 */
export function createVandeBharatModel(): TrainModelParts {
  const root = new THREE.Group();
  root.name = 'VandeBharat_Train';

  // --- Physical PBR Materials Library ---
  // Main aerodynamic body: High-gloss pearlescent white
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xf4f6f8,
    roughness: 0.22,
    metalness: 0.1,
  });

  // Vande Bharat signature Royal Blue accent stripe
  const blueStripeMaterial = new THREE.MeshStandardMaterial({
    color: 0x0c3b82,
    roughness: 0.25,
    metalness: 0.2,
  });

  // Saffron / Indian Orange accent line
  const orangeStripeMaterial = new THREE.MeshStandardMaterial({
    color: 0xf57c00,
    roughness: 0.3,
    metalness: 0.15,
  });

  // Underframe dark chassis & aerodynamic skirt panels
  const skirtMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e242b,
    roughness: 0.65,
    metalness: 0.4,
  });

  // Dark aerodynamic tinted window ribbon
  const windowMaterial = new THREE.MeshStandardMaterial({
    color: 0x11161d,
    roughness: 0.08,
    metalness: 0.85,
  });

  // Mechanical bogies and suspension
  const bogieMaterial = new THREE.MeshStandardMaterial({
    color: 0x2b3036,
    roughness: 0.6,
    metalness: 0.7,
  });

  // Lathed steel flanged train wheels (polished steel)
  const wheelMaterial = new THREE.MeshStandardMaterial({
    color: 0xd8dde3,
    roughness: 0.15,
    metalness: 0.95,
  });

  // Rooftop equipment (AC pods, resistors)
  const roofEquipMaterial = new THREE.MeshStandardMaterial({
    color: 0x8a929b,
    roughness: 0.4,
    metalness: 0.5,
  });

  // Pantograph high-voltage copper / steel frame
  const pantographMaterial = new THREE.MeshStandardMaterial({
    color: 0xb53525,
    roughness: 0.35,
    metalness: 0.75,
  });

  // Headlights (high-intensity cool-white LED)
  const headlightMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 1.5,
    roughness: 0.1,
  });

  // Taillights (ruby red LED)
  const taillightMaterial = new THREE.MeshStandardMaterial({
    color: 0xff1744,
    emissive: 0xff1744,
    emissiveIntensity: 1.2,
    roughness: 0.1,
  });

  // Interior seats & aisle
  const seatMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e3a8a,
    roughness: 0.7,
    metalness: 0.05,
  });

  // Contact shadow texture for under-train grounding
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 256;
  shadowCanvas.height = 256;
  const ctx = shadowCanvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const shadowTex = new THREE.CanvasTexture(shadowCanvas);
  const shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 3.5),
    new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    })
  );
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.set(0, 0.02, 0);
  root.add(shadowPlane);

  // Groups for exploded view
  const cab = new THREE.Group();
  cab.name = 'Cab_Body';

  const roofGroup = new THREE.Group();
  roofGroup.name = 'Roof_Assembly';

  const interiorGroup = new THREE.Group();
  interiorGroup.name = 'Interior_Cabin';

  const chassisGroup = new THREE.Group();
  chassisGroup.name = 'Chassis_Assembly';

  const bogieFront = new THREE.Group();
  bogieFront.name = 'Bogie_Front';

  const bogieRear = new THREE.Group();
  bogieRear.name = 'Bogie_Rear';

  const wheels: THREE.Mesh[] = [];
  const frontLights: THREE.Mesh[] = [];

  // ==========================================
  // 1. MAIN CAR BODY & AERODYNAMIC CAB NOSE
  // ==========================================
  // Coach body dimensions: Length 14m, Width 2.8m, Height 2.2m
  const bodyLen = 11.5;
  const bodyWidth = 2.7;
  const bodyHeight = 2.1;
  const bodyCenterY = 1.95;

  // Main tubular coach body
  const bodyMesh = new THREE.Mesh(
    new THREE.BoxGeometry(bodyLen, bodyHeight, bodyWidth),
    bodyMaterial
  );
  bodyMesh.position.set(-0.8, bodyCenterY, 0);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  cab.add(bodyMesh);

  // Front Aerodynamic Nose Cone (Procedural Extruded Wedge)
  const noseShape = new THREE.Shape();
  noseShape.moveTo(0, -1.05);
  noseShape.lineTo(2.8, -0.9);
  noseShape.quadraticCurveTo(3.8, -0.4, 3.4, 0.4);
  noseShape.quadraticCurveTo(2.6, 1.05, 0, 1.05);
  noseShape.closePath();

  const noseExtrudeSettings: THREE.ExtrudeGeometryOptions = {
    steps: 2,
    depth: bodyWidth - 0.1,
    bevelEnabled: true,
    bevelThickness: 0.15,
    bevelSize: 0.1,
    bevelSegments: 4,
  };

  const noseGeom = new THREE.ExtrudeGeometry(noseShape, noseExtrudeSettings);
  noseGeom.center();
  const noseMesh = new THREE.Mesh(noseGeom, bodyMaterial);
  noseMesh.rotation.y = Math.PI / 2;
  noseMesh.position.set(4.9 + 1.2, bodyCenterY, 0);
  noseMesh.castShadow = true;
  noseMesh.receiveShadow = true;
  cab.add(noseMesh);

  // Aerodynamic Cab Windshield (Dark Wrap-around Cockpit Glass)
  const windshieldMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.7, bodyWidth - 0.2),
    windowMaterial
  );
  windshieldMesh.rotation.z = -Math.PI / 8;
  windshieldMesh.position.set(6.2, bodyCenterY + 0.45, 0);
  cab.add(windshieldMesh);

  // High-intensity front LED headlights (left & right)
  const lightGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.15, 16);
  lightGeom.rotateZ(Math.PI / 2);

  const leftLight = new THREE.Mesh(lightGeom, headlightMaterial);
  leftLight.position.set(7.5, bodyCenterY - 0.45, 0.85);
  cab.add(leftLight);
  frontLights.push(leftLight);

  const rightLight = new THREE.Mesh(lightGeom, headlightMaterial);
  rightLight.position.set(7.5, bodyCenterY - 0.45, -0.85);
  cab.add(rightLight);
  frontLights.push(rightLight);

  // High-beam center marker
  const centerLight = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.12, 16),
    headlightMaterial
  );
  centerLight.rotation.z = Math.PI / 2;
  centerLight.position.set(6.9, bodyCenterY + 0.75, 0);
  cab.add(centerLight);
  frontLights.push(centerLight);

  // Red Tail marker lights
  const leftTail = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.1, 0.2),
    taillightMaterial
  );
  leftTail.position.set(-6.58, bodyCenterY - 0.4, 0.9);
  cab.add(leftTail);

  const rightTail = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.1, 0.2),
    taillightMaterial
  );
  rightTail.position.set(-6.58, bodyCenterY - 0.4, -0.9);
  cab.add(rightTail);

  // Vande Bharat Signature Blue Stripe (Continuous belt along sides)
  const blueStripe1 = new THREE.Mesh(
    new THREE.BoxGeometry(bodyLen + 1.8, 0.45, bodyWidth + 0.04),
    blueStripeMaterial
  );
  blueStripe1.position.set(0.1, bodyCenterY + 0.05, 0);
  cab.add(blueStripe1);

  // Saffron Orange Accent line
  const orangeStripe = new THREE.Mesh(
    new THREE.BoxGeometry(bodyLen + 1.2, 0.08, bodyWidth + 0.06),
    orangeStripeMaterial
  );
  orangeStripe.position.set(-0.2, bodyCenterY - 0.28, 0);
  cab.add(orangeStripe);

  // Aerodynamic Tinted Passenger Window Strips (Left & Right)
  const windowRibbonGeom = new THREE.BoxGeometry(bodyLen - 1.5, 0.65, bodyWidth + 0.08);
  const windowRibbon = new THREE.Mesh(windowRibbonGeom, windowMaterial);
  windowRibbon.position.set(-1.2, bodyCenterY + 0.45, 0);
  cab.add(windowRibbon);

  // ==========================================
  // 2. ROOF ASSEMBLY & PANTOGRAPH
  // ==========================================
  // Rounded aerodynamic roof cap
  const roofCapGeom = new THREE.CylinderGeometry(
    bodyWidth / 2,
    bodyWidth / 2,
    bodyLen,
    16,
    1,
    false,
    0,
    Math.PI
  );
  roofCapGeom.rotateZ(Math.PI / 2);
  const roofCap = new THREE.Mesh(roofCapGeom, bodyMaterial);
  roofCap.position.set(-0.8, bodyCenterY + bodyHeight / 2, 0);
  roofCap.castShadow = true;
  roofGroup.add(roofCap);

  // Aerodynamic Rooftop AC Units (2 pods)
  [-3.8, 2.2].forEach((xPos) => {
    const acUnit = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.4, 1.8),
      roofEquipMaterial
    );
    acUnit.position.set(xPos, bodyCenterY + bodyHeight / 2 + 0.25, 0);
    acUnit.castShadow = true;
    roofGroup.add(acUnit);
  });

  // High-Voltage Diamond Pantograph (Electrical Current Collector)
  const pantoGroup = new THREE.Group();
  pantoGroup.position.set(-1.0, bodyCenterY + bodyHeight / 2 + 0.35, 0);

  // Insulator base posts
  [-0.6, 0.6].forEach((px) => {
    [-0.5, 0.5].forEach((pz) => {
      const insulator = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.25, 8),
        roofEquipMaterial
      );
      insulator.position.set(px, 0.1, pz);
      pantoGroup.add(insulator);
    });
  });

  // Diamond linkage arms
  const armMat = pantographMaterial;
  const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.0), armMat);
  arm1.rotation.z = Math.PI / 5;
  arm1.position.set(-0.25, 0.55, 0);
  pantoGroup.add(arm1);

  const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.0), armMat);
  arm2.rotation.z = -Math.PI / 5;
  arm2.position.set(0.25, 0.55, 0);
  pantoGroup.add(arm2);

  const upperArm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.9), armMat);
  upperArm1.rotation.z = -Math.PI / 4;
  upperArm1.position.set(-0.25, 1.25, 0);
  pantoGroup.add(upperArm1);

  const upperArm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.9), armMat);
  upperArm2.rotation.z = Math.PI / 4;
  upperArm2.position.set(0.25, 1.25, 0);
  pantoGroup.add(upperArm2);

  // Overhead Contact Carbon Pan (collector horn)
  const pantoHead = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.05, 1.8),
    wheelMaterial
  );
  pantoHead.position.set(0, 1.6, 0);
  pantoGroup.add(pantoHead);

  roofGroup.add(pantoGroup);

  // ==========================================
  // 3. INTERIOR CABIN & SEATING
  // ==========================================
  // Cabin floor
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(bodyLen - 1.0, 0.1, bodyWidth - 0.3),
    new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 })
  );
  floor.position.set(-1.0, bodyCenterY - bodyHeight / 2 + 0.15, 0);
  interiorGroup.add(floor);

  // Seating rows (Executive 2x2 layout)
  for (let sx = -5.0; sx <= 3.0; sx += 1.4) {
    // Left row seats
    const seatL = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.65, 0.75),
      seatMaterial
    );
    seatL.position.set(sx, bodyCenterY - 0.45, 0.75);
    interiorGroup.add(seatL);

    // Right row seats
    const seatR = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.65, 0.75),
      seatMaterial
    );
    seatR.position.set(sx, bodyCenterY - 0.45, -0.75);
    interiorGroup.add(seatR);
  }

  // ==========================================
  // 4. CHASSIS & AERODYNAMIC SKIRTING
  // ==========================================
  const skirt = new THREE.Mesh(
    new THREE.BoxGeometry(bodyLen + 1.0, 0.65, bodyWidth - 0.1),
    skirtMaterial
  );
  skirt.position.set(-0.6, 0.85, 0);
  skirt.castShadow = true;
  chassisGroup.add(skirt);

  // Underfloor battery & electrical equipment box clusters
  [-3.0, 0.5].forEach((eqPos) => {
    const eqBox = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.5, bodyWidth - 0.4),
      roofEquipMaterial
    );
    eqBox.position.set(eqPos, 0.45, 0);
    chassisGroup.add(eqBox);
  });

  // ==========================================
  // 5. BOGIES & STEEL TRAIN WHEELS
  // ==========================================
  function buildBogie(bogieCenter: THREE.Vector3, targetGroup: THREE.Group) {
    const bogieFrame = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 0.3, bodyWidth - 0.3),
      bogieMaterial
    );
    bogieFrame.position.copy(bogieCenter);
    bogieFrame.position.y += 0.25;
    bogieFrame.castShadow = true;
    targetGroup.add(bogieFrame);

    // Two axles per bogie
    const wheelRadius = 0.46;
    [-0.9, 0.9].forEach((axleOffset) => {
      const axleX = bogieCenter.x + axleOffset;
      const axleY = wheelRadius;

      // Steel axle rod
      const axle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, bodyWidth - 0.4, 12),
        wheelMaterial
      );
      axle.rotation.x = Math.PI / 2;
      axle.position.set(axleX, axleY, 0);
      targetGroup.add(axle);

      // Lathed wheels on both rails (Left & Right)
      const wheelGeom = new THREE.CylinderGeometry(
        wheelRadius,
        wheelRadius * 1.08,
        0.18,
        24
      );
      wheelGeom.rotateX(Math.PI / 2);

      const wheelL = new THREE.Mesh(wheelGeom, wheelMaterial);
      wheelL.position.set(axleX, axleY, (bodyWidth - 0.5) / 2);
      wheelL.castShadow = true;
      targetGroup.add(wheelL);
      wheels.push(wheelL);

      const wheelR = new THREE.Mesh(wheelGeom, wheelMaterial);
      wheelR.position.set(axleX, axleY, -(bodyWidth - 0.5) / 2);
      wheelR.castShadow = true;
      targetGroup.add(wheelR);
      wheels.push(wheelR);

      // Suspension spring coil
      const spring = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.3, 12),
        bogieMaterial
      );
      spring.position.set(axleX, axleY + 0.25, (bodyWidth - 0.45) / 2);
      targetGroup.add(spring);
    });
  }

  // Build Front Bogie (under cab) & Rear Bogie (under coach rear)
  buildBogie(new THREE.Vector3(3.8, 0, 0), bogieFront);
  buildBogie(new THREE.Vector3(-4.4, 0, 0), bogieRear);

  // Assemble hierarchy
  root.add(chassisGroup);
  root.add(bogieFront);
  root.add(bogieRear);
  root.add(interiorGroup);
  root.add(cab);
  root.add(roofGroup);

  return {
    root,
    cab,
    roofGroup,
    interiorGroup,
    chassisGroup,
    bogieFront,
    bogieRear,
    frontLights,
    wheels,
  };
}

/**
 * Creates realistic Indian Railways track infrastructure:
 * - Dual steel running rails (Broad Gauge: 1.676m standard)
 * - Concrete sleepers (ties) placed at accurate intervals
 * - Crushed stone ballast bed
 * - Overhead catenary mast
 */
export function createRailwayTrack(trackLength = 80): THREE.Group {
  const trackGroup = new THREE.Group();
  trackGroup.name = 'RailwayTrack_Infrastructure';

  // Broad gauge distance
  const railSpacing = 2.2;
  const railHeight = 0.15;
  const railWidth = 0.08;

  // Steel rail material (polished metallic)
  const railMaterial = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.18,
    metalness: 0.92,
  });

  // Dual steel rails
  const railGeom = new THREE.BoxGeometry(trackLength, railHeight, railWidth);

  const leftRail = new THREE.Mesh(railGeom, railMaterial);
  leftRail.position.set(0, 0.42, railSpacing / 2);
  leftRail.receiveShadow = true;
  trackGroup.add(leftRail);

  const rightRail = new THREE.Mesh(railGeom, railMaterial);
  rightRail.position.set(0, 0.42, -railSpacing / 2);
  rightRail.receiveShadow = true;
  trackGroup.add(rightRail);

  // Concrete sleepers (ties) - Instanced for 60fps performance
  const sleeperCount = Math.floor(trackLength / 0.85);
  const sleeperGeom = new THREE.BoxGeometry(0.32, 0.18, 3.2);
  const sleeperMaterial = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.85,
    metalness: 0.05,
  });

  const sleepersMesh = new THREE.InstancedMesh(sleeperGeom, sleeperMaterial, sleeperCount);
  sleepersMesh.castShadow = true;
  sleepersMesh.receiveShadow = true;

  const dummy = new THREE.Object3D();
  for (let i = 0; i < sleeperCount; i++) {
    const x = -trackLength / 2 + i * 0.85;
    dummy.position.set(x, 0.28, 0);
    dummy.updateMatrix();
    sleepersMesh.setMatrixAt(i, dummy.matrix);
  }
  sleepersMesh.instanceMatrix.needsUpdate = true;
  trackGroup.add(sleepersMesh);

  // Gravel Ballast Bed (procedural angled embankment)
  const ballastGeom = new THREE.BoxGeometry(trackLength, 0.25, 4.8);
  const ballastMaterial = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.95,
    metalness: 0.1,
  });
  const ballast = new THREE.Mesh(ballastGeom, ballastMaterial);
  ballast.position.set(0, 0.12, 0);
  ballast.receiveShadow = true;
  trackGroup.add(ballast);

  // Ground plane extending to horizon
  const groundGeom = new THREE.PlaneGeometry(160, 160);
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.95,
    metalness: 0.05,
  });
  const ground = new THREE.Mesh(groundGeom, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, 0, 0);
  ground.receiveShadow = true;
  trackGroup.add(ground);

  // Overhead Catenary Electric Mast & Power Wires
  const catenaryGroup = new THREE.Group();
  const mastCount = Math.floor(trackLength / 24);
  const mastMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.5,
    metalness: 0.8,
  });

  for (let m = 0; m <= mastCount; m++) {
    const mx = -trackLength / 2 + m * 24 + 10;
    // Vertical steel I-beam
    const mastPole = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 5.8, 0.2),
      mastMat
    );
    mastPole.position.set(mx, 2.9, 2.9);
    catenaryGroup.add(mastPole);

    // Cantilever crossarm
    const crossArm = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.12, 3.4),
      mastMat
    );
    crossArm.position.set(mx, 5.4, 1.4);
    catenaryGroup.add(crossArm);

    // Insulator drop
    const dropInsulator = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.4, 8),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3 })
    );
    dropInsulator.position.set(mx, 5.0, 0);
    catenaryGroup.add(dropInsulator);
  }

  // Overhead 25kV AC contact wire
  const wireGeom = new THREE.CylinderGeometry(0.02, 0.02, trackLength, 6);
  wireGeom.rotateZ(Math.PI / 2);
  const wireMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.3,
    metalness: 0.9,
  });
  const contactWire = new THREE.Mesh(wireGeom, wireMat);
  contactWire.position.set(0, 4.8, 0);
  catenaryGroup.add(contactWire);

  trackGroup.add(catenaryGroup);

  return trackGroup;
}

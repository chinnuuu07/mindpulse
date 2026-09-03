import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { AvatarConfig, AvatarEmotion, AvatarGesture, AvatarPose, AvatarLanguage } from '../types';
import { LifelikePhotoAvatar } from './LifelikePhotoAvatar';
import {
  Sparkles,
  Sliders,
  Volume2,
  ThumbsUp,
  Hand,
  HelpCircle,
  Smile,
  HeartHandshake,
  UserCheck,
  Armchair,
  Footprints,
} from 'lucide-react';

interface ThreeAvatarProps {
  config: AvatarConfig;
  isSpeaking: boolean;
  isListening?: boolean;
  mScore?: number;
  emotion?: AvatarEmotion;
  gesture?: AvatarGesture;
  pose?: AvatarPose;
  language?: AvatarLanguage;
  spokenText?: string;
  onOpenCustomizer?: () => void;
  onGestureTrigger?: (gesture: AvatarGesture) => void;
  onPoseToggle?: (pose: AvatarPose) => void;
  showPoseControls?: boolean;
}

// Photorealistic Female AI Guides Presets
const REAL_FEMALE_GUIDES = [
  {
    id: 'maya',
    name: 'Dr. Maya Lin',
    role: 'Chief Neuropsychiatrist & Mind Guide',
    avatarImg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
    tone: 'Empathetic, Clinical & Calming',
  },
  {
    id: 'aria',
    name: 'Aria Sterling',
    role: 'Bio-Resilience & Sleep Coach',
    avatarImg: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80',
    tone: 'Energizing, Mindful & Uplifting',
  },
  {
    id: 'ananya',
    name: 'Ananya Sharma',
    role: 'Zen Autonomics & Breath Specialist',
    avatarImg: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=500&auto=format&fit=crop&q=80',
    tone: 'Soothing, Harmonic & Grounded',
  },
];

export const ThreeAvatar: React.FC<ThreeAvatarProps> = ({
  config,
  isSpeaking,
  isListening = false,
  mScore = 85,
  emotion = 'calm',
  gesture = 'resting',
  pose = 'standing',
  language = 'en',
  spokenText = '',
  onOpenCustomizer,
  onGestureTrigger,
  onPoseToggle,
  showPoseControls = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isSpeakingRef = useRef(isSpeaking);
  const mScoreRef = useRef(mScore);
  const configRef = useRef(config);
  const emotionRef = useRef<AvatarEmotion>(emotion);
  const gestureRef = useRef<AvatarGesture>(gesture);
  const poseRef = useRef<AvatarPose>(pose);

  const [avatarMode, setAvatarMode] = useState<'lifelike_photo' | '3d_female' | 'real_female'>('lifelike_photo');
  const [selectedGuideIndex, setSelectedGuideIndex] = useState(0);
  const [localPose, setLocalPose] = useState<AvatarPose>(pose);
  const [currentGesture, setCurrentGesture] = useState<AvatarGesture>(gesture);
  const [currentEmotion, setCurrentEmotion] = useState<AvatarEmotion>(emotion);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    mScoreRef.current = mScore;
  }, [mScore]);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    emotionRef.current = emotion;
    setCurrentEmotion(emotion);
  }, [emotion]);

  useEffect(() => {
    gestureRef.current = gesture;
    setCurrentGesture(gesture);
  }, [gesture]);

  useEffect(() => {
    poseRef.current = pose;
    setLocalPose(pose);
  }, [pose]);

  const activeGuide = REAL_FEMALE_GUIDES[selectedGuideIndex];

  // Helper to trigger gesture locally and propagate
  const handleTriggerGesture = (newGesture: AvatarGesture) => {
    setCurrentGesture(newGesture);
    gestureRef.current = newGesture;
    if (onGestureTrigger) onGestureTrigger(newGesture);

    // Automatically return to resting after 3.5 seconds
    if (newGesture !== 'resting') {
      setTimeout(() => {
        if (gestureRef.current === newGesture) {
          setCurrentGesture('resting');
          gestureRef.current = 'resting';
        }
      }, 3800);
    }
  };

  const handleTogglePose = (newPose: AvatarPose) => {
    setLocalPose(newPose);
    poseRef.current = newPose;
    if (onPoseToggle) onPoseToggle(newPose);
  };

  // WebGL 3D Real Female Avatar Initialization with Arms, Hands, Gestures & Poses
  useEffect(() => {
    if (avatarMode !== '3d_female') return;

    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0.4, 4.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Root Group
    const avatarGroup = new THREE.Group();
    scene.add(avatarGroup);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const mainColor = new THREE.Color(configRef.current.glowColor || '#6366f1');
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.2);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(mainColor, 3.5, 12);
    rimLight.position.set(-2.5, 2.5, -2);
    scene.add(rimLight);

    const warmFill = new THREE.PointLight(0xfef08a, 1.2, 8);
    warmFill.position.set(2, -0.5, 2);
    scene.add(warmFill);

    // Realistic Female Skin Material (Soft Subsurface Tone)
    const skinMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf6dbcf,
      metalness: 0.05,
      roughness: 0.45,
      clearcoat: 0.3,
      clearcoatRoughness: 0.25,
    });

    // Outfit Materials
    const blazerMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.4,
      metalness: 0.3,
    });
    const lapelMat = new THREE.MeshStandardMaterial({
      color: 0x4f46e5,
      roughness: 0.2,
      metalness: 0.5,
    });
    const innerShirtMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.5,
    });
    const pantsMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
    });
    const shoesMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.2,
    });

    // ================= HEAD & FACE =================
    const headGroup = new THREE.Group();
    headGroup.position.y = 0.55;
    avatarGroup.add(headGroup);

    // Head base
    const headGeo = new THREE.SphereGeometry(0.72, 48, 48);
    headGeo.scale(0.82, 1.02, 0.9);
    const headMesh = new THREE.Mesh(headGeo, skinMaterial);
    headGroup.add(headMesh);

    // Female Neck
    const neckGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.55, 32);
    const neck = new THREE.Mesh(neckGeo, skinMaterial);
    neck.position.y = -0.15;
    avatarGroup.add(neck);

    // Female Hair (Flowing Locks & Crown Volume)
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x241611,
      roughness: 0.6,
      metalness: 0.1,
    });
    const hairTopGeo = new THREE.SphereGeometry(0.78, 32, 32);
    hairTopGeo.scale(0.86, 1.05, 0.94);
    const hairTop = new THREE.Mesh(hairTopGeo, hairMat);
    hairTop.position.set(0, 0.6, -0.05);
    headGroup.add(hairTop);

    const lockGeo = new THREE.CylinderGeometry(0.12, 0.06, 1.1, 16);
    const leftLock = new THREE.Mesh(lockGeo, hairMat);
    leftLock.position.set(-0.58, -0.15, 0.1);
    leftLock.rotation.z = -0.15;
    headGroup.add(leftLock);

    const rightLock = new THREE.Mesh(lockGeo, hairMat);
    rightLock.position.set(0.58, -0.15, 0.1);
    rightLock.rotation.z = 0.15;
    headGroup.add(rightLock);

    // Eyebrows (Dynamic for Emotions)
    const browMat = new THREE.MeshStandardMaterial({ color: 0x1f140e, roughness: 0.8 });
    const browGeo = new THREE.BoxGeometry(0.24, 0.04, 0.05);

    const leftEyebrow = new THREE.Mesh(browGeo, browMat);
    leftEyebrow.position.set(-0.25, 0.22, 0.63);
    leftEyebrow.rotation.z = 0.05;
    headGroup.add(leftEyebrow);

    const rightEyebrow = new THREE.Mesh(browGeo, browMat);
    rightEyebrow.position.set(0.25, 0.22, 0.63);
    rightEyebrow.rotation.z = -0.05;
    headGroup.add(rightEyebrow);

    // Eyes with Pupils and Eyelids
    const scleraMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const irisMat = new THREE.MeshStandardMaterial({
      color: 0x4338ca,
      roughness: 0.2,
      metalness: 0.4,
    });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const eyeGeo = new THREE.SphereGeometry(0.12, 32, 32);

    // Left Eye
    const leftEye = new THREE.Group();
    leftEye.position.set(-0.25, 0.08, 0.58);
    const leftSclera = new THREE.Mesh(eyeGeo, scleraMat);
    const leftIris = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), irisMat);
    leftIris.position.z = 0.07;
    const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), pupilMat);
    leftPupil.position.z = 0.1;
    leftEye.add(leftSclera, leftIris, leftPupil);
    headGroup.add(leftEye);

    // Right Eye
    const rightEye = new THREE.Group();
    rightEye.position.set(0.25, 0.08, 0.58);
    const rightSclera = new THREE.Mesh(eyeGeo, scleraMat);
    const rightIris = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), irisMat);
    rightIris.position.z = 0.07;
    const rightPupil = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), pupilMat);
    rightPupil.position.z = 0.1;
    rightEye.add(rightSclera, rightIris, rightPupil);
    headGroup.add(rightEye);

    // Eyelids for realistic blinking
    const eyelidGeo = new THREE.SphereGeometry(0.125, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const eyelidMat = new THREE.MeshStandardMaterial({
      color: 0xecbaa8,
      roughness: 0.5,
    });

    const leftEyelid = new THREE.Mesh(eyelidGeo, eyelidMat);
    leftEyelid.position.set(-0.25, 0.08, 0.58);
    leftEyelid.rotation.x = -Math.PI / 2;
    leftEyelid.scale.y = 0.01;
    headGroup.add(leftEyelid);

    const rightEyelid = new THREE.Mesh(eyelidGeo, eyelidMat);
    rightEyelid.position.set(0.25, 0.08, 0.58);
    rightEyelid.rotation.x = -Math.PI / 2;
    rightEyelid.scale.y = 0.01;
    headGroup.add(rightEyelid);

    // Mouth & Lips (Dynamic Morphing for Speech & Expression)
    const mouthGroup = new THREE.Group();
    mouthGroup.position.set(0, -0.28, 0.63);
    headGroup.add(mouthGroup);

    const lipsGeo = new THREE.TorusGeometry(0.14, 0.032, 16, 32, Math.PI);
    lipsGeo.rotateX(Math.PI * 0.5);
    const lipsMat = new THREE.MeshStandardMaterial({
      color: 0xd9777f,
      roughness: 0.35,
      metalness: 0.1,
    });
    const lipsMesh = new THREE.Mesh(lipsGeo, lipsMat);
    mouthGroup.add(lipsMesh);

    // ================= TORSO & SHOULDERS =================
    const torsoGroup = new THREE.Group();
    avatarGroup.add(torsoGroup);

    // Upper Torso / Blazer
    const torsoGeo = new THREE.CylinderGeometry(0.28, 0.68, 0.85, 32);
    const torsoMesh = new THREE.Mesh(torsoGeo, blazerMat);
    torsoMesh.position.y = -0.72;
    torsoGroup.add(torsoMesh);

    // Lapel & Inner blouse
    const innerBlouse = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.35, 0.5, 16), innerShirtMat);
    innerBlouse.position.set(0, -0.5, 0.1);
    torsoGroup.add(innerBlouse);

    const lapelGeo = new THREE.TorusGeometry(0.32, 0.045, 16, 32, Math.PI);
    lapelGeo.rotateX(Math.PI * 0.5);
    const lapel = new THREE.Mesh(lapelGeo, lapelMat);
    lapel.position.set(0, -0.38, 0.2);
    torsoGroup.add(lapel);

    const shoulderGeo = new THREE.CapsuleGeometry(0.18, 1.25, 16, 32);
    shoulderGeo.rotateZ(Math.PI / 2);
    const shoulders = new THREE.Mesh(shoulderGeo, blazerMat);
    shoulders.position.set(0, -0.42, 0);
    torsoGroup.add(shoulders);

    // ================= ARMS & HANDS WITH GESTURES =================
    // Helper to build a complete articulated arm
    const buildArm = (isRight: boolean) => {
      const armGroup = new THREE.Group();
      const xOffset = isRight ? 0.62 : -0.62;
      armGroup.position.set(xOffset, -0.42, 0);

      // Upper arm
      const upperArmGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.6, 16);
      const upperArm = new THREE.Mesh(upperArmGeo, blazerMat);
      upperArm.position.y = -0.3;
      armGroup.add(upperArm);

      // Elbow joint
      const elbowGroup = new THREE.Group();
      elbowGroup.position.y = -0.6;
      armGroup.add(elbowGroup);

      // Forearm
      const forearmGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.55, 16);
      const forearm = new THREE.Mesh(forearmGeo, skinMaterial);
      forearm.position.y = -0.28;
      elbowGroup.add(forearm);

      // Wrist & Hand
      const handGroup = new THREE.Group();
      handGroup.position.y = -0.56;
      elbowGroup.add(handGroup);

      // Palm
      const palmGeo = new THREE.BoxGeometry(0.12, 0.16, 0.06);
      const palm = new THREE.Mesh(palmGeo, skinMaterial);
      handGroup.add(palm);

      // Fingers
      const fingerGeo = new THREE.BoxGeometry(0.025, 0.1, 0.03);
      for (let i = 0; i < 4; i++) {
        const finger = new THREE.Mesh(fingerGeo, skinMaterial);
        finger.position.set(-0.045 + i * 0.03, -0.12, 0);
        handGroup.add(finger);
      }

      // Thumb (prominent for thumbs_up gesture)
      const thumbGeo = new THREE.BoxGeometry(0.03, 0.09, 0.04);
      const thumb = new THREE.Mesh(thumbGeo, skinMaterial);
      const thumbX = isRight ? -0.06 : 0.06;
      thumb.position.set(thumbX, -0.02, 0.04);
      thumb.rotation.z = isRight ? 0.4 : -0.4;
      handGroup.add(thumb);

      return {
        armGroup,
        upperArm,
        elbowGroup,
        forearm,
        handGroup,
        thumb,
      };
    };

    const leftArm = buildArm(false);
    const rightArm = buildArm(true);
    torsoGroup.add(leftArm.armGroup);
    torsoGroup.add(rightArm.armGroup);

    // ================= LOWER BODY & PODIUM / CHAIR =================
    const lowerBodyGroup = new THREE.Group();
    avatarGroup.add(lowerBodyGroup);

    // Legs
    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-0.24, -1.15, 0);
    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(0.24, -1.15, 0);

    const thighGeo = new THREE.CylinderGeometry(0.16, 0.14, 0.8, 16);
    const leftThigh = new THREE.Mesh(thighGeo, pantsMat);
    leftThigh.position.y = -0.4;
    leftLegGroup.add(leftThigh);

    const rightThigh = new THREE.Mesh(thighGeo, pantsMat);
    rightThigh.position.y = -0.4;
    rightLegGroup.add(rightThigh);

    const calfGeo = new THREE.CylinderGeometry(0.13, 0.11, 0.8, 16);
    const leftCalf = new THREE.Mesh(calfGeo, pantsMat);
    leftCalf.position.y = -1.1;
    leftLegGroup.add(leftCalf);

    const rightCalf = new THREE.Mesh(calfGeo, pantsMat);
    rightCalf.position.y = -1.1;
    rightLegGroup.add(rightCalf);

    const shoeGeo = new THREE.BoxGeometry(0.15, 0.1, 0.32);
    const leftShoe = new THREE.Mesh(shoeGeo, shoesMat);
    leftShoe.position.set(0, -1.5, 0.08);
    leftLegGroup.add(leftShoe);

    const rightShoe = new THREE.Mesh(shoeGeo, shoesMat);
    rightShoe.position.set(0, -1.5, 0.08);
    rightLegGroup.add(rightShoe);

    lowerBodyGroup.add(leftLegGroup);
    lowerBodyGroup.add(rightLegGroup);

    // Sleek Circular Standing Podium with Bioluminescent Ring
    const podiumGroup = new THREE.Group();
    podiumGroup.position.y = -2.7;
    const podiumBase = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 1.8, 0.18, 48),
      new THREE.MeshStandardMaterial({
        color: 0x090d16,
        roughness: 0.3,
        metalness: 0.7,
      })
    );
    const podiumRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.5, 0.035, 16, 64),
      new THREE.MeshBasicMaterial({ color: mainColor, transparent: true, opacity: 0.85 })
    );
    podiumRing.rotateX(Math.PI / 2);
    podiumGroup.add(podiumBase, podiumRing);
    scene.add(podiumGroup);

    // Ergonomic Modern Wellness Lounge Chair (for Sitting Mode)
    const chairGroup = new THREE.Group();
    chairGroup.position.set(0, -1.5, -0.1);
    const chairMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      roughness: 0.4,
      metalness: 0.2,
    });
    const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.16, 1.1), chairMat);
    const chairBack = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.2, 0.15), chairMat);
    chairBack.position.set(0, 0.6, -0.45);
    chairBack.rotation.x = -0.15;
    const chairArmL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.8), chairMat);
    chairArmL.position.set(-0.62, 0.35, 0);
    const chairArmR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.8), chairMat);
    chairArmR.position.set(0.62, 0.35, 0);

    const frameMat = new THREE.MeshStandardMaterial({ color: 0x6366f1, metalness: 0.8, roughness: 0.2 });
    const chairLegGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.0, 16);
    const leg1 = new THREE.Mesh(chairLegGeo, frameMat);
    leg1.position.set(-0.5, -0.5, 0.4);
    const leg2 = new THREE.Mesh(chairLegGeo, frameMat);
    leg2.position.set(0.5, -0.5, 0.4);
    const leg3 = new THREE.Mesh(chairLegGeo, frameMat);
    leg3.position.set(-0.5, -0.5, -0.4);
    const leg4 = new THREE.Mesh(chairLegGeo, frameMat);
    leg4.position.set(0.5, -0.5, -0.4);
    chairGroup.add(chairSeat, chairBack, chairArmL, chairArmR, leg1, leg2, leg3, leg4);
    scene.add(chairGroup);

    // Floating Halo Ring
    const haloGeo = new THREE.TorusGeometry(0.85, 0.018, 16, 64);
    haloGeo.rotateX(Math.PI / 2.2);
    const haloMat = new THREE.MeshBasicMaterial({
      color: mainColor,
      transparent: true,
      opacity: 0.85,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.set(0, 1.45, 0);
    headGroup.add(halo);

    // Pointer Tracking
    let targetRotationY = 0;
    let targetRotationX = 0;
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = x * 0.35;
      targetRotationX = -y * 0.2;
    };
    window.addEventListener('pointermove', handlePointerMove);

    // Animation Variables
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let nextBlinkTime = 2.0;
    let isBlinking = false;
    let blinkTimer = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Mode: Standing vs Sitting
      const isSitting = poseRef.current === 'sitting';
      chairGroup.visible = isSitting;
      podiumGroup.visible = !isSitting;

      if (isSitting) {
        // Position avatar sitting in chair
        avatarGroup.position.set(0, -0.3 + Math.sin(elapsed * 1.5) * 0.015, -0.05);
        leftThigh.rotation.x = -Math.PI / 2.2;
        rightThigh.rotation.x = -Math.PI / 2.2;
        leftCalf.position.set(0, -0.5, 0.6);
        leftCalf.rotation.x = 0;
        rightCalf.position.set(0, -0.5, 0.6);
        rightCalf.rotation.x = 0;
        leftShoe.position.set(0, -0.95, 0.68);
        rightShoe.position.set(0, -0.95, 0.68);
      } else {
        // Standing gracefully on podium
        avatarGroup.position.set(0, -0.1 + Math.sin(elapsed * 1.8) * 0.025, 0);
        leftThigh.rotation.x = 0;
        rightThigh.rotation.x = 0;
        leftCalf.position.set(0, -1.1, 0);
        leftCalf.rotation.x = 0;
        rightCalf.position.set(0, -1.1, 0);
        rightCalf.rotation.x = 0;
        leftShoe.position.set(0, -1.5, 0.08);
        rightShoe.position.set(0, -1.5, 0.08);
      }

      // Smooth Head Tracking
      headGroup.rotation.y += (targetRotationY - headGroup.rotation.y) * 0.08;
      headGroup.rotation.x += (targetRotationX - headGroup.rotation.x) * 0.08;
      shoulders.rotation.z = Math.PI / 2 + headGroup.rotation.y * 0.1;

      // Realistic Double Blink
      if (elapsed > nextBlinkTime) {
        isBlinking = true;
        blinkTimer = 0;
        nextBlinkTime = elapsed + 2.8 + Math.random() * 3.5;
      }
      if (isBlinking) {
        blinkTimer += delta;
        const progress = blinkTimer / 0.15;
        if (progress < 0.5) {
          const s = THREE.MathUtils.lerp(0.01, 1.0, progress * 2);
          leftEyelid.scale.y = s;
          rightEyelid.scale.y = s;
        } else if (progress <= 1.0) {
          const s = THREE.MathUtils.lerp(1.0, 0.01, (progress - 0.5) * 2);
          leftEyelid.scale.y = s;
          rightEyelid.scale.y = s;
        } else {
          isBlinking = false;
          leftEyelid.scale.y = 0.01;
          rightEyelid.scale.y = 0.01;
        }
      }

      // Dynamic Facial Expressions based on Emotion
      const currentEmo = emotionRef.current;
      if (currentEmo === 'happy') {
        leftEyebrow.position.y = 0.24;
        rightEyebrow.position.y = 0.24;
        leftEyebrow.rotation.z = 0.1;
        rightEyebrow.rotation.z = -0.1;
      } else if (currentEmo === 'thoughtful') {
        leftEyebrow.position.y = 0.27; // raised quizzical brow
        rightEyebrow.position.y = 0.21;
        leftEyebrow.rotation.z = 0.18;
      } else if (currentEmo === 'empathetic') {
        leftEyebrow.position.y = 0.22;
        rightEyebrow.position.y = 0.22;
        leftEyebrow.rotation.z = -0.05;
        rightEyebrow.rotation.z = 0.05;
      } else if (currentEmo === 'encouraging') {
        leftEyebrow.position.y = 0.25;
        rightEyebrow.position.y = 0.25;
      } else {
        // calm / neutral
        leftEyebrow.position.y = 0.22;
        rightEyebrow.position.y = 0.22;
        leftEyebrow.rotation.z = 0.05;
        rightEyebrow.rotation.z = -0.05;
      }

      // Speaking Lip Movement Morphing
      if (isSpeakingRef.current) {
        const mouthAperture = 0.08 + Math.abs(Math.sin(elapsed * 18)) * 0.16;
        mouthGroup.scale.set(1.15, mouthAperture * 8.5, 1);
        mouthGroup.position.y = -0.28 - mouthAperture * 0.15;
      } else {
        mouthGroup.scale.set(1, 1, 1);
        mouthGroup.position.y = -0.28;
      }

      // ================= HAND GESTURE SYNCHRONIZATION =================
      const currentGest = gestureRef.current;

      // Reset base arm targets
      let targetRShoulderX = 0;
      let targetRShoulderZ = 0.1;
      let targetRElbowX = 0;
      let targetRForearmRotZ = 0;

      let targetLShoulderX = 0;
      let targetLShoulderZ = -0.1;
      let targetLElbowX = 0;

      if (currentGest === 'thumbs_up') {
        // Right arm raises forward, elbow bends 90 deg, thumb points up
        targetRShoulderX = -1.2;
        targetRShoulderZ = -0.2;
        targetRElbowX = -1.3;
        targetRForearmRotZ = Math.PI / 2;
        rightArm.thumb.scale.set(1.4, 1.4, 1.4);
        rightArm.handGroup.position.y = -0.56 + Math.sin(elapsed * 6) * 0.03; // celebratory bob
      } else if (currentGest === 'wave') {
        // Right arm raises high, hand oscillates left-right in friendly wave
        targetRShoulderX = -1.6;
        targetRShoulderZ = -0.6;
        targetRElbowX = -1.1;
        rightArm.handGroup.rotation.z = Math.sin(elapsed * 7) * 0.45;
        rightArm.thumb.scale.set(1, 1, 1);
      } else if (currentGest === 'thinking') {
        // Right hand moves to chin, head tilts
        targetRShoulderX = -1.4;
        targetRShoulderZ = -0.4;
        targetRElbowX = -1.8;
        headGroup.rotation.z = -0.1;
        rightArm.thumb.scale.set(1, 1, 1);
      } else if (currentGest === 'point') {
        // Right arm extends forward pointing towards user/puzzle
        targetRShoulderX = -1.45;
        targetRShoulderZ = 0.05;
        targetRElbowX = -0.2;
        rightArm.thumb.scale.set(1, 1, 1);
      } else if (currentGest === 'open_hands') {
        // Both arms comfortably extend forward with open palms
        targetRShoulderX = -0.8;
        targetRShoulderZ = 0.35;
        targetRElbowX = -0.7;

        targetLShoulderX = -0.8;
        targetLShoulderZ = -0.35;
        targetLElbowX = -0.7;
        rightArm.thumb.scale.set(1, 1, 1);
      } else if (currentGest === 'clapping') {
        // Both hands meet in front of chest rhythmically clapping
        targetRShoulderX = -1.1;
        targetRShoulderZ = -0.5;
        targetRElbowX = -1.4;

        targetLShoulderX = -1.1;
        targetLShoulderZ = 0.5;
        targetLElbowX = -1.4;

        const clapOffset = Math.sin(elapsed * 12) * 0.12;
        rightArm.armGroup.position.x = 0.62 - clapOffset;
        leftArm.armGroup.position.x = -0.62 + clapOffset;
      } else {
        // Resting posture
        if (isSitting) {
          targetRShoulderX = -0.4;
          targetRShoulderZ = 0.15;
          targetRElbowX = -0.8;

          targetLShoulderX = -0.4;
          targetLShoulderZ = -0.15;
          targetLElbowX = -0.8;
        } else {
          // Natural standing resting arms with gentle breath sway
          targetRShoulderX = Math.sin(elapsed * 1.5) * 0.03;
          targetRShoulderZ = 0.08;
          targetRElbowX = -0.05;

          targetLShoulderX = Math.sin(elapsed * 1.5) * 0.03;
          targetLShoulderZ = -0.08;
          targetLElbowX = -0.05;
        }
        rightArm.thumb.scale.set(1, 1, 1);
        rightArm.handGroup.rotation.z = 0;
        headGroup.rotation.z = 0;
        rightArm.armGroup.position.x = 0.62;
        leftArm.armGroup.position.x = -0.62;
      }

      // Smooth interpolation for arms
      rightArm.armGroup.rotation.x += (targetRShoulderX - rightArm.armGroup.rotation.x) * 0.1;
      rightArm.armGroup.rotation.z += (targetRShoulderZ - rightArm.armGroup.rotation.z) * 0.1;
      rightArm.elbowGroup.rotation.x += (targetRElbowX - rightArm.elbowGroup.rotation.x) * 0.1;
      rightArm.elbowGroup.rotation.z += (targetRForearmRotZ - rightArm.elbowGroup.rotation.z) * 0.1;

      leftArm.armGroup.rotation.x += (targetLShoulderX - leftArm.armGroup.rotation.x) * 0.1;
      leftArm.armGroup.rotation.z += (targetLShoulderZ - leftArm.armGroup.rotation.z) * 0.1;
      leftArm.elbowGroup.rotation.x += (targetLElbowX - leftArm.elbowGroup.rotation.x) * 0.1;

      // Halo and podium rotation
      halo.rotation.z += 0.01;
      podiumRing.rotation.z += 0.005;

      renderer.render(scene, camera);
    };

    animate();

    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [avatarMode]);

  return (
    <div
      id="three-avatar-wrapper"
      className="relative w-full h-full min-h-[380px] lg:min-h-[480px] flex flex-col justify-between overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-700 backdrop-blur-md shadow-2xl group select-none"
    >
      {/* Top Bar: Mode Switcher, Pose Toggle, & Guide Info */}
      <div className="flex items-center justify-between p-3.5 z-20 bg-slate-950/60 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <h4 className="text-xs font-bold text-white leading-tight">
              {avatarMode === '3d_female' ? '3D AURA Companion' : activeGuide.name}
            </h4>
            <span className="text-[10px] text-indigo-300 font-medium">
              {avatarMode === '3d_female'
                ? `Emotion: ${currentEmotion} • Gesture: ${currentGesture}`
                : activeGuide.role}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Pose Switcher: Standing vs Sitting (for 3D mode) */}
          {avatarMode === '3d_female' && showPoseControls && (
            <div className="flex bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-[10px] font-bold uppercase">
              <button
                onClick={() => handleTogglePose('standing')}
                className={`px-2 py-1 rounded transition cursor-pointer flex items-center gap-1 ${
                  localPose === 'standing'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Standing on Wellness Podium"
              >
                <Footprints className="w-3 h-3" />
                <span className="hidden sm:inline">Standing</span>
              </button>
              <button
                onClick={() => handleTogglePose('sitting')}
                className={`px-2 py-1 rounded transition cursor-pointer flex items-center gap-1 ${
                  localPose === 'sitting'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Sitting in Ergonomic Chair"
              >
                <Armchair className="w-3 h-3" />
                <span className="hidden sm:inline">Sitting</span>
              </button>
            </div>
          )}

          {/* Mode Switcher */}
          <div className="flex bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-[10px] font-bold uppercase">
            <button
              onClick={() => setAvatarMode('lifelike_photo')}
              className={`px-2 py-1 rounded transition cursor-pointer flex items-center gap-1 ${
                avatarMode === 'lifelike_photo'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Photorealistic Dynamic AI Avatar"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Lifelike AURA</span>
            </button>
            <button
              onClick={() => setAvatarMode('3d_female')}
              className={`px-2 py-1 rounded transition cursor-pointer ${
                avatarMode === '3d_female'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              3D Avatar
            </button>
            <button
              onClick={() => setAvatarMode('real_female')}
              className={`px-2 py-1 rounded transition cursor-pointer ${
                avatarMode === 'real_female'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Guides
            </button>
          </div>

          {onOpenCustomizer && (
            <button
              onClick={onOpenCustomizer}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              title="Customize Voice & Avatar Glow"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Avatar Viewport */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">
        {/* Geometric Balance Ambient Lighting & Orbital Rings */}
        <div className="absolute -inset-10 bg-indigo-500/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="w-56 h-56 sm:w-64 sm:h-64 border border-indigo-500/20 rounded-full absolute animate-ping pointer-events-none" />
        <div className="w-68 h-68 sm:w-76 sm:h-76 border border-indigo-400/20 rounded-full absolute rotate-45 pointer-events-none" />

        {avatarMode === 'lifelike_photo' ? (
          /* User's Exact Photo Lifelike Dynamic Avatar with Expressions, Lip Sync & Biology */
          <LifelikePhotoAvatar
            config={config}
            isSpeaking={isSpeaking}
            isListening={isListening}
            mScore={mScore}
            emotion={currentEmotion}
            gesture={currentGesture}
            pose={localPose}
            language={language}
            spokenText={spokenText}
            onOpenCustomizer={onOpenCustomizer}
            onGestureTrigger={handleTriggerGesture}
            onPoseToggle={handleTogglePose}
            showPoseControls={showPoseControls}
          />
        ) : avatarMode === 'real_female' ? (
          /* Real High-Fidelity Female Portrait Mode */
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-2 border-indigo-400/60 shadow-2xl shadow-indigo-950/80 group">
              <img
                src={activeGuide.avatarImg}
                alt={activeGuide.name}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  isSpeaking ? 'scale-105 filter contrast-105' : 'scale-100'
                }`}
              />
              {isSpeaking && (
                <div className="absolute inset-0 rounded-full border-4 border-indigo-400 animate-pulse pointer-events-none" />
              )}
            </div>

            {/* Vocal Speech Wave Graphic */}
            <div className="mt-3 flex items-center gap-1.5 h-6">
              {isSpeaking ? (
                <>
                  {[40, 75, 100, 60, 90, 45, 80, 50, 95, 30].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-indigo-400 rounded-full animate-bounce"
                      style={{
                        height: `${h}%`,
                        animationDelay: `${i * 0.08}s`,
                      }}
                    />
                  ))}
                  <span className="text-[10px] font-mono text-indigo-300 font-bold ml-2">
                    Speaking live...
                  </span>
                </>
              ) : (
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-emerald-400" />
                  Bio-Resilience Guide Active
                </span>
              )}
            </div>

            {/* Persona Guide Quick Picker */}
            <div className="mt-3 flex items-center gap-2">
              {REAL_FEMALE_GUIDES.map((guide, idx) => (
                <button
                  key={guide.id}
                  onClick={() => setSelectedGuideIndex(idx)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition cursor-pointer border flex items-center gap-1.5 ${
                    selectedGuideIndex === idx
                      ? 'bg-indigo-600/80 border-indigo-400 text-white shadow-md'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <img
                    src={guide.avatarImg}
                    alt={guide.name}
                    referrerPolicy="no-referrer"
                    className="w-3.5 h-3.5 rounded-full object-cover"
                  />
                  <span>{guide.name.split(' ')[1]}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* 3D Female WebGL Canvas with Arms, Hands & Gestures */
          <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          />
        )}
      </div>

      {/* Floating Interactive Gesture Dock (Quick Trigger for testing gestures) */}
      {avatarMode === '3d_female' && (
        <div className="p-2 bg-slate-950/80 border-t border-slate-800 backdrop-blur-sm flex items-center justify-center gap-1 sm:gap-2 flex-wrap z-20">
          <span className="text-[10px] uppercase font-bold text-slate-500 mr-1 hidden sm:inline">
            Gestures:
          </span>
          <button
            onClick={() => handleTriggerGesture('thumbs_up')}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 transition cursor-pointer ${
              currentGesture === 'thumbs_up'
                ? 'bg-indigo-600 border-indigo-400 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Thumbs Up (Success / Praise)"
          >
            <ThumbsUp className="w-3 h-3 text-amber-400" />
            <span>Thumbs Up</span>
          </button>
          <button
            onClick={() => handleTriggerGesture('wave')}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 transition cursor-pointer ${
              currentGesture === 'wave'
                ? 'bg-indigo-600 border-indigo-400 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Wave (Greeting)"
          >
            <Hand className="w-3 h-3 text-cyan-400" />
            <span>Wave</span>
          </button>
          <button
            onClick={() => handleTriggerGesture('thinking')}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 transition cursor-pointer ${
              currentGesture === 'thinking'
                ? 'bg-indigo-600 border-indigo-400 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Thinking / Puzzling"
          >
            <HelpCircle className="w-3 h-3 text-purple-400" />
            <span>Thinking</span>
          </button>
          <button
            onClick={() => handleTriggerGesture('open_hands')}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 transition cursor-pointer ${
              currentGesture === 'open_hands'
                ? 'bg-indigo-600 border-indigo-400 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Open Hands (Empathy / Calm)"
          >
            <HeartHandshake className="w-3 h-3 text-rose-400" />
            <span>Open Hands</span>
          </button>
        </div>
      )}

      {/* Speaking Active Banner */}
      {isSpeaking && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/90 border border-indigo-500/60 text-white text-xs shadow-2xl backdrop-blur-md animate-pulse z-30 font-semibold pointer-events-none">
          <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>AURA Speaking...</span>
        </div>
      )}
    </div>
  );
};

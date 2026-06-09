"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

import { useBuddyScene } from "@/components/buddy-scene-provider";

const EDGE = {
  blueOrb: { x: 6.2, y: 2.8, z: -1.4, scale: 1.05 },
  violetOrb: { x: -6, y: -3.1, z: -1.6, scale: 0.72 },
  cyanRing: { x: -5.6, y: 2.5, z: -2.4, scale: 0.58 },
  violetRing: { x: 5.8, y: -2.8, z: -2.8, scale: 0.5 },
  portalRing: { x: 0, y: 3.6, z: -4.8, scale: 0.75 },
} as const;

const OPACITY = {
  blueOrb: 0.72,
  violetOrb: 0.62,
  cyanRing: 0.38,
  violetRing: 0.28,
  portalRing: 0.16,
} as const;

export function SceneBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { edgeOrbsVisible } = useBuddyScene();
  const edgeOrbsVisibleRef = useRef(edgeOrbsVisible);

  useEffect(() => {
    edgeOrbsVisibleRef.current = edgeOrbsVisible;
  }, [edgeOrbsVisible]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2("#0a0708", 0.048);

    const camera = new THREE.PerspectiveCamera(
      52,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const particleCount = 1200;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = (Math.random() - 0.5) * 22;
      positions[i + 1] = (Math.random() - 0.5) * 14;
      positions[i + 2] = (Math.random() - 0.5) * 14;
      velocities[i] = (Math.random() - 0.5) * 0.002;
      velocities[i + 1] = (Math.random() - 0.5) * 0.002;
      velocities[i + 2] = (Math.random() - 0.5) * 0.002;
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: "#F87171",
      size: 0.02,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const streakGeometry = new THREE.BufferGeometry();
    const streakPositions = new Float32Array(120 * 6);
    for (let i = 0; i < streakPositions.length; i += 6) {
      const x = (Math.random() - 0.5) * 24;
      const y = (Math.random() - 0.5) * 14;
      const z = (Math.random() - 0.5) * 12;
      streakPositions[i] = x;
      streakPositions[i + 1] = y;
      streakPositions[i + 2] = z;
      streakPositions[i + 3] = x + 0.4 + Math.random() * 0.6;
      streakPositions[i + 4] = y + (Math.random() - 0.5) * 0.08;
      streakPositions[i + 5] = z;
    }
    streakGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(streakPositions, 3),
    );
    const streakMaterial = new THREE.LineBasicMaterial({
      color: "#FBBF24",
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
    });
    const streaks = new THREE.LineSegments(streakGeometry, streakMaterial);
    scene.add(streaks);

    const orbGeometry = new THREE.IcosahedronGeometry(0.85, 1);
    const blueOrbMaterial = new THREE.MeshBasicMaterial({
      color: "#DC2626",
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    const violetOrbMaterial = new THREE.MeshBasicMaterial({
      color: "#F59E0B",
      wireframe: true,
      transparent: true,
      opacity: 0,
    });

    const blueOrb = new THREE.Mesh(orbGeometry, blueOrbMaterial);
    const violetOrb = new THREE.Mesh(orbGeometry, violetOrbMaterial);
    blueOrb.scale.setScalar(0.001);
    violetOrb.scale.setScalar(0.001);
    scene.add(blueOrb, violetOrb);

    const ringGeometry = new THREE.TorusGeometry(1.7, 0.01, 16, 140);
    const cyanRingMaterial = new THREE.MeshBasicMaterial({
      color: "#38BDF8",
      transparent: true,
      opacity: 0,
    });
    const violetRingMaterial = new THREE.MeshBasicMaterial({
      color: "#FBBF24",
      transparent: true,
      opacity: 0,
    });

    const cyanRing = new THREE.Mesh(ringGeometry, cyanRingMaterial);
    const violetRing = new THREE.Mesh(ringGeometry, violetRingMaterial);
    cyanRing.scale.setScalar(0.001);
    violetRing.scale.setScalar(0.001);
    scene.add(cyanRing, violetRing);

    const portalRingMaterial = new THREE.MeshBasicMaterial({
      color: "#DC2626",
      transparent: true,
      opacity: 0,
    });
    const portalRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.4, 0.006, 12, 180),
      portalRingMaterial,
    );
    portalRing.scale.setScalar(0.001);
    scene.add(portalRing);

    let targetMouseX = 0;
    let targetMouseY = 0;
    let smoothMouseX = 0;
    let smoothMouseY = 0;
    let edgeBlend = 0;

    const onMouseMove = (event: MouseEvent) => {
      targetMouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    if (!prefersReduced) {
      window.addEventListener("mousemove", onMouseMove);
    }

    const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

    let frameId = 0;
    const animate = () => {
      const time = performance.now() * 0.001;

      smoothMouseX += (targetMouseX - smoothMouseX) * 0.06;
      smoothMouseY += (targetMouseY - smoothMouseY) * 0.06;

      const edgeTarget = edgeOrbsVisibleRef.current ? 1 : 0;
      edgeBlend += (edgeTarget - edgeBlend) * (prefersReduced ? 1 : 0.05);

      if (!prefersReduced) {
        const posAttr = particleGeometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < posAttr.count; i += 1) {
          posAttr.setX(i, posAttr.getX(i) + velocities[i * 3]);
          posAttr.setY(i, posAttr.getY(i) + velocities[i * 3 + 1]);
          posAttr.setZ(i, posAttr.getZ(i) + velocities[i * 3 + 2]);
          if (Math.abs(posAttr.getX(i)) > 11) velocities[i * 3] *= -1;
          if (Math.abs(posAttr.getY(i)) > 7) velocities[i * 3 + 1] *= -1;
          if (Math.abs(posAttr.getZ(i)) > 7) velocities[i * 3 + 2] *= -1;
        }
        posAttr.needsUpdate = true;
      }

      particles.rotation.y = time * 0.04 + smoothMouseX * 0.12;
      particles.rotation.x = Math.sin(time * 0.25) * 0.05 + smoothMouseY * 0.08;

      streaks.rotation.y = -time * 0.05;
      streaks.rotation.z = smoothMouseX * 0.06;
      streaks.position.x = Math.sin(time * 0.55) * 0.14 + smoothMouseX * 0.35;

      const edgeParallaxX = smoothMouseX * 0.18;
      const edgeParallaxY = smoothMouseY * 0.12;

      blueOrb.position.set(
        lerp(0, EDGE.blueOrb.x + edgeParallaxX, edgeBlend),
        lerp(0, EDGE.blueOrb.y + edgeParallaxY, edgeBlend),
        EDGE.blueOrb.z,
      );
      blueOrb.scale.setScalar(
        lerp(0.001, EDGE.blueOrb.scale, edgeBlend),
      );
      blueOrb.rotation.x = time * 0.4;
      blueOrb.rotation.y = time * 0.28;
      blueOrbMaterial.opacity = OPACITY.blueOrb * edgeBlend;

      violetOrb.position.set(
        lerp(0, EDGE.violetOrb.x - edgeParallaxX * 0.8, edgeBlend),
        lerp(0, EDGE.violetOrb.y - edgeParallaxY * 0.8, edgeBlend),
        EDGE.violetOrb.z,
      );
      violetOrb.scale.setScalar(
        lerp(0.001, EDGE.violetOrb.scale, edgeBlend),
      );
      violetOrb.rotation.x = -time * 0.26;
      violetOrb.rotation.y = time * 0.34;
      violetOrbMaterial.opacity = OPACITY.violetOrb * edgeBlend;

      cyanRing.position.set(
        lerp(0, EDGE.cyanRing.x - edgeParallaxX * 0.5, edgeBlend),
        lerp(0, EDGE.cyanRing.y + edgeParallaxY * 0.6, edgeBlend),
        EDGE.cyanRing.z,
      );
      cyanRing.scale.setScalar(
        lerp(0.001, EDGE.cyanRing.scale, edgeBlend),
      );
      cyanRing.rotation.z = time * 0.2;
      cyanRing.rotation.x = 1.25 + smoothMouseY * 0.08;
      cyanRingMaterial.opacity = OPACITY.cyanRing * edgeBlend;

      violetRing.position.set(
        lerp(0, EDGE.violetRing.x + edgeParallaxX * 0.6, edgeBlend),
        lerp(0, EDGE.violetRing.y - edgeParallaxY * 0.5, edgeBlend),
        EDGE.violetRing.z,
      );
      violetRing.scale.setScalar(
        lerp(0.001, EDGE.violetRing.scale, edgeBlend),
      );
      violetRing.rotation.z = -time * 0.17;
      violetRing.rotation.x = 1.1 - smoothMouseY * 0.06;
      violetRingMaterial.opacity = OPACITY.violetRing * edgeBlend;

      portalRing.position.set(
        lerp(0, EDGE.portalRing.x, edgeBlend),
        lerp(0, EDGE.portalRing.y + edgeParallaxY * 0.25, edgeBlend),
        EDGE.portalRing.z,
      );
      portalRing.scale.setScalar(
        lerp(0.001, EDGE.portalRing.scale * (1 + Math.sin(time * 0.8) * 0.04), edgeBlend),
      );
      portalRing.rotation.z = time * 0.08;
      portalRing.rotation.x = time * 0.12;
      portalRingMaterial.opacity = OPACITY.portalRing * edgeBlend;

      camera.position.x = smoothMouseX * 0.55;
      camera.position.y = -smoothMouseY * 0.35;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      particleGeometry.dispose();
      particleMaterial.dispose();
      streakGeometry.dispose();
      streakMaterial.dispose();
      orbGeometry.dispose();
      blueOrbMaterial.dispose();
      violetOrbMaterial.dispose();
      ringGeometry.dispose();
      cyanRingMaterial.dispose();
      violetRingMaterial.dispose();
      portalRing.geometry.dispose();
      portalRingMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="scene-3d-layer pointer-events-none fixed inset-0 -z-10 opacity-80"
      aria-hidden
    />
  );
}

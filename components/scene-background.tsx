"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function SceneBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

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
    const blueOrb = new THREE.Mesh(
      orbGeometry,
      new THREE.MeshBasicMaterial({
        color: "#DC2626",
        wireframe: true,
        transparent: true,
        opacity: 0.85,
      }),
    );
    const violetOrb = new THREE.Mesh(
      orbGeometry,
      new THREE.MeshBasicMaterial({
        color: "#F59E0B",
        wireframe: true,
        transparent: true,
        opacity: 0.75,
      }),
    );

    blueOrb.position.set(3.8, 1.5, -1);
    blueOrb.scale.setScalar(1.35);
    violetOrb.position.set(-3.6, -1.2, -2);
    violetOrb.scale.setScalar(0.9);
    scene.add(blueOrb, violetOrb);

    const ringGeometry = new THREE.TorusGeometry(1.7, 0.01, 16, 140);
    const cyanRing = new THREE.Mesh(
      ringGeometry,
      new THREE.MeshBasicMaterial({
        color: "#38BDF8",
        transparent: true,
        opacity: 0.5,
      }),
    );
    const violetRing = new THREE.Mesh(
      ringGeometry,
      new THREE.MeshBasicMaterial({
        color: "#FBBF24",
        transparent: true,
        opacity: 0.35,
      }),
    );
    cyanRing.position.set(2.7, 0.6, -2.4);
    cyanRing.rotation.set(1.25, 0.2, 0.3);
    violetRing.position.set(-2.5, -0.8, -2.8);
    violetRing.rotation.set(1.1, -0.35, -0.2);
    violetRing.scale.setScalar(0.72);
    scene.add(cyanRing, violetRing);

    const portalRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.4, 0.006, 12, 180),
      new THREE.MeshBasicMaterial({
        color: "#DC2626",
        transparent: true,
        opacity: 0.2,
      }),
    );
    portalRing.position.z = -4;
    scene.add(portalRing);

    let targetMouseX = 0;
    let targetMouseY = 0;
    let smoothMouseX = 0;
    let smoothMouseY = 0;

    const onMouseMove = (event: MouseEvent) => {
      targetMouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    if (!prefersReduced) {
      window.addEventListener("mousemove", onMouseMove);
    }

    let frameId = 0;
    const animate = () => {
      const time = performance.now() * 0.001;

      smoothMouseX += (targetMouseX - smoothMouseX) * 0.06;
      smoothMouseY += (targetMouseY - smoothMouseY) * 0.06;

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

      blueOrb.rotation.x = time * 0.4;
      blueOrb.rotation.y = time * 0.28;
      blueOrb.position.y = 1.5 + Math.sin(time * 1.1) * 0.2;
      blueOrb.position.x = 3.8 + smoothMouseX * 0.45;

      violetOrb.rotation.x = -time * 0.26;
      violetOrb.rotation.y = time * 0.34;
      violetOrb.position.y = -1.2 + Math.cos(time * 0.95) * 0.18;
      violetOrb.position.x = -3.6 - smoothMouseX * 0.35;

      cyanRing.rotation.z = time * 0.2;
      cyanRing.rotation.x = smoothMouseY * 0.15;
      violetRing.rotation.z = -time * 0.17;
      portalRing.rotation.z = time * 0.08;
      portalRing.rotation.x = time * 0.12 + smoothMouseY * 0.1;
      portalRing.scale.setScalar(1 + Math.sin(time * 0.8) * 0.04);

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
      blueOrb.material.dispose();
      violetOrb.material.dispose();
      ringGeometry.dispose();
      cyanRing.material.dispose();
      violetRing.material.dispose();
      portalRing.geometry.dispose();
      portalRing.material.dispose();
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

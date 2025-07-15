"use client";

import React, { useRef, useEffect, useCallback } from 'react';
import { cn } from '../../lib/utils';

interface ParticlesProps extends React.HTMLAttributes<HTMLDivElement> {
  quantity?: number;
  staticity?: number;
  ease?: number;
  refresh?: boolean;
}

// Helper class for particle logic
class Circle {
  private x: number;
  private y: number;
  private r: number;
  private vx: number;
  private vy: number;
  private w: number;
  private h: number;
  private color: string;

  constructor(private context: CanvasRenderingContext2D, private canvasSize: { w: number, h: number }) {
    this.x = Math.random() * canvasSize.w;
    this.y = Math.random() * canvasSize.h;
    this.r = Math.random() * 1 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.w = canvasSize.w;
    this.h = canvasSize.h;
    this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;
  }

  public update(mouse: { x: number, y: number }, staticity: number, ease: number) {
    // Movement
    this.x += this.vx * staticity;
    this.y += this.vy * staticity;

    // Boundary check
    if (this.x > this.w) this.x = 0;
    if (this.x < 0) this.x = this.w;
    if (this.y > this.h) this.y = 0;
    if (this.y < 0) this.y = this.h;

    // Mouse interaction
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 100) { // Interaction radius
      this.vx = this.vx + (dx / dist) * -0.5;
      this.vy = this.vy + (dy / dist) * -0.5;
    }

    // Easing / friction
    this.vx *= (1 - ease);
    this.vy *= (1 - ease);
  }

  public draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
  }
}


export const Particles: React.FC<ParticlesProps> = ({
  className,
  quantity = 30,
  staticity = 50,
  ease = 50,
  refresh = false,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<any[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const canvasSize = useRef({ w: 0, h: 0 });
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;

  const onMouseMove = (e: MouseEvent) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside = x < w && x > 0 && y < h && y > 0;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    }
  };
  
  const resizeCanvas = useCallback(() => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current.length = 0;
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);
      for (let i = 0; i < quantity; i++) {
        circles.current.push(new Circle(context.current, canvasSize.current));
      }
    }
  }, [quantity, dpr]);
  
  const animate = useCallback(() => {
    if (context.current && canvasSize.current.w > 0) {
      context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
      circles.current.forEach((circle) => circle.update(mouse.current, staticity / 1000, ease / 1000));
      circles.current.forEach((circle) => circle.draw(context.current));
    }
    requestAnimationFrame(animate);
  }, [ease, staticity]);

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext('2d');
    }
    resizeCanvas();
    animate();
    window.addEventListener('resize', resizeCanvas);
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [animate, resizeCanvas]);
  
  useEffect(() => {
    onMouseMove({ clientX: 0, clientY: 0 } as MouseEvent);
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  useEffect(() => {
    if (refresh) {
      resizeCanvas();
    }
  }, [refresh, resizeCanvas]);

  return (
    <div className={cn("absolute inset-0 -z-10", className)} ref={canvasContainerRef} aria-hidden="true" {...props}>
      <canvas ref={canvasRef} />
    </div>
  );
}; 
import { useEffect, useRef } from "react";

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // On force TS à considérer ctx comme non nul
    const ctx = canvas.getContext("2d")!;
    
    // On utilise canvasElement pour garantir que canvas n'est pas nul dans la classe Bubble
    const canvasElement = canvas;

    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;

    const bubblesArray: Bubble[] = [];
    const numberOfBubbles = 100;

    class Bubble {
      x: number;
      y: number;
      size: number;
      speedY: number;
      opacity: number;
      color: string;
      shadowBlur: number;

      constructor() {
        this.x = Math.random() * canvasElement.width;
        this.y = canvasElement.height + Math.random() * 100;
        this.size = Math.random() * 5 + 2;
        this.speedY = (Math.random() * 3 + 1)/7;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = `rgba(255, 255, 255, ${this.opacity})`;
        this.shadowBlur = Math.random() * 100;
      }

      update() {
        this.y -= this.speedY;
        if (this.y < -this.size) {
          this.y = canvasElement.height + this.size;
          this.x = Math.random() * canvasElement.width;
          this.speedY = (Math.random() * 3 + 1)/7;
          this.size = Math.random() * 5 + 2;
          this.opacity = Math.random() * 0.5 + 0.2;
          this.color = `rgba(255, 255, 255, ${this.opacity})`;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.shadowBlur;
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
      }
    }

    function init() {
      for (let i = 0; i < numberOfBubbles; i++) {
        bubblesArray.push(new Bubble());
      }
    }

    function handleBubbles() {
      bubblesArray.forEach((bubble) => {
        bubble.update();
        bubble.draw();
      });
    }

    function animate() {
      ctx.fillStyle = "hsl(262.1 83.3% 57.8%)";
      ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
      handleBubbles();
      requestAnimationFrame(animate);
    }

    const resizeListener = () => {
      canvasElement.width = window.innerWidth;
      canvasElement.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeListener);

    init();
    animate();

    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  return (
    <div className="h-svh z-[-1] fixed top-0">
      <canvas ref={canvasRef} className="left-0 w-full h-full" />
    </div>
  );
}
